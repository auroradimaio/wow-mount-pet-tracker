import { fireEvent, render, screen } from "@testing-library/react";
import SearchBarLookup from "../SearchBarLookup";

const mockOnSearch = jest.fn();

describe("SearchBarLookup", () => {
  it("renders the search bar", () => {
    render(
      <SearchBarLookup
        hint="hint"
        placeholder="placeholder"
        onSearch={mockOnSearch}
      />,
    );

    const seachBarElement = screen.getByPlaceholderText("placeholder");
    expect(seachBarElement).toBeInTheDocument();
  });

  it("renders the search hint prop correctly", () => {
    render(
      <SearchBarLookup
        hint="hint"
        placeholder="placeholder"
        onSearch={mockOnSearch}
      />,
    );
    const hintElement = screen.getByText("hint");
    expect(hintElement).toBeInTheDocument();
  });

  it("calls the onSearch function when the search button is clicked", () => {
    render(
      <SearchBarLookup
        hint="hint"
        placeholder="placeholder"
        onSearch={mockOnSearch}
      />,
    );
    const inputElement = screen.getByPlaceholderText("placeholder");
    fireEvent.change(inputElement, { target: { value: "test search" } });
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);
    expect(mockOnSearch).toHaveBeenCalled();
  });

  it("does not call the onSearch function when the search button is clicked without input", () => {
    render(
      <SearchBarLookup
        hint="hint"
        placeholder="placeholder"
        onSearch={mockOnSearch}
      />,
    );
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
});
