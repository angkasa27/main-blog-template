"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateTag } from "@/app/actions/tags";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { Tag } from "@/types/tag";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
});

type TagFormData = z.infer<typeof tagSchema>;

interface TagEditContainerProps {
  tag: Tag;
}

export function TagEditContainer({ tag }: TagEditContainerProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: tag.name, slug: tag.slug },
  });

  const onSubmit = async (data: TagFormData) => {
    const result = await updateTag(tag.id, data);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Tag updated successfully");
      router.push("/dashboard/tags");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Tag</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Name *</FieldLabel>
          <FieldDescription>The display name of the tag</FieldDescription>
          <Input
            id="name"
            {...register("name")}
            placeholder="e.g., Next.js"
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.slug}>
          <FieldLabel htmlFor="slug">Slug *</FieldLabel>
          <FieldDescription>
            URL-friendly version
          </FieldDescription>
          <Input
            id="slug"
            {...register("slug")}
            placeholder="e.g., nextjs"
            className="font-mono"
          />
          {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
        </Field>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Tag"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
