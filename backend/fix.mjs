import dotenv from 'dotenv';
import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
  const { data: profiles } = await supabase.from('profiles').select('*');
  for (const p of profiles) {
     const rawName = p.full_name?.toLowerCase();
     if (!rawName || rawName.includes('kitchen master') || rawName.includes('mess') || rawName.includes('admin')) {
        let name = p.email.split('@')[0].split('.')[0];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        await supabase.from('profiles').update({full_name: name}).eq('id', p.id);
        await supabase.auth.admin.updateUserById(p.id, { user_metadata: { full_name: name } }); // Note: anon key might not allow this, but profiles table will be updated ok.
     }
  }
}
fix();
