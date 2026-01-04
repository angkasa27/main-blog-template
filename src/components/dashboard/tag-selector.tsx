"use client";

import { Tag } from "@/types/tag";
import { Button } from "@/components/ui/button";

interface TagSelectorProps {
  tags: Tag[];
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
}

export function TagSelector({
  tags,
  selectedTagIds,
  onTagsChange,
}: TagSelectorProps) {
  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  if (tags.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No tags available.{" "}
        <a
          href="/dashboard/tags/new"
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Create your first tag
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selectedTagIds.includes(tag.id);
        return (
          <Button
            key={tag.id}
            type="button"
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => toggleTag(tag.id)}
            className="h-8"
          >
            {tag.name}
          </Button>
        );
      })}
    </div>
  );
}
