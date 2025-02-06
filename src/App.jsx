import React from 'react'
import { useState ,useContext} from 'react'

import { AuthProvider } from './ContextApi/authcontext';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Home from './components/Home'
import Notfound from './components/Notfound'
import Navbar from "./components/Navbar"
import Dashboard from './components/Dashboard';
import Userformdata from './components/Userformdata'
import Notifications from './components/Notifications';
import Friends from './components/Friends';
function App() {
 
  return (
   <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="form" element={<Userformdata />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="friends" element={<Friends />} />
      <Route path="*" element={<Notfound />} />
    </Routes>

    </>
        
     
    
  );
}

export default App
