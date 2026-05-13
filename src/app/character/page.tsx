"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CharacterInfo from "../components/CharacterInfo";
import SearchBar from "../components/SearchBar";

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
        <p className="text-yellow-400/70 text-sm mb-4">EU region only</p>
      </div>

      <SearchBar
        onSearch={handleSearch}
        initialName={searchedCharacter}
        initialRealm={searchedServer}
      />

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
