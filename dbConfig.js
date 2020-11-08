import mongoose from 'mongoose';

const initiateDB=()=>{
    const connection_url='mongodb+srv://sk8:vegetagoku123@cluster0.7renq.mongodb.net/instagram-clone?retryWrites=true&w=majority'
mongoose.connect(connection_url,{
useCreateIndex:true,
useNewUrlParser:true,
useUnifiedTopology:true
})

mongoose.connection.once('open',()=>console.log('DB connected'))
}

export default initiateDB;