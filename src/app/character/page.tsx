"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CharacterInfo from "../components/CharacterInfo";
import SearchBar from "../components/SearchBar";

const EXAMPLE_CHARACTERS = [
  { name: "Naowh", realm: "Tarren Mill" },
  { name: "Scripe", realm: "Tarren Mill" },
  { name: "Rextroy", realm: "Sylvanas" },
];

function CharacterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchedCharacter, setSearchedCharacter] = useState(
    searchParams.get("name") ?? "",
  );
  const [searchedServer, setSearchedServer] = useState(
    searchParams.get("realm") ?? "",
  );

  const handleSearch = (name: string, server: string) => {
    setSearchedCharacter(name);
    setSearchedServer(server);
    router.replace(
      `/character?name=${encodeURIComponent(name)}&realm=${encodeURIComponent(server)}`,
    );
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-2">
          Find out how many mounts and pets WoW players currently have!
        </h2>
        <p className="text-yellow-400/70 text-sm mb-1">EU region only</p>
        <p className="text-gray-400 text-sm mb-4">
          Enter any EU Battle.net character name and their realm to see their collection.
        </p>
      </div>

      <SearchBar
        key={searchedCharacter}
        onSearch={handleSearch}
        initialName={searchedCharacter}
        initialRealm={searchedServer}
      />

      <div className="flex flex-wrap justify-center items-center gap-2 mt-3">
        <span className="text-gray-400 text-sm">Try:</span>
        {EXAMPLE_CHARACTERS.map(({ name, realm }) => (
          <button
            key={name}
            onClick={() => handleSearch(name, realm)}
            className="text-sm px-3 py-1 rounded-[25px] border border-[#c79c6e]/40 text-[#c79c6e] hover:bg-[#c79c6e]/10 transition-colors"
          >
            {name} · {realm}
          </button>
        ))}
      </div>

      {searchedCharacter && (
        <CharacterInfo
          characterName={searchedCharacter}
          characterServer={searchedServer}
        />
      )}
    </div>
  );
}

export default function Character() {
  return (
    <Suspense>
      <CharacterPage />
    </Suspense>
  );
}
