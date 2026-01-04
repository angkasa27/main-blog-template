"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex-1" />

        {/* User info and sign out */}
        <div className="flex items-center gap-4">
          {session?.user && (
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {session.user.name}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-500">
                  {session.user.email}
                </span>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
