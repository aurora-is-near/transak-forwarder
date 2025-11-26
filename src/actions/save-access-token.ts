import { createServerSupabaseClient } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type AccessTokenInsert =
  Database["public"]["Tables"]["access_tokens"]["Insert"];
type AccessTokenRow = Database["public"]["Tables"]["access_tokens"]["Row"];

export const saveAccessToken = async (
  accessToken: string,
  apiKey: string
): Promise<{
  success: boolean;
  data?: AccessTokenRow;
  error?: string;
}> => {
  try {
    if (!accessToken) {
      throw new Error("The `access_token` field is required");
    }

    if (!apiKey) {
      throw new Error("The `api_key` field is required");
    }

    const supabase = createServerSupabaseClient();

    const insertData: AccessTokenInsert = {
      access_token: accessToken,
      api_key: apiKey,
    };

    const { data, error } = await supabase
      .from("access_tokens")
      .upsert(insertData, { onConflict: "api_key" })
      .select()
      .single();

    if (error) {
      console.error("Error saving access token:", error);
      throw new Error(`Failed to save access token: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
};
