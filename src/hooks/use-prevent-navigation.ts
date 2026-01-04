"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConfirm } from "./use-confirm-dialog";

export function usePreventNavigation(when: boolean, message?: string) {
  const pathname = usePathname();
  const currentPathRef = useRef(pathname);
  const { confirm } = useConfirm();
  const preventNavigationRef = useRef(false);

  useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!when) return;

    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor && anchor.href && !anchor.target) {
        const url = new URL(anchor.href);
        const isSameOrigin = url.origin === window.location.origin;
        const isDifferentPath = url.pathname !== currentPathRef.current;
        
        if (isSameOrigin && isDifferentPath) {
          e.preventDefault();
          e.stopPropagation();
          
          const shouldLeave = await confirm({
            title: "Unsaved Changes",
            description: message || "You have unsaved changes. Are you sure you want to leave?",
          });
          
          if (shouldLeave) {
            preventNavigationRef.current = false;
            window.location.href = anchor.href;
          }
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [when, message, confirm]);
}
