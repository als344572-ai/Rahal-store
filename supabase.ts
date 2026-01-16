
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ybzzpyliuyidaljcczcc.supabase.co';
// Using the provided project publishable key
const supabaseAnonKey = 'sb_ublishable_tdILDK1ICVepPCOoagARqQ_EVB1X'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Rahal Tent: Supabase credentials missing.");
}
