import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lubwqxppmnekdkohszhe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking profiles table...");
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('avatar_url').limit(1);
  if (pErr) console.error("Profiles error:", pErr.message);
  else console.log("Profiles queried successfully. avatar_url column exists:", profiles !== null);

  console.log("Checking storage buckets...");
  const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
  if (bErr) console.error("Buckets error:", bErr.message);
  else {
    console.log("Buckets:", buckets?.map(b => b.name));
    const avatarsBucket = buckets?.find(b => b.name === 'avatars');
    if (avatarsBucket) {
      console.log("avatars bucket found. Public:", avatarsBucket.public);
    } else {
      console.log("avatars bucket NOT FOUND.");
    }
  }
}

check();
