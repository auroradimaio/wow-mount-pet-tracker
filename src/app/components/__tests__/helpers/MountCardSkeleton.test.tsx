import { render, screen } from "@testing-library/react";
import MountCardSkeleton from "../../helpers/MountCardSkeleton";

describe("MountCardSkeleton", () => {
  it("renders the skeleton when loading=true", () => {
    render(<MountCardSkeleton loading={true} />);
    const skeletonElement = screen.getByTestId("mount-card-skeleton");
    expect(skeletonElement).toBeInTheDocument();
  });

  it("renders children when loading=false", () => {
    render(<MountCardSkeleton loading={false}>Test Children</MountCardSkeleton>);
    const skeletonChildren = screen.getByText("Test Children");
    expect(skeletonChildren).toBeInTheDocument();
  });
});
