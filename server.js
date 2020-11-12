import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Pusher from 'pusher'
//import dbModel from './model/dbModel.js'
import initiateDB from './dbConfig.js'
import bodyParser from 'body-parser'
import user from './routes/user.js'

dotenv.config()

//app config
const app=express()
const port=process.env.PORT||8080

// middleware
app.use(express.json()) //to parse all json objects
app.use(cors()) //add cors header to all requests

//db config
initiateDB();

//api routes
app.get('/',(req,res)=>res.status(200).send('Hello World'))


app.post('./upload',(req,res)=>{
    const body=req.body;
    dbModel.create(body,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})



app.get('/sync',(req,res)=>{
    dbModel.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})

app.use('/user',user);

//listener
app.listen(port,()=>console.log('listening to localhost:8080'))