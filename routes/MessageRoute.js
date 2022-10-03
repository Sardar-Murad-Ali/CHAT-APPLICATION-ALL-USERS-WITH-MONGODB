
import express from "express"
let router=express.Router()

import Authenticate from "../middleware/auth.js"

import {createMessage,getAllMessages} from "../controllers/Message.js"

router.route("/").post(Authenticate,createMessage).get(Authenticate,getAllMessages)


export default router
