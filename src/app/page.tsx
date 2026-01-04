import type { Metadata } from "next";
import { LandingPage } from "@/containers/public/landing-page";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to our blog. Discover articles about web development, design, technology, and more.",
  openGraph: {
    title: "Home - Our Blog",
    description:
      "Welcome to our blog. Discover articles about web development, design, technology, and more.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default LandingPage;
