import prisma from "../src/lib/prisma";

async function main() {
  console.log("🌱 Starting database seed...");

  // Check if there's at least one user
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    console.log(
      "❌ No users found. Please create a user account first (sign up)."
    );
    return;
  }

  // Get the first user to use as author
  const user = await prisma.user.findFirst();

  if (!user) {
    console.log("❌ Could not find a user.");
    return;
  }

  console.log(`✅ Using user: ${user.email} as author`);

  // Create sample posts
  const posts = [
    {
      title: "Getting Started with Next.js 16 and Better Auth",
      slug: "getting-started-nextjs-16-better-auth",
      excerpt:
        "Learn how to build a modern web application with Next.js 16 App Router and Better Auth for authentication.",
      content: `# Getting Started with Next.js 16 and Better Auth

Welcome to this comprehensive guide on building modern web applications with Next.js 16 and Better Auth!

## Why Next.js 16?

Next.js 16 brings significant improvements to the App Router, including:

- Enhanced server components
- Improved streaming and suspense support
- Better error handling
- Optimized bundle sizes

## Setting Up Better Auth

Better Auth provides a modern, type-safe authentication solution that works seamlessly with Next.js.

\`\`\`typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
\`\`\`

## Conclusion

With Next.js 16 and Better Auth, you have a solid foundation for building secure, performant web applications.`,
      coverImage:
        "https://res.cloudinary.com/dqfeqh7s4/image/upload/v1767487009/cld-sample-5.jpg",
      published: true,
      publishedAt: new Date("2026-01-01"),
      metaTitle: "Getting Started with Next.js 16 and Better Auth",
      metaDescription:
        "Learn how to build a modern web application with Next.js 16 App Router and Better Auth for authentication.",
      metaKeywords: "nextjs, better-auth, authentication, react, typescript",
      authorId: user.id,
    },
    {
      title: "Building a Blog with Prisma and PostgreSQL",
      slug: "building-blog-prisma-postgresql",
      excerpt:
        "Discover how to create a scalable blog platform using Prisma ORM and PostgreSQL database.",
      content: `# Building a Blog with Prisma and PostgreSQL

In this post, we'll explore how to build a robust blog platform using modern tools.

## Why Prisma?

Prisma is a next-generation ORM that provides:

- Type-safe database queries
- Auto-generated types
- Database migrations
- Intuitive data modeling

## Setting Up Your Schema

Here's a basic blog post schema:

\`\`\`prisma
model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String    @db.Text
  published   Boolean   @default(false)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
\`\`\`

## Database Queries

Prisma makes complex queries simple:

\`\`\`typescript
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: true },
  orderBy: { publishedAt: 'desc' },
});
\`\`\`

Happy coding!`,
      coverImage:
        "https://res.cloudinary.com/dqfeqh7s4/image/upload/v1767487009/cld-sample-5.jpg",
      published: true,
      publishedAt: new Date("2026-01-02"),
      metaTitle: "Building a Blog with Prisma and PostgreSQL",
      metaDescription:
        "Discover how to create a scalable blog platform using Prisma ORM and PostgreSQL database.",
      metaKeywords: "prisma, postgresql, database, orm, blog",
      authorId: user.id,
    },
    {
      title: "Modern UI Development with shadcn/ui and Tailwind CSS 4",
      slug: "modern-ui-shadcn-tailwind-css-4",
      excerpt:
        "Explore the latest in UI development with shadcn/ui components and Tailwind CSS 4's new features.",
      content: `# Modern UI Development with shadcn/ui and Tailwind CSS 4

Let's dive into building beautiful, accessible user interfaces with modern tools.

## What is shadcn/ui?

shadcn/ui is not a component library—it's a collection of re-usable components that you can copy and paste into your apps. Built on top of Radix UI and styled with Tailwind CSS.

## Why Tailwind CSS 4?

The latest version brings:

- Lightning-fast builds
- Improved CSS engine
- Better developer experience
- Enhanced composition patterns

## Building Components

Here's how easy it is to add a button:

\`\`\`bash
pnpm dlx shadcn@latest add button
\`\`\`

Then use it:

\`\`\`tsx
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return <Button variant="default">Click me</Button>;
}
\`\`\`

## Styling Best Practices

1. Use Tailwind utility classes for quick styling
2. Extract repeated patterns into components
3. Use CSS variables for theming
4. Keep your design system consistent

## Conclusion

With shadcn/ui and Tailwind CSS 4, you can build professional UIs faster than ever before.`,
      coverImage:
        "https://res.cloudinary.com/dqfeqh7s4/image/upload/v1767487009/cld-sample-5.jpg",
      published: true,
      publishedAt: new Date("2026-01-03"),
      metaTitle: "Modern UI Development with shadcn/ui and Tailwind CSS 4",
      metaDescription:
        "Explore the latest in UI development with shadcn/ui components and Tailwind CSS 4's new features.",
      metaKeywords: "shadcn, tailwindcss, ui, react, components",
      authorId: user.id,
    },
    {
      title: "Draft: Image Optimization with Cloudinary",
      slug: "draft-image-optimization-cloudinary",
      excerpt:
        "A comprehensive guide to optimizing images using Cloudinary CDN and transformations.",
      content: `# Image Optimization with Cloudinary (Draft)

This is a draft post about image optimization strategies...

## Coming Soon

- Automatic format conversion
- Responsive images
- CDN delivery
- On-the-fly transformations

Stay tuned!`,
      coverImage:
        "https://res.cloudinary.com/dqfeqh7s4/image/upload/v1767487009/cld-sample-5.jpg",
      published: false,
      publishedAt: null,
      metaTitle: "Image Optimization with Cloudinary",
      metaDescription:
        "Learn how to optimize images for the web using Cloudinary.",
      authorId: user.id,
    },
  ];

  console.log("📝 Creating posts...");

  for (const post of posts) {
    const created = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
    console.log(
      `   ✅ Created: ${created.title} (${
        created.published ? "Published" : "Draft"
      })`
    );
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log(`   📊 Created ${posts.length} posts`);
  console.log(`   👤 Author: ${user.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
