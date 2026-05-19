import { render, screen } from "@testing-library/react";
import MountCard from "../MountCard";

describe("MountCard", () => {
  it("renders the mount card with correct name", () => {
    render(<MountCard name="testName" icon="https://example.com/icon.png" />);
    const mountCardElement = screen.getByText(/testName/i);
    expect(mountCardElement).toBeInTheDocument();
  });

  it("renders the mount card with correct icon", () => {
    render(<MountCard name="testName" icon="https://example.com/icon.png" />);
    const mountCardElement = screen.getByAltText(/testName/i);
    expect(mountCardElement).toBeInTheDocument();
  });

  it("renders the mount card with a no image card if there is no icon", () => {
    render(<MountCard name="testName" icon="" />);
    const mountCardElement = screen.getByText(/no image/i);
    expect(mountCardElement).toBeInTheDocument();
  });
});
