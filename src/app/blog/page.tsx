import type { Metadata } from "next";
import { BlogList } from "@/containers/public/blog-list";

export const metadata: Metadata = {
  title: "Blog - All Posts",
  description:
    "Browse all our blog posts about web development, design, and technology. Stay updated with the latest articles and tutorials.",
  openGraph: {
    title: "Blog - All Posts",
    description:
      "Browse all our blog posts about web development, design, and technology.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default BlogList;
