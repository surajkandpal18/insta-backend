import jwt from 'jsonwebtoken'

const authMe=(req,res,next)=>{
    const token=req.header('token');
    console.log(token)
    if(!token) return res.status(401).json({msg:"Auth error"});
    
    try{
        const decoded=jwt.verify(token,"randomString");
        req.user=decoded.user;
        next();
    }
    catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
}

export default authMe;