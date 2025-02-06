import React, { createContext, useState, useEffect } from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [curruser, setCurrUser] = useState(null);


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
    <AuthContext.Provider value={{ isLoggedIn, curruser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
