"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";
import { deleteTag } from "@/app/actions/tags";
import { toast } from "sonner";

interface TagDeleteConfirmationProps {
  tagId: string;
  tagName: string;
  postCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export function TagDeleteConfirmation({
  tagId,
  tagName,
  postCount,
  isOpen,
  onClose,
}: TagDeleteConfirmationProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTag(tagId);
      if (result.success) {
        toast.success("Tag deleted successfully");
        router.refresh();
        onClose();
      } else {
        toast.error(result.error || "Failed to delete tag");
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <AlertTriangle className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Tag</AlertDialogTitle>
          <AlertDialogDescription>
            {postCount > 0 ? (
              <>
                &ldquo;{tagName}&rdquo; is used by {postCount} post
                {postCount === 1 ? "" : "s"}. Deleting it will remove the tag from
                all posts. This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete &ldquo;{tagName}&rdquo;? This
                action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
