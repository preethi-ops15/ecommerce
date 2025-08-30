import { createSlice } from '@reduxjs/toolkit';

// Initial products (same as your current shop products)
const initialProducts = [
  {
    id: 1,
    name: "Silver Necklace",
    price: 2999,
    image: "/api/placeholder/300/300",
    description: "Elegant silver necklace with intricate design",
    sku: "SN-001",
    materialSpecs: "925 Sterling Silver",
    dimensions: "45cm length",
    gemstoneDetails: "N/A",
    userPrice: 2999,
    salePrice: 2699,
    memberPrice: 2499,
    imageAltText: "Elegant silver necklace with intricate design",
    category: "Necklaces"
  },
  {
    id: 2,
    name: "Gold Earrings",
    price: 4999,
    image: "/api/placeholder/300/300",
    description: "Beautiful gold earrings for special occasions",
    sku: "GE-002",
    materialSpecs: "18K Gold",
    dimensions: "2cm x 1.5cm",
    gemstoneDetails: "N/A",
    userPrice: 4999,
    salePrice: 4499,
    memberPrice: 4199,
    imageAltText: "Beautiful gold earrings for special occasions",
    category: "Earrings"
  },
  {
    id: 3,
    name: "Diamond Ring",
    price: 15999,
    image: "/api/placeholder/300/300",
    description: "Stunning diamond ring with premium quality",
    sku: "DR-003",
    materialSpecs: "18K White Gold",
    dimensions: "Ring size 6-8 adjustable",
    gemstoneDetails: "1 Carat, VVS1, G Color Diamond",
    userPrice: 15999,
    salePrice: 14999,
    memberPrice: 13999,
    imageAltText: "Stunning diamond ring with premium quality",
    category: "Rings"
  },
  {
    id: 4,
    name: "Silver Bracelet",
    price: 1999,
    image: "/api/placeholder/300/300",
    description: "Stylish silver bracelet for everyday wear",
    sku: "SB-004",
    materialSpecs: "925 Sterling Silver",
    dimensions: "18cm length, adjustable",
    gemstoneDetails: "N/A",
    userPrice: 1999,
    salePrice: 1799,
    memberPrice: 1599,
    imageAltText: "Stylish silver bracelet for everyday wear",
    category: "Bracelets"
  },
  {
    id: 5,
    name: "Gold Chain",
    price: 8999,
    image: "/api/placeholder/300/300",
    description: "Classic gold chain with traditional design",
    sku: "GC-005",
    materialSpecs: "22K Gold",
    dimensions: "50cm length",
    gemstoneDetails: "N/A",
    userPrice: 8999,
    salePrice: 8499,
    memberPrice: 7999,
    imageAltText: "Classic gold chain with traditional design",
    category: "Chains"
  },
  {
    id: 6,
    name: "Pearl Necklace",
    price: 3999,
    image: "/api/placeholder/300/300",
    description: "Elegant pearl necklace for formal events",
    sku: "PN-006",
    materialSpecs: "Freshwater Pearls, Silver Clasp",
    dimensions: "40cm length",
    gemstoneDetails: "8-9mm Freshwater Pearls",
    userPrice: 3999,
    salePrice: 3599,
    memberPrice: 3299,
    imageAltText: "Elegant pearl necklace for formal events",
    category: "Necklaces"
  }
];

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: initialProducts,
    nextId: 7, // Next available ID for new products
    loading: false,
    error: null
  },
  reducers: {
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: state.nextId,
        price: parseFloat(action.payload.userPrice) || 0,
        userPrice: parseFloat(action.payload.userPrice) || 0,
        salePrice: parseFloat(action.payload.salePrice) || 0,
        memberPrice: parseFloat(action.payload.memberPrice) || 0
      };
      state.products.push(newProduct);
      state.nextId += 1;
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          ...action.payload,
          price: parseFloat(action.payload.userPrice) || state.products[index].price,
          userPrice: parseFloat(action.payload.userPrice) || state.products[index].userPrice,
          salePrice: parseFloat(action.payload.salePrice) || state.products[index].salePrice,
          memberPrice: parseFloat(action.payload.memberPrice) || state.products[index].memberPrice
        };
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(product => product.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  setLoading, 
  setError 
} = productSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.products.products;
export const selectProductById = (state, productId) => 
  state.products.products.find(product => product.id === productId);
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

export default productSlice.reducer;
