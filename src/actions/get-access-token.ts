import { createServerSupabaseClient } from "@/lib/supabase";

export const getAccessToken = async (apiKey: string) => {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("access_tokens")
      .select("*")
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      ) // 7 days
      .eq("api_key", apiKey)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data?.access_token) {
      return null;
    }

    return data.access_token;
  } catch (error) {
    console.error("Unexpected error retrieving access token:", error);
    return null;
  }
};
