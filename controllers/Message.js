import { BadRequestError } from "../errors/index.js";
import Auth from "../models/Auth.js";

import Message from "../models/Message.js";

const createMessage=async (req,res)=>{
    let {message}=req.body
    if(!message){
        throw new BadRequestError("Provide The Message")
    }

    req.body.user=req.user.userId
    
    let createMessage=await Message.create({...req.body})

    res.status(200).json({createMessage})
}

const getAllMessages=async (req,res)=>{
   let messages=await Message.find({}).populate("user")

   res.status(200).json({messages})
}

export {createMessage,getAllMessages}

