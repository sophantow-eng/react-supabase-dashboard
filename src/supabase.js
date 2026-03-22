import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xzwiszqtnuajnzqjecvu.supabase.co";
const supabaseKey = "sb_publishable_Ow85_zzfJ8g360RpMjztJQ_5lHooaVh";

export const supabase = createClient(supabaseUrl, supabaseKey);
