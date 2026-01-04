"use client";

import { useTrackView } from "@/hooks/use-track-view";

interface ViewTrackerProps {
  slug: string;
}

export function ViewTracker({ slug }: ViewTrackerProps) {
  useTrackView(slug);
  return null;
}
