import mongoose from 'mongoose'

const postSchema=mongoose.Schema({
    caption:String,
    userId:String,
    image:String,
    comments:[]
})



export default mongoose.model('posts',postSchema);
