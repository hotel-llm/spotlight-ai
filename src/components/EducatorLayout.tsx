import * as React from "react";
import { LayoutDashboard, Microscope, Target } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import HistorySidebar from "@/components/HistorySidebar";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function NavItem({
  to,
  icon: Icon,
  label,
  isActive,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <Link to={to} className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="text-sm">{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function EducatorLayout({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const location = useLocation();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background pt-14">
        <div className="relative">
          <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border">
            <SidebarHeader className="gap-3 p-3">
              <div className="flex items-center justify-between gap-2">
                <Link to="/" className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-sidebar-foreground" />
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-sidebar-foreground">
                    BlindSpot
                  </span>
                </Link>
                <SidebarTrigger className="text-sidebar-foreground/80 hover:text-sidebar-foreground" />
              </div>

              <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2">
                <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
                  Classroom view
                </div>
                <div className="mt-0.5 text-xs text-sidebar-foreground/90">
                  Diagnose misconceptions, fast.
                </div>
              </div>

              <SidebarMenu>
                <NavItem
                  to="/"
                  icon={LayoutDashboard}
                  label="Dashboard"
                  isActive={location.pathname === "/"}
                />
                <NavItem
                  to="/lab"
                  icon={Microscope}
                  label="Lab"
                  isActive={location.pathname === "/lab"}
                />
              </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator />
            <HistorySidebar />
            <SidebarRail />
          </Sidebar>

          <SidebarInset className={cn("bg-background", className)}>
            <div className="container py-10">
              <div className="mb-8 flex items-end justify-between gap-6">
                <div className="min-w-0">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                  {subtitle ? (
                    <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                  ) : null}
                </div>
              </div>

              {children}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}

