const User=require("../models/User")

exports.getAll=async(req,res)=>{
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;
        
        let filter = {};
        if (search) {
            filter = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        // we don't want to send the password to the frontend
        const sanitizedUsers = users.map(user => {
            const userObj = user.toObject();
            delete userObj.password;
            return userObj;
        });

        res.status(200).json({
            success: true,
            users: sanitizedUsers,
            total: total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error getting all users, please try again later'})
    }
}

exports.getById=async(req,res)=>{
    try {
        const {id}=req.params
        const result=(await User.findById(id)).toObject()
        delete result.password
        res.status(200).json(result)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error getting your details, please try again later'})
    }
}
exports.updateById=async(req,res)=>{
    try {
        const {id}=req.params
        const updated=(await User.findByIdAndUpdate(id,req.body,{new:true})).toObject()
        delete updated.password
        res.status(200).json(updated)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error getting your details, please try again later'})
    }
}