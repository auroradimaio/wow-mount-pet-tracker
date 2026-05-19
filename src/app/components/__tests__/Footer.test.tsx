import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders the footer", () => {
    render(<Footer />);
    const footerElement = screen.getByText(/WoW Tracker/i);
    expect(footerElement).toBeInTheDocument();
  });

  it("renders the footer with the correct year", () => {
    render(<Footer />);
    const footerElement = screen.getByText(/WoW Tracker/i);
    const currentYear = new Date().getFullYear();
    expect(footerElement).toHaveTextContent(`${currentYear}`);
  });
});
