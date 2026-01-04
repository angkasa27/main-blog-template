import { getTag } from "@/app/actions/tags";
import { TagEditContainer } from "@/containers/dashboard/tag-edit";
import { notFound } from "next/navigation";

export default async function EditTagPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getTag(id);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="p-6">
      <TagEditContainer tag={result.data} />
    </div>
  );
}
