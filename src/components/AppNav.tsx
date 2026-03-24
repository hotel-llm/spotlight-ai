import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Microscope, Target } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/lab", label: "Diagnostic Lab", icon: Microscope },
  { path: "/report", label: "Report", icon: Target },
];

const AppNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            Blind<span className="text-primary text-glow-cyan">Spot</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30 glow-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AppNav;
