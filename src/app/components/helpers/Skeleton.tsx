const sizeClasses = {
  small: "h-6 w-24",
  medium: "h-8 w-32",
  large: "h-8 w-60",
};

export default function Skeleton({
  loading,
  size,
  className,
  children,
}: {
  loading: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  children?: React.ReactNode;
}) {
  if (loading) {
    const sizeClass = size ? sizeClasses[size] : "";
    return (
      <div
        className={`bg-[#c79c6e]/20 rounded animate-pulse ${sizeClass} ${className ?? ""}`}
      />
    );
  }
  return <>{children}</>;
}
