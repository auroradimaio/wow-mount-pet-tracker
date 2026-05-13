"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBarMounts from "../components/SearchBarMounts";
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
          Search for a mount to find out how to obtain it!
        </h2>
      </div>

      <SearchBarMounts onSearch={handleMountSearch} initialValue={searchedMount} />

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
