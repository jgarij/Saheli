import React, { createContext, useState, useEffect } from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
export const AuthContext = createContext();
import { useNavigate } from 'react-router-dom';


import { db } from "../services/firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

export const AuthProvider = ({ children }) => {
  const[friendcount,setfriendcount]=useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [curruser, setCurrUser] = useState(null);
  const [friendRequests,setFriendRequests] = useState([])
 


  useEffect(() => {
    if (!curruser) return;
  
    const fetchFriendRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "friendRequests"));
        const requests = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((req) => req.receiver === curruser.email && req.status === "pending");
           console.log("friend requests",requests)
          setFriendRequests(requests);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
  
    fetchFriendRequests();
  }, [curruser]);


  useEffect(() => {
    const userData = localStorage.getItem('curruser');
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
      setCurrUser(JSON.parse(userData));
    }
  }, []);


  const login = (userData) => {
    setIsLoggedIn(true);
    setCurrUser(userData);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('curruser', JSON.stringify(userData));
    
  };


  const logout = () => {
    setIsLoggedIn(false);
    setCurrUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('curruser');
    
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, curruser, login, logout,friendRequests,setFriendRequests,friendcount,setfriendcount }}>
      {children}
    </AuthContext.Provider>
  );
};
