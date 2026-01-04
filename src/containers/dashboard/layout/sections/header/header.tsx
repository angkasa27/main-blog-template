"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { getInitials } from "@/utils/string";

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isMobile } = useSidebar();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    // <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
    //   <div className="flex h-16 items-center justify-between px-6">
    //     <div className="flex-1" />

    //     {/* User info and sign out */}
    //     <div className="flex items-center gap-4">
    //       {session?.user && (
    //         <div className="flex items-center gap-2">
    //           <User className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
    //           <div className="flex flex-col">
    //             <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
    //               {session.user.name}
    //             </span>
    //             <span className="text-xs text-neutral-500 dark:text-neutral-500">
    //               {session.user.email}
    //             </span>
    //           </div>
    //         </div>
    //       )}

    //       <Button
    //         variant="outline"
    //         size="sm"
    //         onClick={handleSignOut}
    //         className="gap-2"
    //       >
    //         <LogOut className="h-4 w-4" />
    //         Sign Out
    //       </Button>
    //     </div>
    //   </div>
    // </header>

    <header className="flex h-16 shrink-0 items-center gap-2 ease-linear border-b">
      <div className="flex items-center gap-2 px-4 w-full">
        {isMobile ? (
          <div className="flex-1">
            <SidebarTrigger />
          </div>
        ) : (
          // <Breadcrumb className="flex-1">
          //   <BreadcrumbList>
          //     <BreadcrumbItem className="hidden md:block">
          //       <BreadcrumbLink href="#">
          //         Building Your Application
          //       </BreadcrumbLink>
          //     </BreadcrumbItem>
          //     <BreadcrumbSeparator className="hidden md:block" />
          //     <BreadcrumbItem>
          //       <BreadcrumbPage>Data Fetching</BreadcrumbPage>
          //     </BreadcrumbItem>
          //   </BreadcrumbList>
          // </Breadcrumb>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">CMS Dashboard</h1>
          </div>
        )}

        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="wrap"
                  className="flex items-center gap-2 text-left text-sm p-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage alt={session.user.name} />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {session.user.name}
                    </span>
                    <span className="truncate text-xs">
                      {session.user.email}
                    </span>
                  </div>
                </Button>
              }
            />
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align={isMobile ? "center" : "start"}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button variant="outline" onClick={handleSignOut} className="gap-2">
          <span className="hidden md:block">{"Open "}</span>Website{" "}
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
