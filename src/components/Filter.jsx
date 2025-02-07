import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../ContextApi/authcontext";
import { useNavigate } from "react-router-dom";
export default function Filter({ onFilter, allUsers, resetFilter }) {
  const {curruser} = useContext(AuthContext)
  const [selectedSalary, setSelectedSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(0);
  const navigate = useNavigate()
  // Calculate max salary dynamically
  useEffect(()=>{
  if(!curruser){
    navigate("/")
  }
  },[curruser])


  useEffect(() => {
    if (allUsers.length > 0) {
      const highestSalary = Math.max(...allUsers.map(user => user.salary));
      setMaxSalary(highestSalary);
      setSelectedSalary(highestSalary);
    }
  }, [allUsers]);

  const handleRangeChange = (e) => {
    setSelectedSalary(parseInt(e.target.value));
  };

  const handleFilter = () => {
    onFilter(0, selectedSalary);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-full sm:w-auto">
      <label htmlFor="rangeInput" className="text-lg font-semibold text-gray-700">
        Sort by Salary:
      </label>

      {/* Range Input */}
      <input
        type="range"
        id="rangeInput"
        name="salary"
        min={0}
        max={maxSalary}
        value={selectedSalary}
        onChange={handleRangeChange}
        className="w-full my-2"
      />

      {/* Live Price Update */}
      <span id="pricevalue" className="text-gray-700">₹{selectedSalary}</span>

      {/* Apply Filter Button */}
      <button
        onClick={handleFilter}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full hover:bg-blue-700 transition"
      >
        Apply Filter
      </button>

      {/* Clear Filter Button */}
      <button
        onClick={resetFilter}
        className="bg-yellow-500 text-white px-4 py-2 rounded-md w-full mt-3 hover:bg-yellow-700 transition"
      >
        Clear Filter
      </button>
    </div>
  );
}
