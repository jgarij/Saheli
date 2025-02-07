import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../ContextApi/authcontext";
import { db } from "../services/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function FriendsList() {
  const { curruser } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!curruser) return;

    const fetchFriends = async () => {
      try {
        const friendsQuery1 = query(collection(db, "friends"), where("user1", "==", curruser.email));
        const friendsQuery2 = query(collection(db, "friends"), where("user2", "==", curruser.email));

        const [querySnapshot1, querySnapshot2] = await Promise.all([
          getDocs(friendsQuery1),
          getDocs(friendsQuery2),
        ]);

        let friendEmails = new Set(); // To store unique emails

        querySnapshot1.forEach((doc) => friendEmails.add(doc.data().user2));
        querySnapshot2.forEach((doc) => friendEmails.add(doc.data().user1));

        // Fetch user details only for unique friends
        const friendDetails = await Promise.all(
          [...friendEmails].map(async (friendEmail) => {
            const friendDoc = await getDoc(doc(db, "usersdata", friendEmail));
            return friendDoc.exists()
              ? { email: friendEmail, ...friendDoc.data() }
              : { email: friendEmail };
          })
        );

        setFriends(friendDetails);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [curruser]);

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">Your Friends</h2>
      {friends.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">No friends yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map((friend) => (
            <li key={friend.email} className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
              {friend.profile && (
                <img
                  src={friend.profile}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-sm"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-800">{friend.username || friend.email}</h3>
              <p className="text-gray-600"><strong>Email:</strong> {friend.email}</p>
              <p className="text-gray-600"><strong>Profession:</strong> {friend.profession || "N/A"}</p>
              <p className="text-gray-600"><strong>Location:</strong> {friend.location || "N/A"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
