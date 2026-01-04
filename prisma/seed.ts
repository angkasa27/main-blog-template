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
      content: `<h2>Getting Started with Next.js 16 and Better Auth</h2><p>Welcome to this comprehensive guide on building modern web applications with Next.js 16 and Better Auth!</p><h2>Why Next.js 16?</h2><p>Next.js 16 brings significant improvements to the App Router, including:</p><ul><li><p>Enhanced server components</p></li><li><p>Improved streaming and suspense support</p></li><li><p>Better error handling</p></li><li><p>Optimized bundle sizes</p></li></ul><h2>Setting Up Better Auth</h2><p>Better Auth provides a modern, type-safe authentication solution that works seamlessly with Next.js.</p><pre><code class="language-typescript">import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});</code></pre><h2>Conclusion</h2><p>With Next.js 16 and Better Auth, you have a solid foundation for building secure, performant web applications.</p>`,
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
      content: `<h2>Building a Blog with Prisma and PostgreSQL</h2><p>In this post, we'll explore how to build a robust blog platform using modern tools.</p><h2>Why Prisma?</h2><p>Prisma is a next-generation ORM that provides:</p><ul><li><p>Type-safe database queries</p></li><li><p>Auto-generated types</p></li><li><p>Database migrations</p></li><li><p>Intuitive data modeling</p></li></ul><h2>Setting Up Your Schema</h2><p>Here's a basic blog post schema:</p><pre><code class="language-prisma">model Post {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String    @db.Text
  published   Boolean   @default(false)
  authorId    String
  author      User      @relation(fields: [authorId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}</code></pre><h2>Database Queries</h2><p>Prisma makes complex queries simple:</p><pre><code class="language-typescript">const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: true },
  orderBy: { publishedAt: 'desc' },
});</code></pre><p>Happy coding!</p>`,
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
      content: `<h2>Modern UI Development with shadcn/ui and Tailwind CSS 4</h2><p>Let's dive into building beautiful, accessible user interfaces with modern tools.</p><h2>What is shadcn/ui?</h2><p>shadcn/ui is not a component library—it's a collection of re-usable components that you can copy and paste into your apps. Built on top of Radix UI and styled with Tailwind CSS.</p><h2>Why Tailwind CSS 4?</h2><p>The latest version brings:</p><ul><li><p>Lightning-fast builds</p></li><li><p>Improved CSS engine</p></li><li><p>Better developer experience</p></li><li><p>Enhanced composition patterns</p></li></ul><h2>Building Components</h2><p>Here's how easy it is to add a button:</p><pre><code class="language-bash">pnpm dlx shadcn@latest add button</code></pre><p>Then use it:</p><pre><code class="language-tsx">import { Button } from "@/components/ui/button";

export function MyComponent() {
  return &lt;Button variant="default"&gt;Click me&lt;/Button&gt;;
}</code></pre><h2>Styling Best Practices</h2><ol><li><p>Use Tailwind utility classes for quick styling</p></li><li><p>Extract repeated patterns into components</p></li><li><p>Use CSS variables for theming</p></li><li><p>Keep your design system consistent</p></li></ol><h2>Conclusion</h2><p>With shadcn/ui and Tailwind CSS 4, you can build professional UIs faster than ever before.</p>`,
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
      content: `<h2>Image Optimization with Cloudinary (Draft)</h2><p>This is a draft post about image optimization strategies...</p><h2>Coming Soon</h2><ul><li><p>Automatic format conversion</p></li><li><p>Responsive images</p></li><li><p>CDN delivery</p></li><li><p>On-the-fly transformations</p></li></ul><p>Stay tuned!</p>`,
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
