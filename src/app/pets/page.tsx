"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBarLookup from "../components/SearchBarLookup";
import PetInfo from "../components/PetInfo";

function PetsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchedPet, setSearchedPet] = useState(
    searchParams.get("name") ?? "",
  );

  const handlePetSearch = (petName: string) => {
    setSearchedPet(petName);
    router.replace(`/pets?name=${encodeURIComponent(petName)}`);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">Search for a pet by name to view its details.</h2>
      </div>

      <SearchBarLookup
        key={searchedPet}
        onSearch={handlePetSearch}
        initialValue={searchedPet}
        placeholder="Pet name"
        hint="Enter a pet name to view its details, abilities, and Wowhead link."
      />

      <div className="flex flex-wrap justify-center items-center gap-2 mt-3">
        <span className="text-gray-400 text-sm">Try:</span>
        {["Lil' Ragnaros", "Mechanical Squirrel", "Disgusting Oozeling"].map((name) => (
          <button
            key={name}
            onClick={() => handlePetSearch(name)}
            className="text-sm px-3 py-1 rounded-[25px] border border-[#c79c6e]/40 text-[#c79c6e] hover:bg-[#c79c6e]/10 transition-colors"
          >
            {name}
          </button>
        ))}
      </div>

      {searchedPet && <PetInfo petName={searchedPet} />}
    </div>
  );
}

export default function Pets() {
  return (
    <Suspense>
      <PetsPage />
    </Suspense>
  );
}
