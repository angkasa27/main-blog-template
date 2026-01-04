"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTag, updateTag } from "@/app/actions/tags";
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

interface TagFormProps {
  tag?: Tag;
}

export function TagForm({ tag }: TagFormProps) {
  const router = useRouter();
  const isEditing = !!tag;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: tag || { name: "", slug: "" },
  });

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isEditing || !tag) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setValue("slug", slug);
    }
  };

  const onSubmit = async (data: TagFormData) => {
    const result = isEditing
      ? await updateTag(tag.id, data)
      : await createTag(data);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        isEditing ? "Tag updated successfully" : "Tag created successfully"
      );
      router.push("/dashboard/tags");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Name *</FieldLabel>
        <FieldDescription>The display name of the tag</FieldDescription>
        <Input
          id="name"
          {...register("name")}
          onChange={(e) => {
            register("name").onChange(e);
            handleNameChange(e);
          }}
          placeholder="e.g., Next.js"
        />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </Field>

      <Field data-invalid={!!errors.slug}>
        <FieldLabel htmlFor="slug">Slug *</FieldLabel>
        <FieldDescription>
          URL-friendly version (auto-generated from name)
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
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Tag"
            : "Create Tag"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
