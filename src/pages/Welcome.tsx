import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Target } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import type { AuthChangeEvent } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

type AuthStatus = "loading" | "authed" | "anon";

const Welcome = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const handler = (event: AuthChangeEvent, next: Session | null) => {
      if (event === "INITIAL_SESSION") {
        if (next) {
          setSession(next);
          setStatus("authed");
        } else {
          setSession(null);
          setStatus("anon");
        }
        return;
      }
      if (next) {
        setSession(next);
        setStatus("authed");
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange(handler);

    const fallback = window.setTimeout(() => {
      void supabase.auth.getSession().then(({ data }) => {
        setStatus((s) => {
          if (s !== "loading") return s;
          if (data.session) {
            setSession(data.session);
            return "authed";
          }
          return "anon";
        });
      });
    }, 2500);

    return () => {
      sub.subscription.unsubscribe();
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (status === "anon") {
      navigate("/login", { replace: true, state: { from: "/welcome" } });
    }
  }, [status, navigate]);

  if (status !== "authed" || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-14">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-foreground" />
          Completing sign-in…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="container max-w-3xl py-16">
        <div className="mb-10 flex items-center gap-3">
          <Target className="h-10 w-10 text-foreground" strokeWidth={1} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Welcome</p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">You're in Blindspot</h1>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-muted-foreground">
          Blindspot turns a photo of handwritten STEM work into a clear diagnostic: where the thinking breaks,
          what type of error it is, and what to teach next.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
