"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchAccessToken } from "../utils/fetchAccessToken";

const MountPage = () => {
  interface Mount {
    name: string;
    description: string;
    icon: string;
  }

  const [mounts, setMounts] = useState<Mount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMounts = async () => {
      const accessToken = await fetchAccessToken();

      // Fetch mount details
      const response = await fetch(
        "https://us.api.blizzard.com/data/wow/mount/6?namespace=static-us&locale=en_US",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Mount Data:", data);

        const creatureDisplayId = data?.creature_displays?.[0]?.id;
        console.log("Creature Display ID:", creatureDisplayId);

        let imageUrl = "";

        if (creatureDisplayId) {
          // Fetch image using the display ID
          const mediaResponse = await fetch(
            `https://us.api.blizzard.com/data/wow/media/creature-display/${creatureDisplayId}?namespace=static-us&locale=en_US`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (mediaResponse.ok) {
            const mediaData = await mediaResponse.json();
            console.log("Media Data:", mediaData);

            imageUrl = mediaData?.assets?.[0]?.value || "";
          } else {
            console.error("Failed to fetch media", mediaResponse.statusText);
          }
        }

        setMounts([
          { name: data.name, description: data.description, icon: imageUrl },
        ]);
      } else {
        console.error("Error fetching mount data:", response.statusText);
      }

      setLoading(false);
    };

    getMounts();
  }, []);

  return (
    <div>
      <h1>Mount Information</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {mounts.map((mount, index) => (
            <div key={index}>
              <h2>{mount.name}</h2>
              <p>{mount.description}</p>
              {mount.icon && (
                <Image
                  src={mount.icon}
                  alt={mount.name}
                  width={200}
                  height={200}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MountPage;
