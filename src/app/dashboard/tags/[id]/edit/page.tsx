import { getTag } from "@/app/actions/tags";
import { TagForm } from "@/components/dashboard/tag-form";
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
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Tag</h1>
      <TagForm tag={result.data} />
    </div>
  );
}
