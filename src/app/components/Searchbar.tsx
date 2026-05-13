"use client";
import { useEffect, useRef, useState } from "react";
import { fetchAccessToken } from "../utils/fetchAccessToken";

export default function SearchBar({
  onSearch,
  initialName = "",
  initialRealm = "",
}: {
  onSearch: (name: string, server: string) => void;
  initialName?: string;
  initialRealm?: string;
}) {
  const [characterName, setCharacterName] = useState(initialName);
  const [servers, setServers] = useState<string[]>([]);
  const [selectedServer, setSelectedServer] = useState(initialRealm);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [serverFilter, setServerFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchServers = async () => {
      setIsLoading(true);
      try {
        const accessToken = await fetchAccessToken();
        const response = await fetch(
          "https://eu.api.blizzard.com/data/wow/realm/index?namespace=dynamic-eu&locale=en_US",
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        if (response.ok) {
          const data = await response.json();
          const serverNames: string[] = data.realms
            .map((realm: any) => realm.name.en_US || realm.name)
            .sort();
          setServers(serverNames);
          if (!initialRealm) setSelectedServer(serverNames[0] ?? "");
        }
      } catch {
        const fallback = ["Draenor", "Kazzak", "Nemesis", "Outland", "Silvermoon"];
        setServers(fallback);
        if (!initialRealm) setSelectedServer(fallback[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  useEffect(() => {
    if (isDropdownOpen) filterInputRef.current?.focus();
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setServerFilter("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredServers = servers
    .filter((server) => {
      const excludePatterns = [/^EU\d/, /Account Realm/i, /-INST/, /Arena Pass/i, /Auxiliary/i, /^RDB /i, /^zzz_/, /-BG-/];
      return !excludePatterns.some((pattern) => pattern.test(server));
    })
    .filter((server) => server.toLowerCase().includes(serverFilter.toLowerCase()));

  const handleSearch = () => {
    if (characterName.trim() !== "") {
      onSearch(characterName.trim(), selectedServer);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex items-center justify-center w-full max-w-3xl"
      >
        <input
          type="text"
          placeholder="Character name"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          className="p-2 rounded-l-[25px] flex-grow bg-gray-900 text-[#c79c6e]"
        />

        <div className="relative min-w-[200px]" ref={dropdownRef}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            aria-label="Select realm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 bg-gray-800 text-[#c79c6e] w-full flex items-center justify-between"
          >
            {isLoading ? (
              "Loading realms..."
            ) : (
              <>
                <span className="truncate">{selectedServer}</span>
                <span className="ml-2">{isDropdownOpen ? "▲" : "▼"}</span>
              </>
            )}
          </button>

          {isDropdownOpen && !isLoading && (
            <div
              role="listbox"
              aria-label="Realm list"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsDropdownOpen(false);
                  setServerFilter("");
                }
              }}
              className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <input
                ref={filterInputRef}
                type="text"
                placeholder="Filter realms..."
                value={serverFilter}
                onChange={(e) => setServerFilter(e.target.value)}
                className="p-2 w-full bg-gray-700 text-[#c79c6e] sticky top-0"
                onClick={(e) => e.stopPropagation()}
              />

              {filteredServers.length > 0 ? (
                filteredServers.map((serverName) => (
                  <div
                    key={serverName}
                    role="option"
                    aria-selected={serverName === selectedServer}
                    className="p-2 hover:bg-gray-700 cursor-pointer text-[#c79c6e]"
                    onClick={() => {
                      setSelectedServer(serverName);
                      setIsDropdownOpen(false);
                      setServerFilter("");
                    }}
                  >
                    {serverName}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-400">No realms found</div>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-[#c79c6e] text-white p-2 rounded-r-[25px] w-[150px] hover:bg-[#a57b4b]"
          disabled={isLoading}
        >
          Search
        </button>
      </form>

      <p className="text-gray-400 mt-2 text-sm">
        Enter a character name and select their realm to view their collection
      </p>
    </div>
  );
}
