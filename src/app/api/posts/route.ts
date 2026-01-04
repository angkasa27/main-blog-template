import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import type { PaginatedResponse } from "@/types/api";
import type { PostListItem } from "@/types/post";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where: { published: true } }),
    ]);

    const response: PaginatedResponse<PostListItem> = {
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
    
    return Response.json(response);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
