import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Microscope, Target, LogOut, UserCircle2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/lab", label: "Lab", icon: Microscope },
];

const AppNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const onLogout = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-slate-50/90 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span
            data-nav-brand-slot
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-slate-900"
          >
            {location.pathname !== "/" ? <Target className="h-5 w-5" strokeWidth={1.5} /> : null}
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900">Blindspot</span>
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
                    ? "border border-slate-200 bg-white text-slate-900"
                    : "text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2 h-8 gap-2 border-slate-200 bg-white text-xs text-slate-900">
                  <UserCircle2 className="h-4 w-4 text-slate-600" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 border border-slate-200">
                <DropdownMenuLabel className="truncate text-xs font-normal text-slate-600">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="ml-2">
              <Button className="h-8 bg-indigo-600 px-4 text-xs font-semibold hover:bg-indigo-700">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AppNav;
