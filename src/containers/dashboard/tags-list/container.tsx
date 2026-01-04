"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { TagWithCount } from "@/types/tag";
import { TagsTable } from "./sections/tags-table";

interface TagsListContainerProps {
  tags: TagWithCount[];
}

export function TagsListContainer({ tags }: TagsListContainerProps) {
  return (
    <div className="space-y-6">
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

      <TagsTable tags={tags} />
    </div>
  );
}
