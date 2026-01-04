import { getAllTags } from "@/app/actions/tags";
import { TagsListContainer } from "@/containers/dashboard/tags-list";

export default async function TagsPage() {
  const result = await getAllTags();

  if (result.error || !result.data) {
    return <div className="p-6">Error: {result.error || "Failed to load tags"}</div>;
  }

  return (
    <div className="p-6">
      <TagsListContainer tags={result.data} />
    </div>
  );
}
