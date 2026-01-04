"use client";

import { useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const resetScroll = () => {
    // Fix scroll lock issue after widget closes
    document.body.style.overflow = "";
    document.body.style.position = "";
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
          <CldImage
            src={value}
            alt="Cover image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            className="absolute top-2 right-2"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            multiple: false,
            maxFiles: 1,
            sources: ["local", "url", "camera"],
            clientAllowedFormats: ["png", "jpg", "jpeg", "gif", "webp"],
            maxFileSize: 10485760, // 10MB
            maxImageWidth: 2000,
            maxImageHeight: 2000,
            cropping: true,
            croppingAspectRatio: 16 / 9,
            croppingShowDimensions: true,
            showSkipCropButton: true,
            styles: {
              palette: {
                window: "#ffffff",
                sourceBg: "#f4f4f5",
                windowBorder: "#90a0b0",
                tabIcon: "#000000",
                inactiveTabIcon: "#555a5f",
                menuIcons: "#555a5f",
                link: "#0078FF",
                action: "#339933",
                inProgress: "#0078FF",
                complete: "#339933",
                error: "#cc0000",
                textDark: "#000000",
                textLight: "#fcfffd",
              },
              fonts: {
                default: null,
                "'Poppins', sans-serif": {
                  url: "https://fonts.googleapis.com/css?family=Poppins",
                  active: true,
                },
              },
            },
          }}
          onSuccess={(result) => {
            if (
              typeof result.info === "object" &&
              "secure_url" in result.info
            ) {
              onChange(result.info.secure_url);
              setIsUploading(false);
              resetScroll();
            }
          }}
          onQueuesEnd={() => {
            setIsUploading(false);
            resetScroll();
          }}
          onClose={() => {
            setIsUploading(false);
            resetScroll();
          }}
        >
          {({ open }) => (
            <Button
              type="button"
              variant="outline"
              className="w-full aspect-video h-full border-dashed"
              onClick={() => {
                setIsUploading(true);
                open();
              }}
              disabled={isUploading}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {isUploading ? "Uploading..." : "Click to upload cover image"}
                </span>
              </div>
            </Button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
