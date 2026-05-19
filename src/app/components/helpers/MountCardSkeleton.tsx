export default function MountCardSkeleton({
  loading,
  children,
}: {
  loading: boolean;
  children?: React.ReactNode;
}) {
  if (loading) {
    return (
      <div data-testid="mount-card-skeleton" className="flex flex-col gap-4 items-center ml-6 mt-10">
        <div className="bg-wow-gold-light h-48 w-48 rounded-lg animate-pulse" />
        <div className="h-8 w-60 bg-wow-gold-light rounded animate-pulse mt-2" />
      </div>
    );
  }
  return <>{children}</>;
}
