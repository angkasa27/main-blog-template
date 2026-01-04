"use client";

import { useEffect, useRef } from "react";

const VIEW_STORAGE_KEY = "viewed_posts";
const VIEW_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

function hasViewedRecently(slug: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    if (!stored) return false;

    const viewedPosts: Record<string, number> = JSON.parse(stored);
    const lastViewed = viewedPosts[slug];

    if (!lastViewed) return false;

    // Check if viewed within last 24 hours
    return Date.now() - lastViewed < VIEW_EXPIRY_MS;
  } catch {
    return false;
  }
}

function markAsViewed(slug: string): void {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    const viewedPosts: Record<string, number> = stored ? JSON.parse(stored) : {};

    viewedPosts[slug] = Date.now();

    // Clean up old entries (older than 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    Object.keys(viewedPosts).forEach((key) => {
      if (viewedPosts[key] < thirtyDaysAgo) {
        delete viewedPosts[key];
      }
    });

    localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(viewedPosts));
  } catch {
    // Ignore localStorage errors (private browsing, quota exceeded, etc.)
  }
}

export function useTrackView(slug: string, enabled: boolean = true) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!enabled || tracked.current) return;

    // Check if already viewed recently
    if (hasViewedRecently(slug)) {
      tracked.current = true;
      return;
    }

    // Wait 3 seconds before counting as a view
    // This filters out bounces and accidental clicks
    const timer = setTimeout(async () => {
      try {
        await fetch(`/api/posts/${slug}/view`, {
          method: "POST",
        });
        markAsViewed(slug);
        tracked.current = true;
      } catch (error) {
        console.error("Failed to track view:", error);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [slug, enabled]);
}
