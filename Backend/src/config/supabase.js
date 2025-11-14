import { creareClient } from "@supabase/supabase-js";

export const supabase = creareClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);