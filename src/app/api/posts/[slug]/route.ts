import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import type { ApiResponse } from "@/types/api";
import type { PostWithAuthor } from "@/types/post";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({
      where: {
        slug,
        published: true,
      },
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
    });

    if (!post) {
      return Response.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const response: ApiResponse<PostWithAuthor> = {
      success: true,
      data: post,
    };
    
    return Response.json(response);
  } catch (error) {
    console.error("Error fetching post:", error);
    return Response.json(
      { success: false, error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
