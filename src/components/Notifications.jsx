import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../ContextApi/authcontext";
import { db } from "../services/firebaseConfig";
import { doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";

export default function Notifications() {
  const { friendRequests, curruser, setFriendRequests } = useContext(AuthContext); // Add setFriendRequests
  const [sendersData, setSendersData] = useState({});

  useEffect(() => {
    const fetchSenderDetails = async () => {
      const senderDetails = {};

      for (const req of friendRequests) {
        if (!req.sender) continue;

        const senderDoc = await getDoc(doc(db, "usersdata", req.sender));
        if (senderDoc.exists()) {
          senderDetails[req.sender] = senderDoc.data();
        }
      }

      setSendersData(senderDetails);
    };

    if (friendRequests.length > 0) {
      fetchSenderDetails();
    }
  }, [friendRequests]);

  // Function to accept friend request
  const acceptRequest = async (senderEmail) => {
    try {
      const userEmail = curruser.email;

      // Create a friendship entry
      await setDoc(doc(db, "friends", `${userEmail}_${senderEmail}`), {
        user1: userEmail,
        user2: senderEmail,
        status: "friends",
        timestamp: new Date(),
      });

      // Delete request from "friendRequests"
      await deleteDoc(doc(db, "friendRequests", `${senderEmail}_${userEmail}`));

      // Remove request from local state
      setFriendRequests((prevRequests) =>
        prevRequests.filter((req) => req.sender !== senderEmail)
      );

      alert("Friend request accepted!");
    } catch (error) {
      alert("Error accepting request");
      console.error("Error accepting friend request:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Friend Requests</h2>

      {friendRequests.length > 0 ? (
        friendRequests.map((req) => {
          const senderInfo = sendersData[req.sender];

          return (
            <div key={req.sender} className="p-6 bg-white shadow-md rounded-lg mb-4 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-x-6">
              {senderInfo?.profile && (
                <img
                  src={senderInfo.profile}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-sm"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{senderInfo?.username || req.sender}</h3>
                <p className="text-gray-600"><strong>Email:</strong> {req.sender}</p>
                <p className="text-gray-600"><strong>Profession:</strong> {senderInfo?.profession || "N/A"}</p>
                <p className="text-gray-600"><strong>Salary:</strong> {senderInfo?.salary ? `$${senderInfo.salary}` : "N/A"}</p>
                <p className="text-gray-600"><strong>Location:</strong> {senderInfo?.location || "N/A"}</p>
                <p className="text-gray-600"><strong>Religion:</strong> {senderInfo?.religion || "N/A"}</p>
              </div>
              <button
                onClick={() => acceptRequest(req.sender)}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              >
                Accept Request
              </button>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-700 text-lg">No friend requests.</p>
      )}
    </div>
  );
}
