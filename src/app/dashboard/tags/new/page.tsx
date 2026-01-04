import { TagForm } from "@/components/dashboard/tag-form";

export default function NewTagPage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Create Tag</h1>
      <TagForm />
    </div>
  );
}
