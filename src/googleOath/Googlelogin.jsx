import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../ContextApi/authcontext';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../services/firebaseConfig'; 

export default function Googlelogin() {
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate(); 

  const handleLoginSuccess = async (credentialResponse) => {
    console.log('credentialResponse:', credentialResponse); 
    const decodedToken = jwtDecode(credentialResponse.credential);
    console.log('Decoded Token:', decodedToken); 

    const user = {
      name: decodedToken?.name,      
      email: decodedToken?.email,    
      picture: decodedToken?.picture 
    };

    login(user); // Store user in context

    try {
      const userDocRef = doc(db, "usersdata", user.email); // Reference to Firestore
      const userDoc = await getDoc(userDocRef); // Fetch data

      if (userDoc.exists()) {
        console.log("User exists, redirecting to Dashboard");
        navigate("/dashboard"); // Existing user -> Dashboard
      } else {
        console.log("User does not exist, redirecting to Form");
        navigate("/form"); // New user -> Form
      }
    } catch (error) {
      console.error("Error checking user data:", error);
      navigate("/form"); // Fallback
    }
  };

  const handleLoginFailure = () => {
    console.log('Login Failed');
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess} 
        onError={handleLoginFailure}    
      />  
    </div>
  );
}
