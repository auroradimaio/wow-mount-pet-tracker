"use client";
import { useEffect, useState } from "react";
import { fetchAccessToken } from "../utils/fetchAccessToken";

export default function Searchbar({
  onSearch,
}: {
  onSearch: (name: string, server: string) => void;
}) {
  const [characterName, setCharacterName] = useState("");
  const [servers, setServers] = useState<string[]>([]);
  const [selectedServer, setSelectedServer] = useState("Pozzo dell'Eternità");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [serverFilter, setServerFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      setIsLoading(true);
      try {
        const accessToken = await fetchAccessToken();
        const response = await fetch(
          "https://eu.api.blizzard.com/data/wow/realm/index?namespace=dynamic-eu&locale=en_US",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const serverNames = data.realms
            .map((realm: any) => realm.name.en_US || realm.name)
            .sort();
          setServers(serverNames);
        }
      } catch (error) {
        console.error("Failed to fetch server list", error);
        // Fallback to a basic list if API fails
        setServers([
          "Pozzo dell'Eternità",
          "Nemesis",
          "Kazzak",
          "Silvermoon",
          "Outland",
          "Draenor",
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  const filteredServers = serverFilter
    ? servers.filter((server) =>
        server.toLowerCase().includes(serverFilter.toLowerCase())
      )
    : servers;

  const handleSearch = () => {
    if (characterName.trim() !== "") {
      onSearch(characterName, selectedServer);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4 w-full">
      <div className="flex items-center justify-center w-full max-w-3xl">
        <input
          type="text"
          placeholder="Character name"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          className="p-2 rounded-l-[25px] flex-grow bg-gray-900 text-[#c79c6e]"
        />

        <div className="relative min-w-[200px]">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 bg-gray-800 text-[#c79c6e] w-full flex items-center justify-between">
            {isLoading ? (
              "Loading servers..."
            ) : (
              <>
                <span className="truncate">{selectedServer}</span>
                <span className="ml-2">{isDropdownOpen ? "▲" : "▼"}</span>
              </>
            )}
          </button>

          {isDropdownOpen && !isLoading && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <input
                type="text"
                placeholder="Filter servers..."
                value={serverFilter}
                onChange={(e) => setServerFilter(e.target.value)}
                className="p-2 w-full bg-gray-700 text-[#c79c6e] sticky top-0"
                onClick={(e) => e.stopPropagation()}
              />

              {filteredServers.length > 0 ? (
                filteredServers.map((serverName) => (
                  <div
                    key={serverName}
                    className="p-2 hover:bg-gray-700 cursor-pointer text-[#c79c6e]"
                    onClick={() => {
                      setSelectedServer(serverName);
                      setIsDropdownOpen(false);
                      setServerFilter("");
                    }}>
                    {serverName}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-400">No servers found</div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="bg-[#c79c6e] text-white p-2 rounded-r-[25px] w-[150px] hover:bg-[#a57b4b]"
          disabled={isLoading}>
          Search
        </button>
      </div>

      <p className="text-gray-400 mt-2 text-sm">
        Enter a character name and select their realm to view their collection
      </p>
    </div>
  );
}
