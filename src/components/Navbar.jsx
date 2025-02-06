import React, { useContext } from "react";
import { AuthContext } from "../ContextApi/authcontext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isLoggedIn, curruser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNotification() {
    navigate("/notifications");
  }

  return (
    <div className="navbar flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      {/* Brand Name */}
      <Link to="/" className="text-lg md:text-xl font-semibold tracking-wide">
        Yaariyaa.
      </Link>

      {curruser && (
        <div className="flex items-center space-x-6">
          {/* Notification Button */}
          <button 
            onClick={handleNotification} 
            className="text-xl hover:scale-110 transition-transform"
            title="Notifications"
          >
            🔔
          </button>

         {/* Friend button */}
         <Link to="/friends" className=" text-sm md:text-base font-medium">
           Friends
          </Link>

          {/* Welcome Message */}
          <Link to="/dashboard" className="text-sm md:text-base font-medium">
            Welcome, <span className="font-semibold">{curruser.name}</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm md:text-base font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
