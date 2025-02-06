import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../ContextApi/authcontext";
import { db } from "../services/firebaseConfig";
import { collection, query, where, getDocs, or } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Friends() {
  const { curruser } = useContext(AuthContext);
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
    if (!curruser || !curruser.email) {
       navigate("/")
    }

    const fetchFriends = async () => {
      try {
        const friendsRef = collection(db, "friends");

        // Firestore does not support OR queries, so we use `or()`
        const q = query(
          friendsRef,
          or(where("user1", "==", curruser.email), where("user2", "==", curruser.email)),
          where("status", "==", "friends") // Only confirmed friends
        );

        const querySnapshot = await getDocs(q);
        const friendsData = [];

        for (const docSnap of querySnapshot.docs) {
          const friendRecord = docSnap.data();
          
          // Determine who is the friend (not the logged-in user)
          const friendEmail = friendRecord.user1 === curruser.email 
            ? friendRecord.user2 
            : friendRecord.user1;

          // Fetch full friend details from `usersdata`
          const userDoc = await getDocs(
            query(collection(db, "usersdata"), where("email", "==", friendEmail))
          );

          if (!userDoc.empty) {
            userDoc.forEach((doc) => {
              friendsData.push({ id: doc.id, ...doc.data() });
            });
          }
        }

        setFriendsList(friendsData);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [curruser]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading friends...</p>;
  }

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-6">Your Friends</h2>

      {friendsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friendsList.map((friend) => (
            <div key={friend.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">
                {friend.username}
              </h3>
              <p className="text-gray-600"><strong>Location:</strong> {friend.location}</p>
              <p className="text-gray-600"><strong>Profession:</strong> {friend.profession}</p>
              {friend.profile && (
                <img
                  src={friend.profile}
                  alt="Profile"
                  className="w-24 h-24 mx-auto mt-3 rounded-full border-2 border-gray-300 shadow-sm"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No friends yet.</p>
      )}
    </div>
  );
}
