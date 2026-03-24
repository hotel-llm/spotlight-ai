import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Microscope, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/lab", label: "Lab", icon: Microscope },
];

const AppNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Target className="h-5 w-5 text-primary" />
          <span className="font-display text-sm font-bold text-foreground">
            BlindSpot
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
          <Link to="/lab" className="ml-2">
            <Button className="h-8 px-4 text-xs font-semibold">Start Scan</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AppNav;
