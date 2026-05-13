const sizeClasses = {
  small: "h-6 w-24",
  medium: "h-8 w-32",
  large: "h-8 w-60",
};

export default function Skeleton({
    loading,
    size = 'medium',
    children,
}: {
    loading: boolean
    size?: 'small' | 'medium' | 'large'
    children?: React.ReactNode
}){

   if (loading) {
    return (
      <div className={`${sizeClasses[size]} bg-[#c79c6e] rounded animate-pulse`} />
    );
  }

  return <>{children}</>;
}