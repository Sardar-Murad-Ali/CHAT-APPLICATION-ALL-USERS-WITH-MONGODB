import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'
import fileUpload from "express-fileupload"
import { Server } from 'socket.io'
import http from "http"
import cors from "cors"

import connectDB from './db/connect.js'
import Auth from "./routes/AuthRoute.js"
import Message from "./routes/MessageRoute.js"
import Authenticate from "./middleware/auth.js"
// import Posts from "./routes/PostRoute.js"
// const cloudinary = require('cloudinary').v2

import MessageModel from "./models/Message.js"

import cloudinary from "cloudinary"

let server=http.createServer(app)

// app.use(cors())



const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});



import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'


if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(fileUpload({ useTempFiles: true }));



// The Socket Work Starts

let OnlineUsers=[]

// console.log("This is running")

io.on("connection",(socket)=>{


  socket.on("Message",(data)=>{
      io.emit("MesssageResponse",data)
  })


  socket.on("AddUser",(data)=>{
    let AlreadyExists=OnlineUsers.find((all)=>all.email===data.email)
    io.UserEmail=data.email

    if(!AlreadyExists){
      OnlineUsers.push(data)
    }
    

    io.emit("AllUsers",OnlineUsers)

    console.log(io.UserEmail)

  })


  socket.on("Typing",(data)=>{
     socket.broadcast.emit("SetTypingStatus",data)
  })


  // When the page refreshes and the we close the page the belwo will run
  socket.on("disconnect",()=>{
    console.log("User is disconnected")
  })


  socket.on("leave",(email)=>{
    console.log(`The user ${email} is Leaving`)
    OnlineUsers=OnlineUsers.filter((all)=>all.email!==email)
    io.emit("AllUsers",OnlineUsers)
  })


  
})

// The Socket Work Ends

app.use("/api/v1/auth",Auth)
app.use("/api/v1/message",Message)
// app.use("/api/v1/post",Posts)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
