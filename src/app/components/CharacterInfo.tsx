"use client";
import Image from "next/image";
import Pngegg2 from "../images/pngegg (2).png";
import MountCard from "./MountCard";
import { fetchAccessToken } from "../utils/fetchAccessToken";
import { useEffect, useState } from "react";
import Pngegg3 from "../images/pngegg (3).png";

interface CharacterInfoProps {
  characterName: string;
  characterServer: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function CharacterInfo({
  characterName,
  characterServer,
}: CharacterInfoProps) {
  const [mounts, setMounts] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [characterData, setCharacterData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"mounts" | "pets">("mounts");

  useEffect(() => {
    if (!characterName || !characterServer) return;

    const searchCharacter = async () => {
      setLoading(true);
      const accessToken = await fetchAccessToken();

      const formattedServer = encodeURIComponent(
        characterServer.toLowerCase().replace(/'/g, "").replace(/\s+/g, "-")
      );
      const formattedCharacter = characterName.toLowerCase();

      const characterDetailsResponse = await fetch(
        `https://eu.api.blizzard.com/profile/wow/character/${formattedServer}/${formattedCharacter}?namespace=profile-eu&locale=en_US`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (characterDetailsResponse.ok) {
        const characterData = await characterDetailsResponse.json();
        console.log("Character Data:", characterData);
        setCharacterData(characterData);

        // Fetch pets
        const petsResponse = await fetch(
          `https://eu.api.blizzard.com/profile/wow/character/${formattedServer}/${formattedCharacter}/collections/pets?namespace=profile-eu&locale=en_US`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (petsResponse.ok) {
          const data = await petsResponse.json();
          console.log("Pet Data:", data);

          console.log("Pet Icon URL:", data.pets[0].creature_display?.id);

          const petsWithIcons = data.pets.map((pet: any) => ({
            name: pet.species.name,
            icon: pet.creature_display?.id
              ? `https://eu.api.blizzard.com/data/wow/media/creature-display/${pet.creature_display.id}?namespace=static-eu&locale=en_US`
              : "",
          }));

          setPets(petsWithIcons);
        } else {
          console.error(
            "Failed to fetch character pets",
            petsResponse.statusText
          );
        }

        // Fetch mounts
        const mountsResponse = await fetch(
          `https://eu.api.blizzard.com/profile/wow/character/${formattedServer}/${formattedCharacter}/collections/mounts?namespace=profile-eu&locale=en_US`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (mountsResponse.ok) {
          const data = await mountsResponse.json();
          console.log("Mount Data:", data);

          const mountsWithIcons = [];
          let requestCount = 0;

          for (let i = 0; i < data.mounts.length; i++) {
            const mountData = data.mounts[i];
            const mountId = mountData.mount.id;

            const mountDetailsResponse = await fetch(
              `https://eu.api.blizzard.com/data/wow/mount/${mountId}?namespace=static-eu&locale=en_US`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            requestCount++;

            if (mountDetailsResponse.ok) {
              const mountDetails = await mountDetailsResponse.json();
              const creatureDisplayId =
                mountDetails?.creature_displays?.[0]?.id;
              console.log(
                `Mount ID: ${mountId}, Creature Display ID:`,
                creatureDisplayId
              );

              let imageUrl = "";

              if (creatureDisplayId) {
                const mediaResponse = await fetch(
                  `https://eu.api.blizzard.com/data/wow/media/creature-display/${creatureDisplayId}?namespace=static-eu&locale=en_US`,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                requestCount++;

                if (mediaResponse.ok) {
                  const mediaData = await mediaResponse.json();
                  console.log(`Media Data for Mount ID ${mountId}:`, mediaData);

                  imageUrl = mediaData?.assets?.[0]?.value || "";
                } else {
                  console.error(
                    `Failed to fetch media for creature ID ${creatureDisplayId}`
                  );
                }
              }

              mountsWithIcons.push({
                name: mountData.mount.name,
                icon: imageUrl,
              });
            } else {
              console.error(`Failed to fetch mount details for ID: ${mountId}`);
              mountsWithIcons.push({
                name: mountData.mount.name,
                icon: "",
              });
            }

            if (requestCount % 99 === 0) {
              console.log("Pausing for 1 second to avoid rate limits...");
              await delay(1000);
            }
          }

          setMounts(mountsWithIcons);
          console.log("Final Mount List with Images:", mountsWithIcons);
        } else {
          console.error(
            "Failed to fetch character mounts",
            mountsResponse.statusText
          );
        }
      } else {
        console.error(
          "Failed to fetch character data",
          characterDetailsResponse.statusText
        );
      }

      setLoading(false);
    };

    searchCharacter();
  }, [characterName, characterServer]);

  return (
    <div className="justify-center">
      <div className="grid grid-cols-[auto_1fr_1fr] gap-2 p-4 rounded-lg items-center">
        <Image
          src={characterData?.faction?.type === "ALLIANCE" ? Pngegg2 : Pngegg3}
          alt="AllianceOrHorde Logo"
          width={130}
          height={130}
          className="ml-4"></Image>
        <div className="flex flex-col justify-center gap-2">
          <div className="text-4xl">{characterName}</div>
          <div className="text-xl">{characterData?.active_title?.name}</div>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <div className="text-4xl">{mounts.length} Mounts Collected</div>
          <div className="text-4xl">{pets.length} Pets Collected</div>
        </div>
      </div>
      <div className="flex gap-4 mt-4 ml-4">
        <button
          onClick={() => setView("mounts")}
          className={`p-2 rounded-[25px] w-[200px] ${
            view === "mounts" ? "bg-[#a57b4b]" : "bg-[#c79c6e]"
          }`}>
          View Mount Collection
        </button>
        <button
          onClick={() => setView("pets")}
          className={`p-2 rounded-[25px] w-[200px] ${
            view === "pets" ? "bg-[#a57b4b]" : "bg-[#c79c6e]"
          }`}>
          View Pet Collection
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : view === "mounts" ? (
          mounts.map((mount, index) => (
            <MountCard key={index} name={mount.name} icon={mount.icon} />
          ))
        ) : (
          pets.map((pet, index) => (
            <MountCard key={index} name={pet.name} icon={pet.icon} />
          ))
        )}
      </div>
    </div>
  );
}
