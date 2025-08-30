const mongoose=require("mongoose")
const {Schema}=mongoose

const orderSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    item:{
        type:[Schema.Types.Mixed],
        required:true
    },
    address:{
        type:[Schema.Types.Mixed],
        required:true
    },
    status:{
        type:String,
        enum:['Pending','Dispatched','Out for delivery','Delivered','Cancelled'],
        default:'Pending'
    },
    paymentMode:{
        type:String,
        enum:['COD','UPI','CARD','razorpay'],
        required:true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    total:{
        type:Number,
        required:true
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    paymentCompletedAt: {
        type: Date
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{versionKey:false})

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports=mongoose.model("Order",orderSchema)