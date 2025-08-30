const { Schema, default: mongoose } = require("mongoose")
const Product=require("../models/Product")

exports.create=async(req,res)=>{
    try {
        console.log("=== PRODUCT CREATE DEBUG ===");
        console.log("Request headers:", req.headers);
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);
        console.log("Content-Type:", req.get('Content-Type'));
        console.log("===========================");
        
        // Check if price breakup fields are in request body
        console.log("Price Breakup Fields in Request:", {
            currentRatePerGram: req.body.currentRatePerGram,
            productWeight: req.body.productWeight,
            materialValue: req.body.materialValue,
            makingCost: req.body.makingCost,
            wastageCost: req.body.wastageCost,
            gst: req.body.gst,
            totalCalculatedPrice: req.body.totalCalculatedPrice
        });
        
        // Extract form data
        const {
            title,
            description,
            price,
            salePrice,
            userPrice,
            memberPrice,
            stockQuantity,
            discountPercentage,
            category,
            brand,
            imageAltText,
            // Price breakup fields
            currentRatePerGram,
            productWeight,
            materialValue,
            makingCost,
            wastageCost,
            gst,
            totalCalculatedPrice
        } = req.body;

        console.log("Extracted fields:", {
            title, description, price, salePrice, userPrice, memberPrice,
            stockQuantity, discountPercentage, category, brand, imageAltText,
            // Price breakup fields
            currentRatePerGram, productWeight, materialValue, makingCost, wastageCost, gst, totalCalculatedPrice
        });
        
        console.log("Individual Price Breakup Fields:", {
            currentRatePerGram: currentRatePerGram,
            productWeight: productWeight,
            materialValue: materialValue,
            makingCost: makingCost,
            wastageCost: wastageCost,
            gst: gst,
            totalCalculatedPrice: totalCalculatedPrice
        });
        
        console.log("Price Breakup Fields Check:", {
            hasCurrentRatePerGram: currentRatePerGram !== undefined,
            hasProductWeight: productWeight !== undefined,
            hasMaterialValue: materialValue !== undefined,
            hasMakingCost: makingCost !== undefined,
            hasWastageCost: wastageCost !== undefined,
            hasGst: gst !== undefined,
            hasTotalCalculatedPrice: totalCalculatedPrice !== undefined
        });

        const productData = {
            title,
            description,
            price: Number(price),
            salePrice: Number(salePrice) || 0,
            userPrice: Number(userPrice) || 0,
            memberPrice: Number(memberPrice) || 0,
            stockQuantity: Number(stockQuantity),
            discountPercentage: Number(discountPercentage) || 0,
            category: category,
            brand: brand,
            imageAltText: imageAltText || "",
            // Price breakup fields
            currentRatePerGram: Number(currentRatePerGram) || 0,
            productWeight: Number(productWeight) || 0,
            materialValue: Number(materialValue) || 0,
            makingCost: Number(makingCost) || 0,
            wastageCost: Number(wastageCost) || 0,
            gst: Number(gst) || 0,
            totalCalculatedPrice: Number(totalCalculatedPrice) || 0
        };
        
        console.log("Final product data with price breakup:", {
            ...productData,
            priceBreakupFields: {
                currentRatePerGram: productData.currentRatePerGram,
                productWeight: productData.productWeight,
                materialValue: productData.materialValue,
                makingCost: productData.makingCost,
                wastageCost: productData.wastageCost,
                gst: productData.gst,
                totalCalculatedPrice: productData.totalCalculatedPrice
            }
        });

        // Handle thumbnail file - save URL path instead of file system path
        if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
            productData.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
        }

        // Handle product images - save URL paths instead of file system paths
        if (req.files && req.files.images && req.files.images.length > 0) {
            productData.images = req.files.images.map(file => `/uploads/${file.filename}`);
        }

        console.log("Final product data:", productData);
        
        const created=new Product(productData)
        await created.save()
        res.status(201).json(created)
    } catch (error) {
        console.log("ERROR:", error);
        return res.status(500).json({message:'Error adding product, please try again later'})
    }
}

exports.getAll = async (req, res) => {
    try {
        console.log("=== PRODUCT GET ALL DEBUG ===");
        console.log("Request query:", req.query);
        
        const filter={}
        const sort={}
        let skip=0
        let limit=0

        if(req.query.brand){
            filter.brand={$in:req.query.brand}
        }

        if(req.query.category){
            filter.category={$in:req.query.category}
        }

        if(req.query.search){
            filter.title={$regex:req.query.search,$options:'i'}
        }

        // Always filter out deleted products for public/user requests
        // Only show deleted products for admin requests with specific admin flag
        if(!req.query.admin){
            filter['isDeleted']=false
        }

        if(req.query.sort){
            sort[req.query.sort]=req.query.order?req.query.order==='asc'?1:-1:1
        }

        if(req.query.page && req.query.limit){

            const pageSize=req.query.limit
            const page=req.query.page

            skip=pageSize*(page-1)
            limit=pageSize
        }

        console.log("Applied filter:", filter);
        console.log("Applied sort:", sort);
        
        const totalDocs=await Product.find(filter).sort(sort).countDocuments().exec()
        const results=await Product.find(filter).sort(sort).skip(skip).limit(limit).exec()

        console.log("Total results:", totalDocs);
        console.log("Returned results:", results.length);

        res.set("X-Total-Count",totalDocs)

        res.status(200).json({
            success: true,
            products: results,
            total: totalDocs
        })
    
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error fetching products, please try again later'})
    }
};

exports.getById=async(req,res)=>{
    try {
        const {id}=req.params
        const result=await Product.findById(id)
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error getting product details, please try again later'})
    }
}

exports.updateById=async(req,res)=>{
    try {
        const {id}=req.params
        
        // Extract form data
        const {
            title,
            description,
            price,
            salePrice,
            userPrice,
            memberPrice,
            stockQuantity,
            discountPercentage,
            category,
            brand,
            imageAltText,
            // Price breakup fields
            currentRatePerGram,
            productWeight,
            materialValue,
            makingCost,
            wastageCost,
            gst,
            totalCalculatedPrice
        } = req.body;

        const updateData = {
            title,
            description,
            price: Number(price),
            salePrice: Number(salePrice) || 0,
            userPrice: Number(userPrice) || 0,
            memberPrice: Number(memberPrice) || 0,
            stockQuantity: Number(stockQuantity),
            discountPercentage: Number(discountPercentage) || 0,
            category: category,
            brand: brand,
            imageAltText: imageAltText || "",
            // Price breakup fields
            currentRatePerGram: Number(currentRatePerGram) || 0,
            productWeight: Number(productWeight) || 0,
            materialValue: Number(materialValue) || 0,
            makingCost: Number(makingCost) || 0,
            wastageCost: Number(wastageCost) || 0,
            gst: Number(gst) || 0,
            totalCalculatedPrice: Number(totalCalculatedPrice) || 0
        };

        // Handle thumbnail file - save URL path instead of file system path
        if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
            updateData.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
        }

        // Handle product images - save URL paths instead of file system paths
        if (req.files && req.files.images && req.files.images.length > 0) {
            updateData.images = req.files.images.map(file => `/uploads/${file.filename}`);
        }

        const updated=await Product.findByIdAndUpdate(id, updateData, {new: true})
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error updating product, please try again later'})
    }
}

exports.undeleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const unDeleted=await Product.findByIdAndUpdate(id,{isDeleted:false},{new:true})
        res.status(200).json(unDeleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error restoring product, please try again later'})
    }
}

exports.deleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const deleted=await Product.findByIdAndUpdate(id,{isDeleted:true},{new:true})
        res.status(200).json(deleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error deleting product, please try again later'})
    }
}


