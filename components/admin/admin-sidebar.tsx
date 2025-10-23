"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  FileText,
  Sparkles,
  ArrowLeft,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdminSidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

const navItems = [
  {
    title: "Overview",
    url: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Programs",
    url: "/dashboard/admin/programs",
    icon: Sparkles,
  },
  {
    title: "Events",
    url: "/dashboard/admin/events",
    icon: Calendar,
  },
  {
    title: "Stories",
    url: "/dashboard/admin/stories",
    icon: FileText,
  },
  {
    title: "Shop",
    url: "/dashboard/admin/shop",
    icon: ShoppingBag,
  },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10" style={{ backgroundColor: 'rgb(25, 21, 18)' }}>
      <SidebarHeader className="border-b border-white/10" style={{ backgroundColor: 'rgb(25, 21, 18)' }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/10 text-white">
                <LayoutDashboard className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">Admin Panel</span>
                <span className="truncate text-xs text-white/60">Content Management</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent style={{ backgroundColor: 'rgb(25, 21, 18)' }}>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 text-xs font-semibold tracking-wider uppercase">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url || 
                  (item.url !== "/dashboard/admin" && pathname.startsWith(item.url))
                
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={isActive ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10" style={{ backgroundColor: 'rgb(25, 21, 18)' }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white/70 hover:text-white hover:bg-white/5">
              <Link href="/dashboard">
                <ArrowLeft className="size-4" />
                <span>Back to Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg border border-white/20">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback className="rounded-lg bg-white/10 text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">{user.name}</span>
                <span className="truncate text-xs text-white/60">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

