import { supabase } from "@/integrations/supabase/client";

export type ScanCreditState = {
  allowed: boolean;
  credits: number | null;
};

export async function checkScanCredits(): Promise<ScanCreditState> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If there is no signed-in user yet, allow local usage flow.
  if (!user) {
    return { allowed: true, credits: null };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("scan_credits")
    .eq("id", user.id)
    .single();

  if (error) {
    // Do not block scanning on unexpected table/RLS issues.
    return { allowed: true, credits: null };
  }

  const credits = data?.scan_credits ?? 0;
  return { allowed: credits > 0, credits };
}

