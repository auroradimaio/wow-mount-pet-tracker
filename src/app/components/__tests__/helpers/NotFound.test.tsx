import { render, screen } from "@testing-library/react";
import NotFound from "../../helpers/NotFound";

describe("NotFound", () => {
  it("renders the not found message", () => {
    render(<NotFound />);
    const errorMessage = screen.getByText(/not found/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("renders the image", () => {
    render(<NotFound />);
    const image = screen.getByAltText(/not found/i);
    expect(image).toBeInTheDocument();
  });
});
