const mongoose=require("mongoose")
const {Schema}=mongoose

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    chitPlan: {
        planId: {
            type: Number,
            enum: [1, 2, 3]
        },
        planName: String,
        startDate: Date,
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled'],
            default: 'active'
        },
        subscribedAt: Date
    },
    phone: String
})

module.exports=mongoose.model("User",userSchema)