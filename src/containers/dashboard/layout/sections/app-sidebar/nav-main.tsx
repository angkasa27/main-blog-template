import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Menu, MenuItem } from "./app-sidebar";
import { useRouter } from "next/navigation";

export function NavMain({ items }: { items: Menu }) {
  return items.map((item) => (
    <SidebarGroup key={item.title}>
      <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
      <SidebarMenu>
        {item.items.map((item) => (
          <SidebarItem key={item.title} item={item as MenuItem} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  ));
}

function SidebarItem({ item }: { item: MenuItem }) {
  const router = useRouter();
  const { toggleSidebar, isMobile } = useSidebar();

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        tooltip={item.title}
        onClick={() => {
          if (isMobile) toggleSidebar();
          router.push(item.url);
        }}
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
