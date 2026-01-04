"use client";

import * as React from "react";
import {
  CirclePlus,
  FileText,
  House,
  LogOut,
  LucideIcon,
  PanelRightClose,
  Tags,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export type Menu = MenuGroup[];

const data: Menu = [
  {
    title: "Blog",
    items: [
      {
        title: "Posts",
        url: "/dashboard/posts",
        icon: FileText,
      },
      {
        title: "Tags",
        url: "/dashboard/tags",
        icon: Tags,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar, state, isMobile } = useSidebar();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b h-16">LOGO PLACEHOLDER</SidebarHeader>
      <SidebarContent className="pt-1">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={"Create New Post"}
                onClick={() => {
                  if (isMobile) toggleSidebar();
                  router.push("/dashboard/posts/new");
                }}
                variant={"primary"}
              >
                <CirclePlus />
                <span>Create New Post</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={"Dashboard"}
                onClick={() => {
                  if (isMobile) toggleSidebar();
                  router.push("/dashboard");
                }}
              >
                <House />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {!isMobile && (
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={"Expand"} onClick={toggleSidebar}>
                <PanelRightClose
                  className={clsx(state === "expanded" && "-rotate-180")}
                />
                <span>Collapse Sidebar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"Logout"}
              onClick={toggleSidebar}
              variant="destructive"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
