"use client";
import { useState } from "react";

export default function SearchBarMounts({
  onSearch,
  initialValue = "",
}: {
  onSearch: (mountName: string) => void;
  initialValue?: string;
}) {
  const [mountName, setMountName] = useState(initialValue);

  const handleSearch = () => {
    if (mountName.trim() !== "") {
      onSearch(mountName.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex items-center justify-center w-full max-w-3xl"
      >
        <input
          type="text"
          placeholder="Mount name"
          value={mountName}
          onChange={(e) => setMountName(e.target.value)}
          className="p-2 rounded-l-[25px] flex-grow bg-gray-900 text-[#c79c6e]"
        />

        <button
          type="submit"
          className="bg-[#c79c6e] text-white p-2 rounded-r-[25px] w-[150px] hover:bg-[#a57b4b]"
        >
          Search
        </button>
      </form>

      <p className="text-gray-400 mt-2 text-sm">
        Enter a mount name to find out how to obtain it.
      </p>
    </div>
  );
}
