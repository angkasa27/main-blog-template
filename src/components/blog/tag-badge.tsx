"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface TagBadgeProps {
  name: string;
  slug: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function TagBadge({ name, slug, href, onClick }: TagBadgeProps) {
  const content = <Badge variant="outline">{name}</Badge>;

  if (href) {
    return (
      <Link
        href={href}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        className="hover:opacity-80 transition-opacity"
      >
        {content}
      </Link>
    );
  }

  return content;
}
