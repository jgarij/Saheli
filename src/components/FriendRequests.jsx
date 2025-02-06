import React, { useState, useEffect, useContext } from "react";
import { db } from "../services/firebaseConfig"; 
import { collection, getDocs, setDocs,doc, updateDoc, deleteDoc } from "firebase/firestore"; 
import { AuthContext } from "../ContextApi/authcontext";
import { useNavigate } from "react-router-dom";
export default function FriendRequests() {
  const { curruser } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate()
  useEffect(() => {
    if(!curruser){
      navigate("/")
    }
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "friendRequests"));
        const userRequests = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((req) => req.receiver === curruser.email && req.status === "pending");
        setRequests(userRequests);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    fetchRequests();
  }, [curruser]);

  const handleAccept = async (request) => {
    try {
      const senderRef = doc(db, "usersdata", request.sender);
      const receiverRef = doc(db, "usersdata", request.receiver);

      await updateDoc(senderRef, { friends: arrayUnion(request.receiver) });
      await updateDoc(receiverRef, { friends: arrayUnion(request.sender) });

      await deleteDoc(doc(db, "friendRequests", request.id));

      alert("Friend request accepted!");
      setRequests(requests.filter((r) => r.id !== request.id));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  if (requests.length === 0) return <p>No pending requests</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">Friend Requests</h2>
      <ul>
        {requests.map((req) => (
          <li key={req.id} className="border p-4 shadow rounded-lg">
            <p><strong>From:</strong> {req.sender}</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleAccept(req)}>
              Accept
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
