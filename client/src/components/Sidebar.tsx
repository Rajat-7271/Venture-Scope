import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  PieChart, 
  Users, 
  Settings, 
  Bell, 
  LogOut,
  Search,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: PieChart, label: "Analytics", href: "/analytics" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();
  
  const NavContent = () => (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-border">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <PieChart className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">NexusDash</span>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            placeholder="Search..." 
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted/50 border border-transparent focus:bg-background focus:border-primary/20 focus:ring-2 focus:ring-primary/10 transition-all text-sm outline-none"
          />
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group",
                  location === item.href 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  location === item.href ? "scale-105" : "group-hover:scale-110"
                )} />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Jane Doe</p>
            <p className="text-xs text-muted-foreground truncate">jane@nexus.com</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 h-screen fixed left-0 top-0 z-30">
        <NavContent />
      </aside>

      {/* Mobile Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-md shadow-sm">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
