import type { UploadApiResponse } from "cloudinary";

export interface CloudinaryUploadResult {
  success: true;
  data: {
    url: string;
    publicId: string;
    width: number;
    height: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
