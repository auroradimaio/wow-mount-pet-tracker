import { render, screen, waitFor } from "@testing-library/react";
import MountInfo, { _resetMountCache } from "../MountInfo";
import { fetchAccessToken } from "../../utils/fetchAccessToken";

jest.mock("../../utils/fetchAccessToken", () => ({
  fetchAccessToken: jest.fn(),
}));

describe("MountInfo", () => {
  beforeEach(() => {
    _resetMountCache();
    (fetchAccessToken as jest.Mock).mockResolvedValue("mock-token");
    global.fetch = jest.fn();
  });

  it("shows skeleton while loading", async () => {
    (fetchAccessToken as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );
    render(<MountInfo mountName="Blazing Drake" />);
    await waitFor(() =>
      expect(screen.getAllByTestId("skeleton")[0]).toBeInTheDocument(),
    );
  });

  it("shows mount data on success", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ mounts: [{ id: 1, name: "Blazing Drake" }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          name: "Blazing Drake",
          description: "A fiery drake mount.",
          creature_displays: [{ id: 100 }],
          spell: { id: 1, name: "Summon Blazing Drake" },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          assets: [{ value: "https://example.com/mount.png" }],
        }),
      });
    render(<MountInfo mountName="Blazing Drake" />);
    expect(await screen.findByText("Blazing Drake")).toBeInTheDocument();
    expect(screen.getByText("A fiery drake mount.")).toBeInTheDocument();
  });

  it("shows the not found component when the mount does not exist", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ mounts: [{ id: 1, name: "Blazing Drake" }] }),
    });
    render(<MountInfo mountName="Unknown Mount" />);
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("renders the Wowhead link with correct attributes", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ mounts: [{ id: 1, name: "Blazing Drake" }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          name: "Blazing Drake",
          description: "A fiery drake mount.",
          creature_displays: [{ id: 100 }],
          spell: { id: 1, name: "Summon Blazing Drake" },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          assets: [{ value: "https://example.com/mount.png" }],
        }),
      });
    render(<MountInfo mountName="Blazing Drake" />);
    const link = await screen.findByRole("link", { name: /wowhead/i });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
  });
});
