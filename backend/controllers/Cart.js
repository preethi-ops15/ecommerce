const Cart=require('../models/Cart')
const User = require('../models/User')

exports.create=async(req,res)=>{
    try {
        const created=await new Cart(req.body).populate({path:"product",populate:[{path:"brand"},{path:"category"}]});
        await created.save()
        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error adding product to cart, please trying again later'})
    }
}

exports.getByUserId=async(req,res)=>{
    try {
        const {id}=req.params
        const result = await Cart.find({ user: id }).populate({path:"product",populate:[{path:"brand"},{path:"category"}]});

        // Determine membership
        const user = await User.findById(id).lean();
        const isMember = !!(user && user.chitPlan && user.chitPlan.status === 'active');

        const computePrice = (p, member) => {
            if (!p) return 0;
            if (member) {
                if (p.memberPrice && p.memberPrice > 0) return p.memberPrice;
                if (p.salePrice && p.salePrice > 0) return p.salePrice;
                return p.price;
            } else {
                if (p.salePrice && p.salePrice > 0) return p.salePrice;
                if (p.userPrice && p.userPrice > 0) return p.userPrice;
                return p.price;
            }
        }

        const enriched = result.map(ci => {
            const unitPrice = computePrice(ci.product, isMember);
            const lineTotal = unitPrice * (ci.quantity || 1);
            return {
                ...ci.toObject(),
                effectiveUnitPrice: unitPrice,
                lineTotal
            }
        })

        res.status(200).json(enriched)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error fetching cart items, please trying again later'})
    }
}

exports.updateById=async(req,res)=>{
    try {
        const {id}=req.params
        const updated=await Cart.findByIdAndUpdate(id,req.body,{new:true}).populate({path:"product",populate:[{path:"brand"},{path:"category"}]});
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error updating cart items, please trying again later'})
    }
}

exports.deleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const deleted=await Cart.findByIdAndDelete(id)
        res.status(200).json(deleted)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error deleting cart item, please trying again later'})
    }
}

exports.deleteByUserId=async(req,res)=>{

    try {
        const {id}=req.params
        await Cart.deleteMany({user:id})
        res.sendStatus(204)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Some Error occured while resetting your cart"})
    }

}