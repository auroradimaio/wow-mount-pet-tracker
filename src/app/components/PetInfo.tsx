"use client";
import { useEffect, useState } from "react";
import { fetchAccessToken } from "../utils/fetchAccessToken";
import Image from "next/image";
import PetDoesNotExist from "./helpers/PetDoesNotExist";

interface PetData {
  id: number;
  name: string;
  description: string;
  creature_type: { name: string };
  creature: { id: number; name: string };
  abilities: {
    ability: { id: number; name: string };
    slot: number;
    required_level: number;
  }[];
}

interface PetAbility {
  id: number;
  name: string;
  icon: string;
}

let petIndexCache: { id: number; name: string }[] | null = null;

export default function PetInfo({ petName }: { petName: string }) {
  const [petData, setPetData] = useState<PetData | null>(null);
  const [petIcon, setPetIcon] = useState<string>("");
  const [abilities, setAbilities] = useState<PetAbility[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!petName) return;

    const fetchPet = async () => {
      setLoading(true);
      setNotFound(false);
      setPetData(null);
      setPetIcon("");
      setAbilities([]);

      const accessToken = await fetchAccessToken();

      // 1. Fetch pet index (cached after first call)
      if (!petIndexCache) {
        const indexRes = await fetch(
          `https://eu.api.blizzard.com/data/wow/pet/index?namespace=static-eu&locale=en_US`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (!indexRes.ok) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const indexData = await indexRes.json();
        petIndexCache = indexData.pets;
      }

      // 2. Find pet by name (case-insensitive)
      const match = petIndexCache!.find(
        (p) => p.name.toLowerCase() === petName.toLowerCase(),
      );

      if (!match) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const petId = match.id;

      // 3. Fetch pet detail + media in parallel
      const [detailRes, mediaRes] = await Promise.all([
        fetch(
          `https://eu.api.blizzard.com/data/wow/pet/${petId}?namespace=static-eu&locale=en_US`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        ),
        fetch(
          `https://eu.api.blizzard.com/data/wow/media/pet/${petId}?namespace=static-eu&locale=en_US`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        ),
      ]);

      if (!detailRes.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const detail: PetData = await detailRes.json();
      const media = await mediaRes.json();

      setPetData(detail);
      setPetIcon(media?.assets?.[0]?.value ?? "");

      // 4. Fetch all abilities + their icons in parallel
      const abilityResults = await Promise.all(
        detail.abilities.map(async ({ ability }) => {
          const [abilRes, abilMediaRes] = await Promise.all([
            fetch(
              `https://eu.api.blizzard.com/data/wow/pet-ability/${ability.id}?namespace=static-eu&locale=en_US`,
              { headers: { Authorization: `Bearer ${accessToken}` } },
            ),
            fetch(
              `https://eu.api.blizzard.com/data/wow/media/pet-ability/${ability.id}?namespace=static-eu&locale=en_US`,
              { headers: { Authorization: `Bearer ${accessToken}` } },
            ),
          ]);

          const abilData = await abilRes.json();
          const abilMedia = await abilMediaRes.json();

          return {
            id: ability.id,
            name: abilData.name,
            icon: abilMedia?.assets?.[0]?.value ?? "",
          };
        }),
      );

      setAbilities(abilityResults);
      setLoading(false);
    };

    fetchPet();
  }, [petName]);

  if (loading) {
    return <div className="text-[#c79c6e] mt-8 text-center">Searching...</div>;
  }

  if (notFound) {
    return <PetDoesNotExist />;
  }

  if (!petData) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-6">
      {/* Pet header */}
      <div className="flex items-center gap-6">
        {petIcon && (
          <Image
            src={petIcon}
            alt={petData.name}
            width={100}
            height={100}
            className="rounded-lg"
          />
        )}
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl text-[#c79c6e]">{petData.name}</h2>
          <p className="text-gray-400">{petData.creature_type?.name}</p>
          <p className="text-gray-300 max-w-md">{petData.description}</p>
        </div>
      </div>

      {/* Abilities */}
      {abilities.length > 0 && (
        <div className="w-full max-w-2xl">
          <h3 className="text-xl text-[#c79c6e] mb-3">Abilities</h3>
          <div className="grid grid-cols-3 gap-3">
            {abilities.map((ability) => (
              <div
                key={ability.id}
                className="flex items-center gap-2 bg-gray-900 p-2 rounded-lg"
              >
                {ability.icon && (
                  <Image
                    src={ability.icon}
                    alt={ability.name}
                    width={36}
                    height={36}
                    className="rounded"
                  />
                )}
                <span className="text-sm text-gray-200">{ability.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wowhead link */}
      <a
        href={`https://www.wowhead.com/npc=${petData.creature.id}/${petData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#c79c6e] text-white px-6 py-2 rounded-[25px] hover:bg-[#a57b4b] transition-colors"
      >
        View on Wowhead
      </a>
    </div>
  );
}
