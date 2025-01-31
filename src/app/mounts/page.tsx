// src/app/mounts/page.tsx

"use client"; // This tells Next.js that this is a client component

import { useEffect, useState } from "react";
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
      // Get the access token
      const accessToken = await fetchAccessToken();

      // Make the API request to get mount information
      const response = await fetch(
        "https://us.api.blizzard.com/data/wow/mount/6?namespace=static-us&locale=en_US", // Just an example of fetching one mount
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMounts([data]); // Assuming you get a single mount object back
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
              <img src={mount.icon} alt={mount.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MountPage;
