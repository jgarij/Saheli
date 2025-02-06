import React, { useState, useEffect } from 'react';
import { db } from "../services/firebaseConfig"; // Make sure the path is correct
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { useContext } from 'react';
import { AuthContext } from "../ContextApi/authcontext";
import Search from './Search';
export default function Dashboard() {
  const { isLoggedIn, curruser, logout } = useContext(AuthContext);
  const [allusers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usersdata"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("userlist", usersList)

        const filteredUsers = usersList.filter(user => user.id !== curruser?.email);
        setAllUsers(filteredUsers);
        console.log("filteres", filteredUsers)

      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [curruser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700 animate-pulse">Loading users...</p>
      </div>
    );
  }


  const sendFriendRequest = async (receiverEmail) => {
    if (!curruser || !curruser.email) return;

    try {
  <Search/>
      const requestRef = doc(db, "friendRequests", `${curruser.email}_${receiverEmail}`);
      console.log(requestRef, "requestREf");

      await setDoc(requestRef, {
        sender: curruser.email,
        receiver: receiverEmail,
        status: "pending", // Could be 'pending', 'accepted', or 'rejected'
        timestamp: new Date(),
      });

      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request");
    }
  };





  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-4xl font-bold text-center text-blue-600 mb-6">
        Find Your Perfect Dost
      </h2>
      <Search></Search>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {allusers.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-lg p-5">
            <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
            <p className="text-gray-600"><strong>Salary:</strong> {user.salary}</p>
            <p className="text-gray-600"><strong>Profession:</strong> {user.profession}</p>
            <p className="text-gray-600"><strong>Religion:</strong> {user.religion}</p>
            <p className="text-gray-600"><strong>Location:</strong> {user.location}</p>
            <p className="text-gray-600"><strong>Likes Alcohol:</strong> {user.alcholic}</p>
            {user.profile && (
              <img
                src={user.profile}
                alt="Profile"
                className="w-24 h-24 mx-auto mb-4 rounded-full border-2 border-gray-300 shadow-sm"
              />
            )}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded "
              onClick={() => sendFriendRequest(user.id)}
            >
              Send Friend Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
