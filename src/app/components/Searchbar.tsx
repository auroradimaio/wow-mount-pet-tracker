export default function Searchbar() {
  return (
    <div className="flex items-center justify-center mt-4">
      <input
        type="text"
        placeholder="Search for a character to view their mounts and pets collection"
        className="p-2 rounded-[25px] w-1/2 bg-gray-900 text-[#c79c6e]"
      />
      <button className="bg-[#c79c6e] text-white p-2 rounded-[25px] ml-2 w-[150px] hover:bg-[#a57b4b]">
        Search
      </button>
    </div>
  );
}
