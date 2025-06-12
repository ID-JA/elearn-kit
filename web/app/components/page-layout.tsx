import {
  ChevronRight,
  X,
  Home,
  Settings,
  Users,
  BarChart3,
  FileText,
  HelpCircle,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

export default function PageLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[500px] transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={cn(
          "fixed z-30 flex items-center justify-center bg-primary text-primary-foreground rounded-r-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "h-12 w-6 left-0 top-1/2 -translate-y-1/2",
          sidebarOpen && "left-[500px]"
        )}
        aria-expanded={sidebarOpen}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            sidebarOpen && "rotate-180"
          )}
        />
      </button>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-[500px]" : "ml-0"
        )}
      >
        <div className="container mx-auto p-4 md:p-6">
          <Outlet context={{sidebarOpen}}  />
        </div>
      </main>
    </div>
  );
}
const navItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "#",
    active: true,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "#",
  },
  {
    title: "Customers",
    icon: Users,
    href: "#",
  },
  {
    title: "Documents",
    icon: FileText,
    href: "#",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "#",
  },
  {
    title: "Help & Support",
    icon: HelpCircle,
    href: "#",
  },
];

function Sidebar({ onClose }) {
  return (
    <div className="flex h-full flex-col bg-card border-r">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <SidebarNav />
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarNav() {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <Button
          key={item.title}
          variant={item.active ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start",
            item.active ? "bg-secondary" : "hover:bg-muted"
          )}
          asChild
        >
          <a href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </a>
        </Button>
      ))}
    </nav>
  );
}
