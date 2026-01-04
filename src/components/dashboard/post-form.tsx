"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { postSchema, type PostFormData } from "@/lib/schemas/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ImageUpload } from "./image-upload";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePreventNavigation } from "@/hooks/use-prevent-navigation";
import { useConfirm } from "@/hooks/use-confirm-dialog";
import { TagSelector } from "./tag-selector";
import { Tag } from "@/types/tag";

interface PostFormProps {
  defaultValues?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  submitLabel?: string;
  tags?: Tag[];
}

export function PostForm({
  defaultValues,
  onSubmit,
  submitLabel = "Create Post",
  tags = [],
}: PostFormProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    defaultValues?.tagIds || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    watch,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: defaultValues || {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      coverImage: "",
      metaTitle: "",
      metaDescription: "",
      published: false,
      featured: false,
      tagIds: [],
    },
  });

  const { confirm } = useConfirm();

  // Prevent navigation when form has unsaved changes
  usePreventNavigation(
    isDirty && !isSubmitting,
    "You have unsaved changes. Are you sure you want to leave?"
  );

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitting]);

  // Intercept browser back/forward navigation
  useEffect(() => {
    if (!isDirty || isSubmitting) return;

    const handlePopState = async (e: PopStateEvent) => {
      e.preventDefault();

      const confirmLeave = await confirm({
        title: "Unsaved Changes",
        description:
          "You have unsaved changes. Are you sure you want to leave?",
      });

      if (!confirmLeave) {
        window.history.pushState(null, "", window.location.href);
      } else {
        window.history.back();
      }
    };

    // Push a new state to handle back button
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty, isSubmitting, confirm]);

  const coverImage = watch("coverImage");

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!defaultValues?.slug) {
      const slug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug);
    }
  };

  // Handle tag selection changes
  const handleTagsChange = (tagIds: string[]) => {
    setSelectedTagIds(tagIds);
    setValue("tagIds", tagIds, { shouldDirty: true });
  };

  // Sync selected tags with form state on mount
  useEffect(() => {
    if (defaultValues?.tagIds) {
      setSelectedTagIds(defaultValues.tagIds);
      setValue("tagIds", defaultValues.tagIds);
    }
  }, [defaultValues?.tagIds, setValue]);

  const handleFormSubmit = async (data: PostFormData) => {
    // Ensure tagIds are included in submission
    await onSubmit({ ...data, tagIds: selectedTagIds });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <FieldGroup>
        {/* Title */}
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="title">Title *</FieldLabel>
          <Input
            id="title"
            {...register("title")}
            onChange={(e) => {
              register("title").onChange(e);
              handleTitleChange(e);
            }}
            placeholder="Enter post title"
          />
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>

        {/* Slug */}
        <Field data-invalid={!!errors.slug}>
          <FieldLabel htmlFor="slug">Slug *</FieldLabel>
          <Input id="slug" {...register("slug")} placeholder="post-url-slug" />
          {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
        </Field>

        {/* Cover Image */}
        <Field data-invalid={!!errors.coverImage}>
          <FieldLabel>Cover Image *</FieldLabel>
          <ImageUpload
            value={coverImage}
            onChange={(url) => setValue("coverImage", url)}
            onRemove={() => setValue("coverImage", "")}
          />
          {errors.coverImage && (
            <FieldError>{errors.coverImage.message}</FieldError>
          )}
        </Field>

        {/* Excerpt */}
        <Field data-invalid={!!errors.excerpt}>
          <FieldLabel htmlFor="excerpt">Excerpt</FieldLabel>
          <FieldDescription>
            Brief description shown on blog list (optional)
          </FieldDescription>
          <Textarea
            id="excerpt"
            {...register("excerpt")}
            placeholder="Brief description (optional)"
            rows={3}
          />
          {errors.excerpt && <FieldError>{errors.excerpt.message}</FieldError>}
        </Field>

        {/* Content */}
        <Field data-invalid={!!errors.content}>
          <FieldLabel htmlFor="content">Content *</FieldLabel>
          <TiptapEditor
            content={watch("content") || ""}
            onChange={(html) =>
              setValue("content", html, { shouldValidate: true })
            }
            placeholder="Write your post content..."
            error={!!errors.content}
          />
          {errors.content && <FieldError>{errors.content.message}</FieldError>}
        </Field>
      </FieldGroup>

      {/* SEO Fields */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
        <FieldGroup>
          <Field data-invalid={!!errors.metaTitle}>
            <FieldLabel htmlFor="metaTitle">Meta Title</FieldLabel>
            <FieldDescription>
              Custom title for search engines (optional, max 60 chars)
            </FieldDescription>
            <Input
              id="metaTitle"
              {...register("metaTitle")}
              placeholder="SEO title (optional)"
            />
            {errors.metaTitle && (
              <FieldError>{errors.metaTitle.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!errors.metaDescription}>
            <FieldLabel htmlFor="metaDescription">Meta Description</FieldLabel>
            <FieldDescription>
              Summary for search results (optional, max 160 chars)
            </FieldDescription>
            <Textarea
              id="metaDescription"
              {...register("metaDescription")}
              placeholder="SEO description (optional)"
              rows={3}
            />
            {errors.metaDescription && (
              <FieldError>{errors.metaDescription.message}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </div>

      {/* Tags */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Tags</h3>
        <Field>
          <FieldLabel>Select Tags</FieldLabel>
          <FieldDescription>
            Choose tags to categorize this post
          </FieldDescription>
          <TagSelector
            tags={tags}
            selectedTagIds={selectedTagIds}
            onTagsChange={handleTagsChange}
          />
        </Field>
      </div>

      {/* Publishing Options */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Publishing Options</h3>
        <FieldGroup>
          <Field>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                {...register("published")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <div>
                <FieldLabel htmlFor="published">Publish this post</FieldLabel>
                <FieldDescription>
                  Make this post visible to the public
                </FieldDescription>
              </div>
            </div>
          </Field>

          <Field>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                {...register("featured")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <div>
                <FieldLabel htmlFor="featured">Feature this post</FieldLabel>
                <FieldDescription>
                  Display this post prominently on the homepage
                </FieldDescription>
              </div>
            </div>
          </Field>
        </FieldGroup>
      </div>

      {/* 
      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-32">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
