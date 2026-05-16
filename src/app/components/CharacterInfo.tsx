"use client";
import Image from "next/image";
import alliance from "../images/alliance.png";
import horde from "../images/horde.png";
import MountCard from "./MountCard";
import { fetchAccessToken } from "../utils/fetchAccessToken";
import { useEffect, useState, useRef } from "react";
import MountCardSkeleton from "./helpers/MountCardSkeleton";
import CharacterDoesNotExist from "./helpers/CharacterDoesNotExist";
import CharacterDoesNotHaveData from "./helpers/CharacterDoesNotHaveData";
import Skeleton from "./helpers/Skeleton";

interface CharacterInfoProps {
  characterName: string;
  characterServer: string;
}

interface RawMount {
  id: number;
  name: string;
}

interface EnrichedMount {
  id: number;
  name: string;
  icon: string;
}

interface RawPet {
  name: string;
  creatureDisplayId?: number;
}

interface EnrichedPet {
  name: string;
  icon: string;
}

interface CharacterData {
  name: string;
  faction: { type: "ALLIANCE" | "HORDE" };
  active_title: { name: string };
}

interface MountCollectionItem {
  mount: { id: number; name: string };
}

interface PetCollectionItem {
  species: { name: string };
  creature_display?: { id: number };
}

export default function CharacterInfo({
  characterName,
  characterServer,
}: CharacterInfoProps) {
  const [rawMounts, setRawMounts] = useState<RawMount[]>([]);
  const [rawPets, setRawPets] = useState<RawPet[]>([]);

  const mountCacheRef = useRef<Map<number, EnrichedMount>>(new Map());
  const petCacheRef = useRef<Map<string, EnrichedPet>>(new Map());

  const [displayMounts, setDisplayMounts] = useState<EnrichedMount[]>([]);
  const [displayPets, setDisplayPets] = useState<EnrichedPet[]>([]);

  const [characterData, setCharacterData] = useState<CharacterData | null>(
    null,
  );
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [view, setView] = useState<"mounts" | "pets">("mounts");
  const [currentPage, setCurrentPage] = useState(1);

  const accessTokenRef = useRef<string | null>(null);

  const itemsPerPage = 25;
  const totalMountPages = Math.ceil(rawMounts.length / itemsPerPage);
  const totalPetPages = Math.ceil(rawPets.length / itemsPerPage);
  const totalPages = view === "mounts" ? totalMountPages : totalPetPages;

  const fetchMountWithImage = async (
    mount: RawMount,
    accessToken: string,
  ): Promise<EnrichedMount> => {
    const cached = mountCacheRef.current.get(mount.id);
    if (cached) return cached;

    try {
      const mountDetailsResponse = await fetch(
        `https://eu.api.blizzard.com/data/wow/mount/${mount.id}?namespace=static-eu&locale=en_US`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!mountDetailsResponse.ok) {
        return { id: mount.id, name: mount.name, icon: "" };
      }

      const mountDetails = await mountDetailsResponse.json();
      const creatureDisplayId = mountDetails?.creature_displays?.[0]?.id;

      if (!creatureDisplayId) {
        return { id: mount.id, name: mount.name, icon: "" };
      }

      const mediaResponse = await fetch(
        `https://eu.api.blizzard.com/data/wow/media/creature-display/${creatureDisplayId}?namespace=static-eu&locale=en_US`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!mediaResponse.ok) {
        return { id: mount.id, name: mount.name, icon: "" };
      }

      const mediaData = await mediaResponse.json();
      const imageUrl = mediaData?.assets?.[0]?.value || "";

      const enrichedMount: EnrichedMount = {
        id: mount.id,
        name: mount.name,
        icon: imageUrl,
      };

      mountCacheRef.current.set(mount.id, enrichedMount);

      return enrichedMount;
    } catch (error) {
      return { id: mount.id, name: mount.name, icon: "" };
    }
  };

  const fetchPetWithImage = async (
    pet: RawPet,
    accessToken: string,
  ): Promise<EnrichedPet> => {
    const cached = petCacheRef.current.get(pet.name);
    if (cached) return cached;

    if (!pet.creatureDisplayId) {
      return { name: pet.name, icon: "" };
    }

    try {
      const mediaResponse = await fetch(
        `https://eu.api.blizzard.com/data/wow/media/creature-display/${pet.creatureDisplayId}?namespace=static-eu&locale=en_US`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (!mediaResponse.ok) {
        return { name: pet.name, icon: "" };
      }

      const mediaData = await mediaResponse.json();
      const imageUrl = mediaData?.assets?.[0]?.value || "";

      const enrichedPet: EnrichedPet = {
        name: pet.name,
        icon: imageUrl,
      };

      petCacheRef.current.set(pet.name, enrichedPet);

      return enrichedPet;
    } catch (error) {
      return { name: pet.name, icon: "" };
    }
  };

  const fetchMountsForPage = async (page: number) => {
    if (rawMounts.length === 0) return;

    const accessToken = accessTokenRef.current;
    if (!accessToken) return;

    setPageLoading(true);

    const start = (page - 1) * itemsPerPage;
    const end = Math.min(page * itemsPerPage, rawMounts.length);
    const mountsToFetch = rawMounts.slice(start, end);

    const enrichedMounts = await Promise.all(
      mountsToFetch.map((mount) => fetchMountWithImage(mount, accessToken)),
    );

    setDisplayMounts(enrichedMounts);
    setPageLoading(false);
  };

  const fetchPetsForPage = async (page: number) => {
    if (rawPets.length === 0) return;

    const accessToken = accessTokenRef.current;
    if (!accessToken) return;

    setPageLoading(true);

    const start = (page - 1) * itemsPerPage;
    const end = Math.min(page * itemsPerPage, rawPets.length);
    const petsToFetch = rawPets.slice(start, end);

    const enrichedPets = await Promise.all(
      petsToFetch.map((pet) => fetchPetWithImage(pet, accessToken)),
    );

    setDisplayPets(enrichedPets);
    setPageLoading(false);
  };

  useEffect(() => {
    if (!characterName || !characterServer) return;

    const searchCharacter = async () => {
      setInitialLoading(true);
      setCurrentPage(1);
      setDisplayMounts([]);
      setDisplayPets([]);
      setRawMounts([]);
      setRawPets([]);
      mountCacheRef.current.clear();
      petCacheRef.current.clear();

      try {
        const accessToken = await fetchAccessToken();
        accessTokenRef.current = accessToken;

        const formattedServer = encodeURIComponent(
          characterServer.toLowerCase().replace(/'/g, "").replace(/\s+/g, "-"),
        );
        const formattedCharacter = characterName.toLowerCase();

        const characterDetailsResponse = await fetch(
          `https://eu.api.blizzard.com/profile/wow/character/${formattedServer}/${formattedCharacter}?namespace=profile-eu&locale=en_US`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        if (!characterDetailsResponse.ok) {
          setCharacterData(null);
          return;
        }

        const charData = await characterDetailsResponse.json();
        setCharacterData(charData);

        const [mountsResponse, petsResponse] = await Promise.all([
          fetch(
            `https://eu.api.blizzard.com/profile/wow/character/${formattedServer}/${formattedCharacter}/collections/mounts?namespace=profile-eu&locale=en_US`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          ),
          fetch(
            `https://eu.api.blizzard.com/profile/wow/character/${formattedServer}/${formattedCharacter}/collections/pets?namespace=profile-eu&locale=en_US`,
            { headers: { Authorization: `Bearer ${accessToken}` } },
          ),
        ]);

        if (mountsResponse.ok) {
          const mountsData = await mountsResponse.json();
          const rawMountList: RawMount[] = mountsData.mounts.map(
            (m: MountCollectionItem) => ({
              id: m.mount.id,
              name: m.mount.name,
            }),
          );
          setRawMounts(rawMountList);
        }

        if (petsResponse.ok) {
          const petsData = await petsResponse.json();
          const rawPetList: RawPet[] = petsData.pets.map(
            (p: PetCollectionItem) => ({
              name: p.species.name,
              creatureDisplayId: p.creature_display?.id,
            }),
          );
          setRawPets(rawPetList);
        }
      } finally {
        setInitialLoading(false);
      }
    };

    searchCharacter();
  }, [characterName, characterServer]);

  useEffect(() => {
    if (view === "mounts" && rawMounts.length > 0) {
      fetchMountsForPage(currentPage);
    } else if (view === "pets" && rawPets.length > 0) {
      fetchPetsForPage(currentPage);
    }
  }, [rawMounts, rawPets, currentPage, view]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleViewChange = (newView: "mounts" | "pets") => {
    setView(newView);
    setCurrentPage(1);
  };

  const isLoading = initialLoading || pageLoading;

  return (
    <div className="grid gap-4">
      {!characterData && !initialLoading ? (
        <CharacterDoesNotExist />
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-2 p-4 rounded-lg items-center">
            <Image
              src={
                characterData?.faction?.type === "ALLIANCE" ? alliance : horde
              }
              alt="AllianceOrHorde Logo"
              width={130}
              height={130}
              className="justify-self-center md:justify-self-start"
            />
            <div className="flex flex-col justify-center gap-2 text-center md:text-left">
              <div className="text-2xl md:text-4xl">{characterName}</div>
              <div className="text-xl">{characterData?.active_title?.name}</div>
            </div>
            <div className="flex flex-col justify-center gap-2 text-center md:text-left">
              <Skeleton loading={initialLoading} size="large">
                <div className="text-2xl md:text-4xl">
                  {rawMounts.length} Mounts Collected
                </div>
              </Skeleton>
              <Skeleton loading={initialLoading} size="large">
                <div className="text-2xl md:text-4xl">
                  {rawPets.length} Pets Collected
                </div>
              </Skeleton>
            </div>
          </div>
          <div className="flex gap-4 justify-center md:justify-start">
            <button
              onClick={() => handleViewChange("mounts")}
              className={`py-2 px-4 rounded-[25px] ${
                view === "mounts" ? "bg-[#a57b4b]" : "bg-[#c79c6e]"
              }`}
            >
              View Mount Collection
            </button>
            <button
              onClick={() => handleViewChange("pets")}
              className={`py-2 px-4 rounded-[25px] ${
                view === "pets" ? "bg-[#a57b4b]" : "bg-[#c79c6e]"
              }`}
            >
              View Pet Collection
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <MountCardSkeleton key={index} loading={true} />
              ))
            ) : view === "mounts" ? (
              displayMounts.length === 0 ? (
                <CharacterDoesNotHaveData type="mounts" />
              ) : (
                displayMounts.map((mount, index) => (
                  <MountCard
                    key={mount.id || index}
                    name={mount.name}
                    icon={mount.icon}
                  />
                ))
              )
            ) : displayPets.length === 0 ? (
              <CharacterDoesNotHaveData type="pets" />
            ) : (
              displayPets.map((pet, index) => (
                <MountCard
                  key={`${pet.name}-${index}`}
                  name={pet.name}
                  icon={pet.icon}
                />
              ))
            )}
          </div>
          <div className="grid gap-6">
            {!isLoading && totalPages > 0 && (
              <div className="flex justify-between mt-6 gap-4">
                <button
                  className={`p-2 rounded-[25px] flex-1 ${
                    currentPage === 1 ? "bg-gray-500" : "bg-[#c79c6e]"
                  }`}
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                <button
                  className={`p-2 rounded-[25px] flex-1 ${
                    currentPage === totalPages ? "bg-gray-500" : "bg-[#c79c6e]"
                  }`}
                  disabled={currentPage === totalPages || isLoading}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
            {totalPages > 0 && !isLoading && (
              <span className="flex justify-center">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
