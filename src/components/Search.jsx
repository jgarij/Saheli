import React, { useState } from "react";

export default function Search({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);
    onSearch(searchValue); // Calls the function in Dashboard
  };

  return (
    <input
      type="text"
      placeholder="Search by name, location, profession, religion..."
      value={query}
      onChange={handleChange}
      className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
    />
  );
}
