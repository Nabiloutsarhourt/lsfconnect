import { SupabaseClient } from "@supabase/supabase-js";

export async function getSubscriptionStatus(supabase: SupabaseClient) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { isPro: false, tier: "free" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();

    return {
        isPro: profile?.subscription_tier === "pro" || profile?.subscription_tier === "enterprise",
        tier: profile?.subscription_tier || "free"
    };
}

export async function checkProAccess(supabase: SupabaseClient) {
    const { isPro } = await getSubscriptionStatus(supabase);
    return isPro;
}
