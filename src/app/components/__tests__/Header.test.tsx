import { fireEvent, render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import Header from "../Header";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Header", () => {
  it("renders the header", () => {
    render(<Header />);
    const headerElement = screen.getByTestId("header");
    expect(headerElement).toBeInTheDocument();
  });

  it("renders all nav links", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /characters/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /mounts/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pets/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  });

  it("does not show the mobile menu by default", () => {
    render(<Header />);
    const mobileMenu = screen.queryByTestId("mobile-menu");
    expect(mobileMenu).not.toBeInTheDocument();
  });

  it("shows the mobile menu when the hamburger is clicked", () => {
    render(<Header />);
    const hamburger = screen.getByTestId("mobile-menu-button");
    fireEvent.click(hamburger);
    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();
  });

  it("highlights the active nav link", () => {
    (usePathname as jest.Mock).mockReturnValue("/mounts");
    render(<Header />);
    const activeLink = screen.getAllByRole("link", { name: /mounts/i })[0];
    expect(activeLink).toHaveClass("bg-gray-700");
  });
});
