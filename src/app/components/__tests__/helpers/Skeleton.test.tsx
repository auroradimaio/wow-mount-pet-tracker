import { render, screen } from "@testing-library/react";
import Skeleton from "../../helpers/Skeleton";

describe("Skeleton", () => {
  it("renders the skeleton when loading=true", () => {
    render(<Skeleton loading={true} />);
    const skeletonElement = screen.getByTestId("skeleton");
    expect(skeletonElement).toBeInTheDocument();
  });

  it("renders children when loading=false", () => {
    render(<Skeleton loading={false}>Test Children</Skeleton>);
    const skeletonChildren = screen.getByText("Test Children");
    expect(skeletonChildren).toBeInTheDocument();
  });

  it("renders the correct size", () => {
    render(<Skeleton loading={true} size="medium" />);
    const skeletonElement = screen.getByTestId("skeleton");
    expect(skeletonElement).toHaveClass("h-8 w-32");
  });
});
