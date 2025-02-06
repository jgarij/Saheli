import React, { useState, useEffect, useContext } from "react";
import Search from "./Search";
import Filter from "./Filter";
import { db } from "../services/firebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../ContextApi/authcontext";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate = useNavigate()
  const { curruser } = useContext(AuthContext);
  const [allusers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
  if(!curruser){
    navigate("/")
  }
  },[curruser])


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usersdata"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Exclude the current user
        const filteredData = usersList.filter(
          (user) => user.id !== curruser?.email
        );

        setAllUsers(filteredData);
        setFilteredUsers(filteredData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [curruser]);

  // Search Functionality 
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredUsers(allusers);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const results = allusers.filter((user) => {
      const username = user.username?.toLowerCase() || "";
      const location = user.location?.toLowerCase() || "";
      const profession = user.profession?.toLowerCase() || "";
      const religion = user.religion?.toLowerCase() || "";

      return (
        username.includes(lowerQuery) ||
        location.includes(lowerQuery) || // Search by location
        profession.includes(lowerQuery) ||
        religion.includes(lowerQuery)
      );
    });

    setFilteredUsers(results);
  };

  // Salary Filter Functionality
  const handleSalaryFilter = (minSalary, maxSalary) => {
    const filteredResults = allusers.filter(
      (user) => user.salary >= minSalary && user.salary <= maxSalary
    );
    setFilteredUsers(filteredResults);
  };

  // Reset Filter
  const resetFilter = () => {
    setFilteredUsers(allusers);
  };

  // Friend Request Function
  const sendFriendRequest = async (receiverEmail) => {
    if (!curruser || !curruser.email) return;

    try {
      const requestRef = doc(db, "friendRequests", `${curruser.email}_${receiverEmail}`);

      await setDoc(requestRef, {
        sender: curruser.email,
        receiver: receiverEmail,
       
        status: "pending",
        timestamp: new Date(),
      });

      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-700 animate-pulse">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h3 className="text-2xl font-bold text-center text-blue-600 mb-6">
        Find Your Perfect Dost
      </h3>

      {/* Search Component */}
      <Search onSearch={handleSearch} />

     
      <div className="flex flex-col md:flex-row gap-6 mt-6">
      
        <div className="w-full md:w-1/5 bg-white p-4 rounded-lg shadow-md">
          <Filter 
            onFilter={handleSalaryFilter} 
            allUsers={allusers} 
            resetFilter={resetFilter} 
          />
        </div>

    
        <div className="w-full md:w-4/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
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
                    className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-gray-300 shadow-sm"
                  />
                )}
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition"
                  onClick={() => sendFriendRequest(user.id)}
                >
                  Send Friend Request
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-700 text-center col-span-full">
              No users found matching your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
