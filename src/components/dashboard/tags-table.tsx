"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTag } from "@/app/actions/tags";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm-dialog";
import { toast } from "sonner";
import type { TagWithCount } from "@/types/tag";

interface TagsTableProps {
  tags: TagWithCount[];
}

export function TagsTable({ tags }: TagsTableProps) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string, postCount: number) => {
    if (postCount > 0) {
      const confirmed = await confirm({
        title: "Delete tag?",
        description: `"${name}" is used by ${postCount} post${
          postCount === 1 ? "" : "s"
        }. Deleting it will remove the tag from all posts. This action cannot be undone.`,
      });

      if (!confirmed) return;
    } else {
      const confirmed = await confirm({
        title: "Delete tag?",
        description: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      });

      if (!confirmed) return;
    }

    setDeletingId(id);
    const result = await deleteTag(id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Tag deleted successfully");
      router.refresh();
    }
    setDeletingId(null);
  };

  if (tags.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">
          No tags yet. Create your first tag to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left p-4 font-medium">Name</th>
            <th className="text-left p-4 font-medium">Slug</th>
            <th className="text-center p-4 font-medium">Posts</th>
            <th className="text-right p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id} className="border-b last:border-0">
              <td className="p-4">{tag.name}</td>
              <td className="p-4 font-mono text-sm text-muted-foreground">
                {tag.slug}
              </td>
              <td className="p-4 text-center">{tag._count.posts}</td>
              <td className="p-4 text-right space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/tags/${tag.id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    handleDelete(tag.id, tag.name, tag._count.posts)
                  }
                  disabled={deletingId === tag.id}
                >
                  {deletingId === tag.id ? "Deleting..." : "Delete"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
