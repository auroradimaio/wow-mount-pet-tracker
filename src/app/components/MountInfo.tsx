"use client";
import { useEffect, useState } from "react";
import { fetchAccessToken } from "../utils/fetchAccessToken";
import Image from "next/image";
import PetDoesNotExist from "./helpers/PetDoesNotExist";
import Skeleton from "./helpers/Skeleton";

interface MountData {
  id: number;
  name: string;
  description: string;
  creature_displays: { key: { href: string }; id: number }[];
  spell: { id: number; name: string };
}

let mountIndexCache: { id: number; name: string }[] | null = null;

export default function MountInfo({ mountName }: { mountName: string }) {
  const [mountData, setMountData] = useState<MountData | null>(null);
  const [mountIcon, setMountIcon] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!mountName) return;

    const fetchMount = async () => {
      setLoading(true);
      setNotFound(false);
      setMountData(null);
      setMountIcon("");

      try {
        const accessToken = await fetchAccessToken();

        if (!mountIndexCache) {
          const indexRes = await fetch(
            `https://eu.api.blizzard.com/data/wow/mount/index?namespace=static-eu&locale=en_US`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );

          if (!indexRes.ok) {
            setNotFound(true);
            setLoading(false);
            return;
          }

          const indexData = await indexRes.json();
          mountIndexCache = indexData.mounts;
        }

        const match = mountIndexCache!.find(
          (p) => p.name.toLowerCase() === mountName.toLowerCase(),
        );

        if (!match) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const mountId = match.id;

        const detailRes = await fetch(
          `https://eu.api.blizzard.com/data/wow/mount/${mountId}?namespace=static-eu&locale=en_US`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (!detailRes.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const detail: MountData = await detailRes.json();

        setMountData(detail);
        const creatureDisplayId = detail.creature_displays[0]?.id;
        if (creatureDisplayId) {
          const mediaRes = await fetch(
            `https://eu.api.blizzard.com/data/wow/media/creature-display/${creatureDisplayId}?namespace=static-eu&locale=en_US`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );
          if (mediaRes.ok) {
            const mediaData = await mediaRes.json();
            setMountIcon(mediaData?.assets?.[0]?.value ?? "");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMount();
  }, [mountName]);

  if (loading) {
    return (
      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          <Skeleton loading className="w-[100px] h-[100px] rounded-lg" />
          <div className="flex flex-col gap-3">
            <Skeleton loading size="large" />
            <Skeleton loading className="h-4 w-72" />
            <Skeleton loading className="h-4 w-56" />
          </div>
        </div>
        <Skeleton loading className="h-10 w-40 rounded-[25px]" />
      </div>
    );
  }

  if (notFound) {
    return <PetDoesNotExist />;
  }

  if (!mountData) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-6">
      <div className="flex items-center gap-6">
        {mountIcon && (
          <Image
            src={mountIcon}
            alt={mountData.name}
            width={100}
            height={100}
            className="rounded-lg"
          />
        )}
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl text-[#c79c6e]">{mountData.name}</h2>
          <p className="text-gray-300 max-w-md">{mountData.description}</p>
        </div>
      </div>

      <a
        href={`https://www.wowhead.com/items/miscellaneous/mounts/name:${encodeURIComponent(mountData.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#c79c6e] text-white px-6 py-2 rounded-[25px] hover:bg-[#a57b4b] transition-colors"
      >
        View on Wowhead
      </a>
    </div>
  );
}
