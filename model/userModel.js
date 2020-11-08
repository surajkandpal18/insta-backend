import mongoose from 'mongoose'

const userSchema=mongoose.Schema({
    email:String,
    username:String,
    password:String,
    displayName:String,
    profilePic:String,
    createdAt:Date
})

export default mongoose.model("user", userSchema);