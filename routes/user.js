import express from 'express'
import {check,validationResult} from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../model/userModel.js'
import authMe from '../middleware/auth.js'

const router =express.Router();


router.post(
    "/signup",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
        check("displayName","Please Enter a display Name").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").not()
        .isEmpty()
    ],
     async (req, res) => {
          const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {username,email,displayName,password}=req.body;  //destructure request body

            try{
                 let user=await userModel.findOne({                  //find one entry with given email if not founf returns null
                     email:email
                 })

                 console.log(user)

                 if(user){                         //check if user is null if true set status as 400 and return 
                     return res.status(400).json({
                         msg:'user already exists'
                     })
                 }
                 let profilePic="";
                 let createdAt=Date.now();

                let newuser = new userModel({
                username,
                displayName,
                email,
                password,
                profilePic,
                createdAt
            });

                 const salt = await bcrypt.genSalt(10);
                 newuser.password = await bcrypt.hash(password, salt);
                 await newuser.save();

                 const payload = {
                user: {
                    id: newuser.id
                }
            };
            jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET,
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
             } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }

     });

     router.post('/login',[
         check("email","Please Enter a email").not().isEmpty(),
         check("email","Please Enter a valid email").isEmail(),
         check("password","Please Enter a password").not().isEmpty()
     ],async(req,res)=>{
         const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {email,password}=req.body;

            try {

                let signedInUser=await userModel.findOne({
                    email
                });

                if(!signedInUser){
                    res.status(400).json({msg:"User does not exist !!"})
                }

                const isMatch=await bcrypt.compare(password,signedInUser.password);

                if(!isMatch) return res.status(400).json({msg:"Incorrect Password !!!"})

                const payload={
                    user: {
                    id: signedInUser.id
                    }
                };

                jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,(err,token)=>{
                    if (err) throw err;
                    res.status(200).json({
                        token
                    })
                })
                
            } catch (e) {
                console.error(e)
                res.status(500).json({
                    msg:'Server Error'
                })
            }
     })

     router.get("/me", authMe, async (req, res) => {
            try {
                // request.user is getting fetched from Middleware after token authentication
                const user = await userModel.findById(req.user.id,'displayName email username profilePic');
                res.json(user);
            } catch (e) {
                res.send({ message: "Error in Fetching user" });
            }
});

router.get("/someone", authMe, async (req, res) => {
            try {
                // request.user is getting fetched from Middleware after token authentication
                const user = await userModel.findById(req.user.userId,'displayName profilePic');
                res.json(user);
            } catch (e) {
                res.send({ message: "Error in Fetching user" });
            }
});


     export default router;