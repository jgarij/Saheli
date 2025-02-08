import React, { useContext } from "react";
import { AuthContext } from "../ContextApi/authcontext";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig";
export default function Navbar() {
  const { isLoggedIn, curruser, logout,friendcount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userExists, setUserExists] = useState(false);
  function handleNotification() {
    navigate("/notifications");
  }

  useEffect(() => {
    const checkUserInDatabase = async () => {
      if (!curruser?.email) return;
      const userDoc = await getDoc(doc(db, "usersdata", curruser.email));
      setUserExists(userDoc.exists());
    };
    checkUserInDatabase();
  }, [curruser, db]);
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
            🔔<span className="text-red-300 text-[11px]">{friendcount}</span>
          </button>
         {/* Friend button */}
         <Link to="/friends" className=" text-sm md:text-base font-medium">
           Friends
          </Link>

          {/* Welcome Message */}

          <Link to={userExists ? "/dashboard" : "/"} className="text-sm md:text-base font-medium">
  Welcome,{" "}
  <span className="font-semibold">
    {curruser?.name?.length > 6 ? curruser.name.substring(0, 6) + "..." : curruser?.name}
  </span>
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
