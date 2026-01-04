import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Increment view count only for published posts
    await prisma.post.update({
      where: { slug, published: true },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    console.log(`View count incremented for post: ${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking view:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
