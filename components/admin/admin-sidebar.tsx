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
  Video,
  Users,
  ChevronRight,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

const programsItems = [
  {
    title: "Programs",
    url: "/dashboard/admin/programs",
    icon: Sparkles,
    subItems: [
      {
        title: "All Programs",
        url: "/dashboard/admin/programs",
      },
      {
        title: "Channels",
        url: "/dashboard/admin/community",
      },
      {
        title: "Videos",
        url: "/dashboard/admin/community/videos",
      },
    ],
  },
]

const contentItems = [
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
  
  // Auto-open Programs submenu if we're on programs, community, or videos pages
  const shouldOpenPrograms = pathname.startsWith("/dashboard/admin/programs") || 
                              pathname.startsWith("/dashboard/admin/community")
  
  const [openSubmenus, setOpenSubmenus] = React.useState<string[]>([])

  React.useEffect(() => {
    if (shouldOpenPrograms) {
      setOpenSubmenus((prev) => 
        prev.includes("Programs") ? prev : [...prev, "Programs"]
      )
    }
  }, [pathname])

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    )
  }

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
        {/* Overview */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/admin"}
                  className={pathname === "/dashboard/admin" ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"}
                >
                  <Link href="/dashboard/admin">
                    <LayoutDashboard className="size-4" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Programs Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 text-xs font-semibold tracking-wider uppercase">
            Programs
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {programsItems.map((item) => {
                const hasSubmenu = item.subItems && item.subItems.length > 0
                const isSubmenuOpen = openSubmenus.includes(item.title)
                const isSubmenuActive = hasSubmenu && item.subItems?.some(
                  (subItem) => pathname === subItem.url || pathname.startsWith(subItem.url)
                )

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      onClick={() => toggleSubmenu(item.title)}
                      isActive={isSubmenuActive}
                      className={cn(
                        "text-white/70 hover:text-white hover:bg-white/5 w-full",
                        isSubmenuActive && "bg-white/10 text-white"
                      )}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      <ChevronRight
                        className={cn(
                          "ml-auto size-4 transition-transform",
                          isSubmenuOpen && "rotate-90"
                        )}
                      />
                    </SidebarMenuButton>
                    {isSubmenuOpen && (
                      <SidebarMenuSub className="border-white/10">
                        {item.subItems?.map((subItem) => {
                          // Check for exact match first, then check if pathname starts with this URL
                          // But exclude if there's a more specific submenu item that matches
                          const exactMatch = pathname === subItem.url
                          const startsWithMatch = pathname.startsWith(subItem.url + "/")
                          
                          // Check if any other submenu item is a better match (more specific)
                          const hasMoreSpecificMatch = item.subItems?.some(other => 
                            other.url !== subItem.url && 
                            pathname.startsWith(other.url) &&
                            other.url.length > subItem.url.length
                          )
                          
                          const isSubActive = exactMatch || (startsWithMatch && !hasMoreSpecificMatch)
                          
                          return (
                            <SidebarMenuSubItem key={subItem.url}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={false}
                                className={cn(
                                  "text-white/60 hover:text-white hover:bg-transparent active:bg-transparent",
                                  "data-[active=true]:bg-transparent",
                                  isSubActive && "text-white bg-transparent"
                                )}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/60 text-xs font-semibold tracking-wider uppercase">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => {
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

