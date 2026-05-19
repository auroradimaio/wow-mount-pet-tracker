import { render, screen } from "@testing-library/react";
import CharacterDoesNotHaveData from "../../helpers/CharacterDoesNotHaveData";

describe("CharacterDoesNotHaveData", () => {
  it("renders the correct message for mounts", () => {
    render(<CharacterDoesNotHaveData type="mounts" />);
    const errorMessage = screen.getByText(/character does not have mounts data/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("renders the correct message for pets", () => {
    render(<CharacterDoesNotHaveData type="pets" />);
    const errorMessage = screen.getByText(/character does not have pets data/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
