import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../ContextApi/authcontext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import Googlelogin from "../googleOath/Googlelogin";

export default function Home() {
  const { curruser } = useContext(AuthContext);
  const [userExists, setUserExists] = useState(null); // Firestore check
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserInFirestore = async () => {
      if (!curruser || !curruser.email) {
        console.warn(" User not logged in OR email missing.");
        setUserExists(false);
        return;
      }

      try {
        setLoading(true); // Start loading
        const userRef = doc(db, "usersdata", curruser.email);
        const userSnap = await getDoc(userRef);

        setUserExists(userSnap.exists()); // True if user exists, false otherwise
        console.log(userSnap.exists() ? " User found in Firestore" : "❌ User NOT found in Firestore");
      } catch (error) {
        console.error("🔥 Error checking Firestore:", error);
        setUserExists(false);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    checkUserInFirestore();
  }, [curruser||userExists]);

  const handleLogin = () => {
    setShowLogin(true);
  };

  // Handle navigation separately to ensure it's triggered properly
  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`); // Debugging log
    navigate(path);
  };

  return (
    <div className="home-container flex flex-col items-center justify-center p-4 bg-gray-100">
      <p className="quote text-lg text-center mb-6">
        True friendship is not about finding someone who just understands you, but someone who accepts you for who you are, supports you in your dreams, and makes you feel like you're never alone, no matter where life takes you.
      </p>

      {curruser ? (
        loading ? (
          <p className="text-gray-500">Checking user data...</p> // Show loading while checking Firestore
        ) : userExists ? (
          <button
            onClick={() => handleNavigation("/dashboard")}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md"
          >
            Make Friend
          </button>
        ) : (
          <button
            onClick={() => handleNavigation("/form")} // ✅ Debugging Navigation
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Create Profile
          </button>
        )
      ) : (
        !showLogin ? (
          <button onClick={handleLogin} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
            Login
          </button>
        ) : (
          <Googlelogin onLoginSuccess={() => setUserExists(null)} />
        )
      )}
    </div>
  );
}
