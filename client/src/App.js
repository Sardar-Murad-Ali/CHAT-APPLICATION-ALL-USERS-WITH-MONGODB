import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {Landing,Error,ProtectedRoute,Home} from  "./components/index.js"
import io from "socket.io-client"
import React from 'react'
import { useAppContext } from './context/appContext.js'
const socket=io.connect("http://localhost:5000")

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/Home" element={
            <ProtectedRoute>
                <Home socket={socket} />
            </ProtectedRoute>
          }/>
          <Route path="*" element={<Error/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
