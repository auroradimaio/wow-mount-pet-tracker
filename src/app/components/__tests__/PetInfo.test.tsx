import { render, screen, waitFor } from "@testing-library/react";
import PetInfo, { _resetPetCache } from "../PetInfo";
import { fetchAccessToken } from "../../utils/fetchAccessToken";

jest.mock("../../utils/fetchAccessToken", () => ({
  fetchAccessToken: jest.fn(),
}));

describe("PetInfo", () => {
  beforeEach(() => {
    _resetPetCache();
    (fetchAccessToken as jest.Mock).mockResolvedValue("mock-token");
    global.fetch = jest.fn();
  });

  it("shows skeleton while loading", async () => {
    (fetchAccessToken as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );
    render(<PetInfo petName="Mechanical Squirrel" />);
    await waitFor(() =>
      expect(screen.getAllByTestId("skeleton")[0]).toBeInTheDocument(),
    );
  });

  it("shows pet data on success", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ pets: [{ id: 1, name: "Mechanical Squirrel" }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          name: "Mechanical Squirrel",
          description: "A tiny mechanical squirrel.",
          creature_type: { name: "Mechanical" },
          creature: { id: 50, name: "Mechanical Squirrel" },
          abilities: [],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          assets: [{ value: "https://example.com/pet.png" }],
        }),
      });
    render(<PetInfo petName="Mechanical Squirrel" />);
    expect(await screen.findByText("Mechanical Squirrel")).toBeInTheDocument();
    expect(screen.getByText("A tiny mechanical squirrel.")).toBeInTheDocument();
    expect(screen.getByText("Mechanical")).toBeInTheDocument();
  });

  it("shows the not found component when the pet does not exist", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ pets: [{ id: 1, name: "Mechanical Squirrel" }] }),
    });
    render(<PetInfo petName="Unknown Pet" />);
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("renders the Wowhead link with correct attributes", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ pets: [{ id: 1, name: "Mechanical Squirrel" }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          name: "Mechanical Squirrel",
          description: "A tiny mechanical squirrel.",
          creature_type: { name: "Mechanical" },
          creature: { id: 50, name: "Mechanical Squirrel" },
          abilities: [],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          assets: [{ value: "https://example.com/pet.png" }],
        }),
      });
    render(<PetInfo petName="Mechanical Squirrel" />);
    const link = await screen.findByRole("link", { name: /wowhead/i });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
