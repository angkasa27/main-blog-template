import { getAllTags } from "@/app/actions/tags";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TagsTable } from "@/components/dashboard/tags-table";

export default async function TagsPage() {
  const result = await getAllTags();

  if (result.error || !result.data) {
    return <div className="p-6">Error: {result.error || "Failed to load tags"}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tags</h1>
          <p className="text-muted-foreground">
            Manage tags for organizing your content
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/tags/new">Create Tag</Link>}
        />
      </div>

      <TagsTable tags={result.data} />
    </div>
  );
}
