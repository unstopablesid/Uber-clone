import React from "react"
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Userlogin from './pages/Userlogin'
import UsersSignup from './pages/UsersSignup'
// import Captainlogin from './pages/Captainlogin'
import Captainsignup from './pages/Captainsignup'



  const App = () => {
    return (
    <div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/userlogin" element={<Userlogin />} />
        <Route path="/usersignup" element={<UsersSignup />} />
        {/* <Route path="/captainlogin" element={<Captainlogin />} /> */}
        <Route path="/captains" element={<Captainsignup />} />
      </Routes>
    </div>
    )
  }

export default App;
