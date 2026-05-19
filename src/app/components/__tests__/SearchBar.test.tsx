import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBar from "../SearchBar";
import { fetchAccessToken } from "../../utils/fetchAccessToken";

jest.mock("../../utils/fetchAccessToken", () => ({
  fetchAccessToken: jest.fn(),
}));

describe("SearchBar", () => {
  beforeEach(() => {
    (fetchAccessToken as jest.Mock).mockResolvedValue("mock-token");
    global.fetch = jest.fn();
  });

  it("shows loading text while fetching realms", () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<SearchBar onSearch={jest.fn()} />);
    expect(screen.getByText(/loading realms/i)).toBeInTheDocument();
  });

  it("populates the realm dropdown from the API response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        realms: [
          { name: { en_US: "Silvermoon" } },
          { name: { en_US: "Draenor" } },
        ],
      }),
    });
    render(<SearchBar onSearch={jest.fn()} />);
    await waitFor(() =>
      expect(screen.queryByText(/loading realms/i)).not.toBeInTheDocument()
    );
    fireEvent.click(screen.getByRole("button", { name: /select realm/i }));
    expect(screen.getByRole("option", { name: "Silvermoon" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Draenor" })).toBeInTheDocument();
  });

  it("falls back to the hardcoded realm list if the API fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));
    render(<SearchBar onSearch={jest.fn()} />);
    await waitFor(() =>
      expect(screen.queryByText(/loading realms/i)).not.toBeInTheDocument()
    );
    fireEvent.click(screen.getByRole("button", { name: /select realm/i }));
    expect(screen.getByRole("option", { name: "Draenor" })).toBeInTheDocument();
  });

  it("filters out fake realms from the API response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        realms: [
          { name: { en_US: "Silvermoon" } },
          { name: { en_US: "EU1 Realm" } },
          { name: { en_US: "Arena Pass Test" } },
        ],
      }),
    });
    render(<SearchBar onSearch={jest.fn()} />);
    await waitFor(() =>
      expect(screen.queryByText(/loading realms/i)).not.toBeInTheDocument()
    );
    fireEvent.click(screen.getByRole("button", { name: /select realm/i }));
    expect(screen.getByRole("option", { name: "Silvermoon" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "EU1 Realm" })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Arena Pass Test" })).not.toBeInTheDocument();
  });

  it("calls onSearch with the character name and selected server", async () => {
    const mockOnSearch = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        realms: [{ name: { en_US: "Silvermoon" } }],
      }),
    });
    render(<SearchBar onSearch={mockOnSearch} />);
    await waitFor(() =>
      expect(screen.queryByText(/loading realms/i)).not.toBeInTheDocument()
    );
    fireEvent.change(screen.getByPlaceholderText(/character name/i), {
      target: { value: "Aurelia" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(mockOnSearch).toHaveBeenCalledWith("Aurelia", "Silvermoon");
  });
});
