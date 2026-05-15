"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBarLookup from "../components/SearchBarLookup";
import MountInfo from "../components/MountInfo";

function MountsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchedMount, setSearchedMount] = useState(
    searchParams.get("name") ?? "",
  );

  const handleMountSearch = (mountName: string) => {
    setSearchedMount(mountName);
    router.replace(`/mounts?name=${encodeURIComponent(mountName)}`);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">
          Search for a mount by name to view its details.
        </h2>
      </div>

      <SearchBarLookup
        onSearch={handleMountSearch}
        key={searchedMount}
        initialValue={searchedMount}
        placeholder="Mount name"
        hint="Enter a mount name to view its details and Wowhead link."
      />

      <div className="flex flex-wrap justify-center items-center gap-2 mt-3">
        <span className="text-gray-400 text-sm">Try:</span>
        {["Invincible", "Ashes of Al'ar", "Tyrael's Charger"].map((name) => (
          <button
            key={name}
            onClick={() => handleMountSearch(name)}
            className="text-sm px-3 py-1 rounded-[25px] border border-[#c79c6e]/40 text-[#c79c6e] hover:bg-[#c79c6e]/10 transition-colors"
          >
            {name}
          </button>
        ))}
      </div>

      {searchedMount && <MountInfo mountName={searchedMount} />}
    </div>
  );
}

export default function Mounts() {
  return (
    <Suspense>
      <MountsPage />
    </Suspense>
  );
}
