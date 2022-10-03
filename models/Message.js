import mongoose from "mongoose"

let Schema=new mongoose.Schema({
    message:{
        type:"String",
        required:[true,"Please Provide The Message"],
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"SocketAppUsers"
    }
})

export default mongoose.model("SocketAppMessages",Schema)