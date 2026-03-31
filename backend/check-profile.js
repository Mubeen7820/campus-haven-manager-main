import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkProfile() {
    const email = 'mubeenahmed.shaik@aurora.edu.in';
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();
    
    if (error) {
        fs.writeFileSync('profile-check.txt', `Error: ${error.message}`);
    } else if (data) {
        fs.writeFileSync('profile-check.txt', JSON.stringify(data, null, 2));
    } else {
        fs.writeFileSync('profile-check.txt', `No profile found for ${email}`);
    }
}

checkProfile();
