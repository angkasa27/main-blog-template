import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        ← Back to all posts
      </Link>
    </footer>
  );
}
