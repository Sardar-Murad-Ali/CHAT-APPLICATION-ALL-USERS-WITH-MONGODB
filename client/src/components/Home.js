import { useAppContext } from "../context/appContext";
import io from "socket.io-client"
import "./index.css"
import React, { useRef } from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {authFetch} from "../utils"
import { MessageSharp, SetMealSharp } from "@mui/icons-material";




const Home = ({socket}) => {
  let {user,CreateMessage,logoutUser}=useAppContext()
  
  let lastMessageRef=useRef()
  
  let [message,setMessage]=React.useState("")
  
  let [AllMessages,SetAllMessages]=React.useState([])

  let [onlineUsers,setOnlineUsers]=React.useState([])

  let [typingStatus,setTypingStatus]=React.useState("")

  React.useEffect(()=>{
      socket.emit("AddUser",user)
  },[user])


  React.useEffect(()=>{
      socket.on("AllUsers",(data)=>{
        setOnlineUsers(data)
      })
  },[socket])
  

  // See this one is important at the top 
  React.useEffect(()=>{
     socket.on("MesssageResponse",(data)=>{
       SetAllMessages([...AllMessages,data])
     })
  },[socket,AllMessages])


  // When the components Mounts
  React.useEffect(()=>{   
     let start=async ()=>{
      try {
        let {data}=await authFetch("/message")
          SetAllMessages(data.messages)
            } catch (error) {
      console.log(error.response.data.msg)      
    }
     }
     start()
 },[])



    
    function send(){

      CreateMessage({message})

      if(message!==""){
        socket.emit("Message",{message:message,user:{name:user.name,image:user.image}})
      }

    }

    function leave(){
      socket.emit("leave",user.email)
      logoutUser()
      // console.log("This is happening")
    }

    function keyDown(){
      socket.emit("Typing",`${user.name} is typing`)
    }

    React.useEffect(()=>{
       socket.on("SetTypingStatus",(data)=>{
         setTypingStatus(data)
       })

       
       return ()=>{
        socket.off("SetTypingStatus")
      }
      
    },[socket])
  

     setTimeout(()=>{
        setTypingStatus("")
     },2000)
    

    React.useEffect(()=>{
  
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    },[AllMessages])

    

      
  return (
    <div className="home__Main section__padding">
       <Typography variant="h4" className="h__Cormorant" style={{marginLeft:"30%"}}>Welcome To The Chat App</Typography>

       <div className="users" style={{dispaly:"flex"}}>
        {
          onlineUsers.map((all)=>{
            return <div dtyle={{display:"flex"}}>
                <Typography srtyle={{marginRight:"20px"}} variant="h5">{all.name}</Typography>
                <img style={{height:"50px",width:"50px",borderRadius:"50%"}} src={all.image}/>
            </div>
          })
        }
       </div>

         <div className="Messages">

            {
             AllMessages?.map((all)=>{
                return <div ref={lastMessageRef} className={`${all.user.name===user.name ? "active" : "normal"}`}>
                  <div style={{display:"flex"}}>
                      <p className="user">{all?.user?.name}</p>
                     <img src={all?.user?.image} style={{eight:"40px",width:"40px",borderRadius:"50%"}}/>
                  </div>

                   <p className="message">{all?.message}</p>

                </div>
              })
            }
          </div> 


       <div style={{marginLeft:"70px",marginTop:"5px"}}>

         <img src={user.image} style={{height:"40px",width:"40px",borderRadius:"50%",marginTop:"65px",marginRight:"10px"}}/>

         <TextField value={message} onChange={(e)=>setMessage(e.target.value)} id="outlined-basic" label="Message" variant="outlined" style={{width:"30%",marginTop:"57px"}} onKeyDown={keyDown} />

        <p>{typingStatus}...</p>
       </div>
       <button className="btn" style={{padding:"10px",marginLeft:"80px",marginTop:"30px"}} onClick={send}>Submit</button>    
       <button className="btn" style={{padding:"10px",marginLeft:"80px",marginTop:"30px"}} onClick={leave}>Leave The Chat </button>    
    </div>
  )
}

export default Home
