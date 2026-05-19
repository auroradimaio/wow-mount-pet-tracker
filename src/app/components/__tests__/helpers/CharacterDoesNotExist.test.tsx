import { render, screen } from "@testing-library/react";
import CharacterDoesNotExist from "../../helpers/CharacterDoesNotExist";

describe("CharacterDoesNotExist", () => {
  it("renders the error message", () => {
    render(<CharacterDoesNotExist />);
    const errorMessage = screen.getByText(/character does not exist/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("renders the image", () => {
    render(<CharacterDoesNotExist />);
    const image = screen.getByAltText(/characternotfound/i);
    expect(image).toBeInTheDocument();
  });
});
