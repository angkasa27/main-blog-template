import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "5");

    const posts = await prisma.post.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        viewCount: true,
        publishedAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        viewCount: "desc",
      },
      take: limit,
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular posts" },
      { status: 500 }
    );
  }
}
