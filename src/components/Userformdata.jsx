
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../ContextApi/authcontext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export default function UserFormData() {
  const { isLoggedIn, login, curruser } = useContext(AuthContext);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const navigate = useNavigate();



  const [formData, setFormData] = useState({
    username: "",
    salary: "",
    profession: "",
    religion: "",
    location: "",
    alcholic: "",
  });

  useEffect(() => {
    if (isLoggedIn && curruser) {
      setFormData((prevData) => ({
        ...prevData,
        username: formData.username || "",
        salary: formData.salary || "",
        profession: formData.profession || "",
        religion: formData.religion || "",
        location: formData.location || "",
        alcholic: formData.alcholic || "",
      }));
    }
  }, [isLoggedIn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // **Form Validation**
  const validateForm = () => {
    const { username, salary, profession, religion, location, alcholic } = formData;

    // Ensure all fields are filled
    if (!username || !salary || !profession || !religion || !location || !alcholic) {
      alert("Please fill all the details correctly.");
      return false;
    }

    // Ensure salary is a valid integer
    if (!/^\d+$/.test(salary)) {
      alert("Salary must be a valid integer.");
      return false;
    }

    return true; // Form is valid
  };

  const saveData = async () => {
    if (!validateForm()) return; // Stop if form is invalid

    const docId = Date.now().toString();

    try {
      await setDoc(doc(db, "usersdata", curruser.email), {
        username: formData.username,
        profile: curruser.picture,
        salary: parseInt(formData.salary), // Ensure it's stored as a number
        profession: formData.profession,
        religion: formData.religion,
        location: formData.location,
        alcholic: formData.alcholic,
        docId: docId,
      });

      console.log("Data saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving profile data");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowGoogleLogin(true);
      login();
    } else {
      saveData();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
          Create Profile
        </h2>

        {!showGoogleLogin && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              placeholder="Enter your salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              placeholder="Enter your profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              placeholder="Enter your religion"
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              placeholder="Enter your location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              placeholder="Like to drink alcohol (Yes/No)"
              name="alcholic"
              value={formData.alcholic}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Create Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
