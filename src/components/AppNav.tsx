import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Microscope, Target } from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/lab", label: "Lab", icon: Microscope },
];

const AppNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Target className="h-5 w-5 text-foreground" />
          <span className="font-display text-sm font-bold tracking-widest text-foreground uppercase">
            BlindSpot
          </span>
        </Link>
        <div className="flex items-center gap-0">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 border-b-2 px-4 py-4 text-xs font-display uppercase tracking-wider transition-colors ${
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AppNav;
