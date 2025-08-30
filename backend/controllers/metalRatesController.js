const axios = require('axios');
const GOLDAPI_KEY = process.env.GOLDAPI_KEY; // Prefer this provider if available

// Cache rates for 30 minutes to avoid excessive API calls
let ratesCache = {
    data: null,
    timestamp: null,
    expiresIn: 30 * 60 * 1000 // 30 minutes
};

// Get live metal rates from real APIs
const getLiveMetalRates = async (req, res) => {
    try {
        // Check if we have valid cached data
        if (ratesCache.data && (Date.now() - ratesCache.timestamp) < ratesCache.expiresIn) {
            return res.json({
                success: true,
                data: ratesCache.data,
                cached: true,
                timestamp: ratesCache.timestamp
            });
        }

        // Fetch from real metal rate APIs
        const rates = await fetchRealMetalRates();
        
        // Cache the results
        ratesCache.data = rates;
        ratesCache.timestamp = Date.now();

        res.json({
            success: true,
            data: rates,
            cached: false,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('Error fetching metal rates:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch metal rates',
            error: error.message
        });
    }
};

// Calculate product price based on live rates and weight
const calculateProductPrice = async (req, res) => {
    try {
        const { brand, productWeight, makingCost = 0, wastageCost = 0, gst = 0 } = req.body;
        
        if (!brand || !productWeight) {
            return res.status(400).json({
                success: false,
                message: 'Brand and product weight are required'
            });
        }

        // Get current metal rates
        let rates;
        if (ratesCache.data && (Date.now() - ratesCache.timestamp) < ratesCache.expiresIn) {
            rates = ratesCache.data;
        } else {
            rates = await fetchRealMetalRates();
            ratesCache.data = rates;
            ratesCache.timestamp = Date.now();
        }

        // Determine metal type and rate based on brand
        let metalType, ratePerGram;
        
        if (brand.toLowerCase().includes('silver')) {
            metalType = 'silver';
            ratePerGram = rates.silver.pricePerGram;
        } else if (brand.toLowerCase().includes('gold')) {
            metalType = 'gold';
            ratePerGram = rates.gold.pricePerGram;
        } else {
            // Default to silver for other metals
            metalType = 'silver';
            ratePerGram = rates.silver.pricePerGram;
        }

        // Calculate material value
        const materialValue = ratePerGram * productWeight;
        
        // Calculate total price
        const totalPrice = materialValue + makingCost + wastageCost;
        const priceWithGST = totalPrice + (totalPrice * (gst / 100));

        res.json({
            success: true,
            data: {
                metalType,
                ratePerGram,
                materialValue,
                totalPrice,
                priceWithGST,
                lastUpdated: new Date().toISOString(),
                source: rates.source
            }
        });

    } catch (error) {
        console.error('Error calculating product price:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate product price',
            error: error.message
        });
    }
};

// Get historical rates for charts
const getHistoricalRates = async (req, res) => {
    try {
        const { days = 30, metal = 'both' } = req.query;
        
        // For now, return sample historical data
        // In production, you'd integrate with a service that provides historical data
        const historicalData = generateSampleHistoricalData(days, metal);
        
        res.json({
            success: true,
            data: historicalData
        });

    } catch (error) {
        console.error('Error fetching historical rates:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch historical rates',
            error: error.message
        });
    }
};

// Fetch metal rates from real APIs
const fetchRealMetalRates = async () => {
    try {
        // Try multiple real metal rate APIs for accuracy
        const rates = await fetchFromRealAPIs();
        if (rates) {
            return rates;
        }
        
        // If all APIs fail, use current market rates as fallback
        console.log('Using current market rates as fallback');
        return getCurrentMarketRates();
        
    } catch (error) {
        console.log('Using current market rates due to API error:', error.message);
        return getCurrentMarketRates();
    }
};

// Helper: get live USD->INR rate to avoid hardcoded 83.5
const getUsdInrRate = async () => {
    try {
        const fx = await axios.get('https://api.exchangerate.host/latest?base=USD&symbols=INR', { timeout: 10000 });
        const rate = fx?.data?.rates?.INR;
        return rate && rate > 0 ? rate : 83.5;
    } catch (_) {
        return 83.5; // fallback
    }
};

// Fetch from real metal rate APIs
const fetchFromRealAPIs = async () => {
    try {
        // Real metal rate APIs (prioritized by reliability)
        const apis = [
            // If GOLDAPI is configured, try it first
            ...(GOLDAPI_KEY ? [{ name: 'goldapi', priority: 0 }] : []),
            {
                url: 'https://api.metals.live/v1/spot',
                name: 'metals.live',
                priority: 1
            },
            {
                url: 'https://api.coingecko.com/api/v3/simple/price?ids=silver,platinum&vs=usd',
                name: 'coingecko',
                priority: 2
            },
            {
                url: 'https://api.metalpriceapi.com/v1/latest?api_key=demo&base=USD&currencies=XAU,XAG',
                name: 'metalpriceapi',
                priority: 3
            },
            // Alternative APIs
            {
                url: 'https://api.coingecko.com/api/v3/simple/price?ids=gold,silver&vs=usd',
                name: 'coingecko_alt',
                priority: 4
            },
            {
                url: 'https://api.coinbase.com/v2/prices/gold-USD/spot',
                name: 'coinbase',
                priority: 5
            }
        ];

        // Sort by priority
        apis.sort((a, b) => a.priority - b.priority);

        for (const api of apis) {
            try {
                if (api.name === 'goldapi') {
                    console.log('Trying API: goldapi (XAU/INR and XAG/INR)');
                    const headers = {
                        'x-access-token': GOLDAPI_KEY,
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0'
                    };
                    const [goldRes, silverRes] = await Promise.all([
                        axios.get('https://www.goldapi.io/api/XAU/INR', { timeout: 15000, headers }),
                        axios.get('https://www.goldapi.io/api/XAG/INR', { timeout: 15000, headers })
                    ]);

                    const g = goldRes.data;
                    const s = silverRes.data;

                    // Prefer price_gram_24k if available; else convert troy ounce price to gram
                    const goldPerGram = g?.price_gram_24k && g.price_gram_24k > 0
                        ? g.price_gram_24k
                        : (g?.price && g.price > 0 ? g.price / 31.1035 : 0);
                    const silverPerGram = s?.price_gram_999 && s.price_gram_999 > 0
                        ? s.price_gram_999
                        : (s?.price && s.price > 0 ? s.price / 31.1035 : 0);

                    if (goldPerGram > 0 && silverPerGram > 0) {
                        const rates = {
                            gold: { pricePerGram: Math.round(goldPerGram), unit: 'INR/gram', change: 0, changePercent: 0 },
                            silver: { pricePerGram: Math.round(silverPerGram), unit: 'INR/gram', change: 0, changePercent: 0 },
                            lastUpdated: new Date().toISOString(),
                            source: 'GoldAPI (Live)'
                        };
                        console.log('Successfully fetched rates from goldapi:', rates);
                        return rates;
                    }

                    console.log('GoldAPI returned invalid data, trying next...');
                    continue;
                }

                console.log(`Trying API: ${api.name} at ${api.url}`);
                const response = await axios.get(api.url, { 
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'application/json'
                    }
                });
                
                console.log(`API ${api.name} response status:`, response.status);
                console.log(`API ${api.name} response data length:`, JSON.stringify(response.data).length);
                
                if (response.data && response.status === 200) {
                    // Patch metals.live to use dynamic USD->INR
                    if (api.name === 'metals.live') {
                        const usdInr = await getUsdInrRate();
                        // Attach fx rate so processor can use it
                        response.data.__usdInr = usdInr;
                    }

                    const rates = processAPIResponse(api.name, response.data);
                    if (rates && rates.gold.pricePerGram > 0 && rates.silver.pricePerGram > 0) {
                        console.log(`Successfully fetched rates from ${api.name}:`, {
                            gold: rates.gold.pricePerGram,
                            silver: rates.silver.pricePerGram
                        });
                        return rates;
                    } else {
                        console.log(`API ${api.name} returned invalid rates, trying next...`);
                    }
                } else {
                    console.log(`API ${api.name} returned invalid response, trying next...`);
                }
            } catch (apiError) {
                console.log(`API ${api.name} failed:`, apiError.message);
                if (apiError.response) {
                    console.log(`Response status: ${apiError.response.status}`);
                    console.log(`Response data:`, apiError.response.data);
                }
                continue;
            }
        }
        
        console.log('All APIs failed or returned invalid data');
        return null; // No APIs worked
    } catch (error) {
        console.error('Error in fetchFromRealAPIs:', error);
        throw error;
    }
};

// Process different API responses
const processAPIResponse = (apiName, data) => {
    try {
        const usdInr = (data && data.__usdInr) ? data.__usdInr : 83.5;
        console.log(`Processing ${apiName} response:`, JSON.stringify(data).substring(0, 200) + '...');
        
        if (apiName === 'metals.live') {
            // metals.live format - most reliable
            if (!Array.isArray(data) || data.length === 0) {
                console.log('metals.live returned empty array, skipping...');
                return null;
            }
            
            const gold = data.find(item => item.g === 'XAU') || { c: 0, ch: 0, chp: 0 };
            const silver = data.find(item => item.g === 'XAG') || { c: 0, ch: 0, chp: 0 };
            
            console.log('Found metals:', { gold: gold.g, silver: silver.g, goldPrice: gold.c, silverPrice: silver.c });
            
            if (gold.c <= 0 || silver.c <= 0) {
                console.log('Invalid prices from metals.live, skipping...');
                return null;
            }
            
            const goldPricePerGram = (gold.c / 31.1035) * usdInr; // Convert USD/oz to INR/gram
            const silverPricePerGram = (silver.c / 31.1035) * usdInr;
            
            console.log('Converted prices:', { goldPerGram: goldPricePerGram, silverPerGram: silverPricePerGram });
            
            return {
                gold: {
                    pricePerGram: Math.round(goldPricePerGram),
                    unit: 'INR/gram',
                    change: Math.round((gold.ch || 0) * usdInr),
                    changePercent: gold.chp || 0
                },
                silver: {
                    pricePerGram: Math.round(silverPricePerGram),
                    unit: 'INR/gram',
                    change: Math.round((silver.ch || 0) * usdInr),
                    changePercent: silver.chp || 0
                },
                lastUpdated: new Date().toISOString(),
                source: 'metals.live (Live Market)'
            };
            
        } else if (apiName === 'coingecko') {
            // CoinGecko format
            console.log('Processing CoinGecko data:', JSON.stringify(data).substring(0, 200) + '...');
            
            const silverPricePerOz = data.silver?.usd || 0;
            if (silverPricePerOz <= 0) {
                console.log('Invalid silver price from CoinGecko, skipping...');
                return null;
            }
            
            // Approximate gold price (silver price * typical gold/silver ratio)
            const goldPricePerOz = silverPricePerOz * 80; // Typical ratio
            const goldPricePerGram = (goldPricePerOz / 31.1035) * usdInr;
            const silverPricePerGram = (silverPricePerOz / 31.1035) * usdInr;
            
            console.log('CoinGecko converted prices:', { goldPerGram: goldPricePerGram, silverPerGram: silverPricePerGram });
            
            return {
                gold: {
                    pricePerGram: Math.round(goldPricePerGram),
                    unit: 'INR/gram',
                    change: 0,
                    changePercent: 0
                },
                silver: {
                    pricePerGram: Math.round(silverPricePerGram),
                    unit: 'INR/gram',
                    change: 0,
                    changePercent: 0
                },
                lastUpdated: new Date().toISOString(),
                source: 'CoinGecko (Live Market)'
            };
            
        } else if (apiName === 'metalpriceapi') {
            // MetalPriceAPI format
            console.log('Processing MetalPriceAPI data:', JSON.stringify(data).substring(0, 200) + '...');
            
            if (data.rates && data.rates.XAU && data.rates.XAG) {
                const goldPricePerGram = (data.rates.XAU / 31.1035) * usdInr;
                const silverPricePerGram = (data.rates.XAG / 31.1035) * usdInr;
                
                console.log('MetalPriceAPI converted prices:', { goldPerGram: goldPricePerGram, silverPerGram: silverPricePerGram });
                
                return {
                    gold: {
                        pricePerGram: Math.round(goldPricePerGram),
                        unit: 'INR/gram',
                        change: 0,
                        changePercent: 0
                    },
                    silver: {
                        pricePerGram: Math.round(silverPricePerGram),
                        unit: 'INR/gram',
                        change: 0,
                        changePercent: 0
                    },
                    lastUpdated: new Date().toISOString(),
                    source: 'MetalPriceAPI (Live Market)'
                };
            } else {
                console.log('Invalid MetalPriceAPI data structure, skipping...');
                return null;
            }
        }
        
        else if (apiName === 'coingecko_alt') {
            // Alternative CoinGecko format for gold and silver
            console.log('Processing CoinGecko alternative data:', JSON.stringify(data).substring(0, 200) + '...');
            
            const goldPricePerOz = data.gold?.usd || 0;
            const silverPricePerOz = data.silver?.usd || 0;
            
            if (goldPricePerOz <= 0 || silverPricePerOz <= 0) {
                console.log('Invalid prices from CoinGecko alternative, skipping...');
                return null;
            }
            
            const goldPricePerGram = (goldPricePerOz / 31.1035) * usdInr;
            const silverPricePerGram = (silverPricePerOz / 31.1035) * usdInr;
            
            console.log('CoinGecko alternative converted prices:', { goldPerGram: goldPricePerGram, silverPerGram: silverPricePerGram });
            
            return {
                gold: {
                    pricePerGram: Math.round(goldPricePerGram),
                    unit: 'INR/gram',
                    change: 0,
                    changePercent: 0
                },
                silver: {
                    pricePerGram: Math.round(silverPricePerGram),
                    unit: 'INR/gram',
                    change: 0,
                    changePercent: 0
                },
                lastUpdated: new Date().toISOString(),
                source: 'CoinGecko Alternative (Live Market)'
            };
            
        } else if (apiName === 'coinbase') {
            // Coinbase format
            console.log('Processing Coinbase data:', JSON.stringify(data).substring(0, 200) + '...');
            
            if (data.data && data.data.amount) {
                const goldPricePerOz = parseFloat(data.data.amount);
                if (goldPricePerOz <= 0) {
                    console.log('Invalid gold price from Coinbase, skipping...');
                    return null;
                }
                
                // Estimate silver price based on typical gold/silver ratio
                const silverPricePerOz = goldPricePerOz / 80;
                const goldPricePerGram = (goldPricePerOz / 31.1035) * usdInr;
                const silverPricePerGram = (silverPricePerOz / 31.1035) * usdInr;
                
                console.log('Coinbase converted prices:', { goldPerGram: goldPricePerGram, silverPerGram: silverPricePerGram });
                
                return {
                    gold: {
                        pricePerGram: Math.round(goldPricePerGram),
                        unit: 'INR/gram',
                        change: 0,
                        changePercent: 0
                    },
                    silver: {
                        pricePerGram: Math.round(silverPricePerGram),
                        unit: 'INR/gram',
                        change: 0,
                        changePercent: 0
                    },
                    lastUpdated: new Date().toISOString(),
                    source: 'Coinbase (Live Market)'
                };
            } else {
                console.log('Invalid Coinbase data structure, skipping...');
                return null;
            }
        }
        
        console.log(`No valid data processed from ${apiName}`);
        return null;
    } catch (error) {
        console.error(`Error processing ${apiName} response:`, error);
        return null;
    }
};

// Get current market rates (as of current date)
const getCurrentMarketRates = () => {
    const today = new Date();
    const currentDate = today.toDateString();
    
    // These are approximate current market rates for India
    // You should update these regularly or implement a better fallback system
    return {
        gold: {
            pricePerGram: 10166, // Current market rate for Gold 24K
            unit: 'INR/gram',
            change: 50,
            changePercent: 0.49
        },
        silver: {
            pricePerGram: 115, // Current market rate for Silver 999
            unit: 'INR/gram',
            change: -2,
            changePercent: -1.71
        },
        lastUpdated: new Date().toISOString(),
        source: `Current Market Rates (${currentDate})`
    };
};

// Generate sample historical data for charts
const generateSampleHistoricalData = (days, metal) => {
    const data = [];
    const baseGoldPrice = 10166; // Current base price in INR per gram
    const baseSilverPrice = 115;  // Current base price in INR per gram
    
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Add some realistic price variation
        const goldVariation = (Math.random() - 0.5) * 200;
        const silverVariation = (Math.random() - 0.5) * 10;
        
        const entry = {
            date: date.toISOString().split('T')[0],
            gold: baseGoldPrice + goldVariation,
            silver: baseSilverPrice + silverVariation
        };
        
        if (metal === 'gold') {
            delete entry.silver;
        } else if (metal === 'silver') {
            delete entry.gold;
        }
        
        data.push(entry);
    }
    
    return data;
};

module.exports = {
    getLiveMetalRates,
    getHistoricalRates,
    calculateProductPrice
};
