import React from 'react'
import { useState ,useContext} from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../ContextApi/authcontext';
import {jwtDecode} from 'jwt-decode';
export default function Googlelogin() {

   const { isLoggedIn, curruser, logout,login } = useContext(AuthContext); // Access context values
 
   const handleLoginSuccess = (credentialResponse) => {
    console.log('credentialResponse:', credentialResponse); 
    const decodedToken = jwtDecode(credentialResponse.credential);
    console.log('Decoded Token:', decodedToken); 
    const user = {
      name: decodedToken?.name,      
      email: decodedToken?.email,    
      picture: decodedToken?.picture 
    };
    login(user)
  
    console.log(user)
   
    
  };


   const handleLoginFailure = () => {
    console.log('Login Failed'); // If login fails, log failure message
  };
  
   return (
    <div>

<GoogleLogin
 onSuccess={handleLoginSuccess} 
 onError={handleLoginFailure}    
    />  
    </div>
  )
}
