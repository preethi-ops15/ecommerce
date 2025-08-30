const mongoose=require("mongoose")
const {Schema}=mongoose

const productSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    salePrice: {
        type: Number,
        default: 0,
    },
    userPrice: {
        type: Number,
        default: 0,
    },
    memberPrice: {
        type: Number,
        default: 0,
    },
    discountPercentage: {
        type: Number,
        default: 0,
    },
    category:{
        type: String,
        required: true,
        enum: [
            'rings', 'necklaces', 'earrings', 'bracelets', 'chains', 
            'pendants', 'anklets', 'watches', 'brooches', 'cufflinks', 
            'nose-pins', 'toe-rings', 'hair-accessories', 'sets', 'other'
        ]
    },
    brand:{
        type: String,
        required: true,
        enum: [
            '925-silver', '999-silver', 'gold-plated', 'rhodium-plated', 
            'oxidized-silver', 'antique-silver', 'white-gold', 'yellow-gold', 
            'rose-gold', 'platinum', 'palladium'
        ]
    },
    stockQuantity:{
        type:Number,
        required:true
    },
    thumbnail:{
        type:String,
        default: ""
    },
    images:{
        type:[String],
        default: []
    },
    imageAltText: {
        type: String,
        default: ""
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    // Price Breakup Fields
    currentRatePerGram: {
        type: Number,
        default: 0
    },
    productWeight: {
        type: Number,
        default: 0
    },
    materialValue: {
        type: Number,
        default: 0
    },
    makingCost: {
        type: Number,
        default: 0
    },
    wastageCost: {
        type: Number,
        default: 0
    },
    gst: {
        type: Number,
        default: 0
    },
    totalCalculatedPrice: {
        type: Number,
        default: 0
    }
},{timestamps:true,versionKey:false})

module.exports=mongoose.model('Product',productSchema)