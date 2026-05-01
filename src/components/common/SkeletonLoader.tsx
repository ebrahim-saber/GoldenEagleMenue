

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={`bg-white/[0.03] overflow-hidden relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="w-full aspect-square rounded-[2rem]" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 items-center">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <Skeleton className="flex-1 h-6 rounded-md" />
          <Skeleton className="w-24 h-6 rounded-md" />
          <Skeleton className="w-16 h-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
};
