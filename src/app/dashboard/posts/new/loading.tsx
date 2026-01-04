import { Skeleton } from "@/components/ui/skeleton";

export default function NewPostLoadingPage() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Form fields */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
