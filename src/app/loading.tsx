import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-content pt-32 md:pt-40">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-14 w-40 rounded-full" />
            <Skeleton className="h-14 w-40 rounded-full" />
          </div>
        </div>
        <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
      </div>
    </div>
  );
}
