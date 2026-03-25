import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, Target } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const welcomeUrl = () => `${window.location.origin}/welcome`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/lab";

  const onPasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back.");
    navigate(redirectTo, { replace: true });
  };

  const onMagicLinkLogin = async () => {
    if (!email) {
      toast.error("Enter an email first.");
      return;
    }
    setIsLoading(true);
    // Redirects to /welcome after the user confirms via email (add this URL in Supabase Auth → URL config).
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: welcomeUrl() },
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Check your email for the sign-in link.");
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-14">
      <div className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md border border-slate-200 bg-white p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <Target className="h-10 w-10 text-slate-900" strokeWidth={1} />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Sign in to Blindspot</h1>
            <p className="mt-2 text-sm text-slate-600">Use your work email. Email confirmation follows your Supabase project settings.</p>
          </div>

          <form onSubmit={onPasswordLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-xs font-medium text-slate-600">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-slate-200 pl-9"
                  placeholder="you@school.edu"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-xs font-medium text-slate-600">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-slate-200 pl-9"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign in
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Button variant="outline" className="w-full border-slate-200 bg-white" onClick={onMagicLinkLogin} disabled={isLoading}>
            Email me a magic link
          </Button>

          <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
            In Supabase → Authentication → URL configuration, add{" "}
            <span className="font-mono text-slate-700">{welcomeUrl()}</span> to redirect allow list.
            <br />
            <Link to="/" className="mt-2 inline-block font-medium text-indigo-600 hover:text-indigo-700">
              Back to home
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
