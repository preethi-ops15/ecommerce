exports.sanitizeUser=(user)=>{
    return {
        _id:user._id,
        name:user.name, // include name
        email:user.email,
        isVerified:user.isVerified,
        isAdmin:user.isAdmin
    }
}