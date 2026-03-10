
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'frontend/.env' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function testUpdate() {
  const userId = 'YOUR_USER_ID'; // I need to get a real ID or use a dynamic one
  const testUrl = 'https://test.com/image.png';
  
  console.log(`Updating user ${userId} with ${testUrl}...`);
  const { error } = await supabase.from('profiles').update({ avatar_url: testUrl }).eq('id', userId);
  
  if (error) console.error("Update Error:", error);
  else console.log("Update sent.");

  const { data, error: fetchError } = await supabase.from('profiles').select('avatar_url').eq('id', userId).single();
  if (fetchError) console.error("Fetch Error:", fetchError);
  else console.log("Current avatar_url in DB:", data.avatar_url);
}
// I won't run this without a real ID. 
// Instead, I'll check if the schema has avatar_url and what the RLS looks like.
