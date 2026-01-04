import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import type { PostWithAuthor } from "@/types/post";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RecentPostsProps {
  posts: PostWithAuthor[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          No posts yet. Create your first post to get started!
        </p>
        <Button
          nativeButton={false}
          className="mt-4"
          render={<Link href="/dashboard/posts/new">Create Post</Link>}
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(post.createdAt, "d MMMM yyyy, HH:mm")}
              </TableCell>
              <TableCell className="flex justify-end">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        size="sm"
                        variant="secondary"
                        nativeButton={false}
                        render={
                          <Link href={`/dashboard/posts/${post.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        }
                      />
                    }
                  />
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
