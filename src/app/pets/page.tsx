"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBarPets from "../components/SearchBarPets";
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
        <h2 className="text-2xl mb-4">
          Search for a pet to find out how to obtain it!
        </h2>
      </div>

      <SearchBarPets onSearch={handlePetSearch} initialValue={searchedPet} />

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
