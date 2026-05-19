import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CharacterInfo from "../CharacterInfo";
import { fetchAccessToken } from "../../utils/fetchAccessToken";

jest.mock("../../utils/fetchAccessToken", () => ({
  fetchAccessToken: jest.fn(),
}));

const mockCharacterData = {
  name: "Aurelia",
  faction: { type: "ALLIANCE" },
  active_title: { name: "Dragonslayer" },
};

const mockMountsData = {
  mounts: [{ mount: { id: 1, name: "Blazing Drake" } }],
};

const mockPetsData = {
  pets: [{ species: { name: "Mechanical Squirrel" }, creature_display: { id: 10 } }],
};

const mockMountDetail = {
  creature_displays: [{ id: 100 }],
};

const mockMediaData = {
  assets: [{ value: "https://example.com/image.png" }],
};

describe("CharacterInfo", () => {
  beforeEach(() => {
    (fetchAccessToken as jest.Mock).mockResolvedValue("mock-token");
    global.fetch = jest.fn();
  });

  it("shows loading skeletons on initial render", () => {
    (fetchAccessToken as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<CharacterInfo characterName="Aurelia" characterServer="Silvermoon" />);
    const skeletons = screen.getAllByTestId("mount-card-skeleton");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("shows the character does not exist component on a 404 response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    render(<CharacterInfo characterName="Unknown" characterServer="Silvermoon" />);
    expect(await screen.findByText(/character does not exist/i)).toBeInTheDocument();
  });

  it("renders character data after a successful load", async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/profile/wow/character/silvermoon/aurelia?")) {
        return Promise.resolve({ ok: true, json: async () => mockCharacterData });
      }
      if (url.includes("/collections/mounts")) {
        return Promise.resolve({ ok: true, json: async () => mockMountsData });
      }
      if (url.includes("/collections/pets")) {
        return Promise.resolve({ ok: true, json: async () => mockPetsData });
      }
      if (url.includes("/data/wow/mount/")) {
        return Promise.resolve({ ok: true, json: async () => mockMountDetail });
      }
      if (url.includes("/media/creature-display/")) {
        return Promise.resolve({ ok: true, json: async () => mockMediaData });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
    render(<CharacterInfo characterName="Aurelia" characterServer="Silvermoon" />);
    expect(await screen.findByText("Dragonslayer")).toBeInTheDocument();
  });

  it("shows CharacterDoesNotHaveData when the mount collection is empty", async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/collections/mounts")) {
        return Promise.resolve({ ok: true, json: async () => ({ mounts: [] }) });
      }
      if (url.includes("/collections/pets")) {
        return Promise.resolve({ ok: true, json: async () => ({ pets: [] }) });
      }
      if (url.includes("/profile/wow/character/")) {
        return Promise.resolve({ ok: true, json: async () => mockCharacterData });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
    render(<CharacterInfo characterName="Aurelia" characterServer="Silvermoon" />);
    expect(
      await screen.findByText(/character does not have mounts data/i)
    ).toBeInTheDocument();
  });

  it("shows pagination controls when there are multiple pages of mounts", async () => {
    const manyMounts = {
      mounts: Array.from({ length: 30 }, (_, i) => ({
        mount: { id: i + 1, name: `Mount ${i + 1}` },
      })),
    };
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/collections/mounts")) {
        return Promise.resolve({ ok: true, json: async () => manyMounts });
      }
      if (url.includes("/collections/pets")) {
        return Promise.resolve({ ok: true, json: async () => ({ pets: [] }) });
      }
      if (url.includes("/profile/wow/character/")) {
        return Promise.resolve({ ok: true, json: async () => mockCharacterData });
      }
      if (url.includes("/data/wow/mount/")) {
        return Promise.resolve({ ok: true, json: async () => mockMountDetail });
      }
      if (url.includes("/media/creature-display/")) {
        return Promise.resolve({ ok: true, json: async () => mockMediaData });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
    render(<CharacterInfo characterName="Aurelia" characterServer="Silvermoon" />);
    expect(await screen.findByText(/page 1 of 2/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).not.toBeDisabled();
  });

  it("switches to the pet collection when the pets tab is clicked", async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/collections/mounts")) {
        return Promise.resolve({ ok: true, json: async () => ({ mounts: [] }) });
      }
      if (url.includes("/collections/pets")) {
        return Promise.resolve({ ok: true, json: async () => ({ pets: [] }) });
      }
      if (url.includes("/profile/wow/character/")) {
        return Promise.resolve({ ok: true, json: async () => mockCharacterData });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
    render(<CharacterInfo characterName="Aurelia" characterServer="Silvermoon" />);
    await waitFor(() =>
      expect(screen.queryByTestId("mount-card-skeleton")).not.toBeInTheDocument()
    );
    fireEvent.click(screen.getByRole("button", { name: /view pet collection/i }));
    expect(
      await screen.findByText(/character does not have pets data/i)
    ).toBeInTheDocument();
  });
});
