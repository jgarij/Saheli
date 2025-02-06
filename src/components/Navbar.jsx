import React, { useContext } from 'react';
import { AuthContext } from '../ContextApi/authcontext'; // Make sure the path is correct

export default function Navbar() {
  const { isLoggedIn, curruser, logout } = useContext(AuthContext); 

  return (
    <div className="navbar flex justify-between items-center p-4 bg-gray-800 text-white">
      <p className="brand text-xl font-bold">Dosti</p>
      
    
      {curruser && 
        <div className="flex items-center space-x-4">
          <p className="welcome text-sm">Welcome {curruser.name}</p>
          <button 
            onClick={logout} 
            className="logout-button px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md">
            Logout
          </button>
        </div>
}
    </div>
  );
}
