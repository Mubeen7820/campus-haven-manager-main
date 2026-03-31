import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkAdmin() {
    // We can't easily check "current user" from node without an auth token.
    // But we can check if there are ANY admins in the profiles table.
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin');
    
    if (error) {
        console.error('Error fetching admins:', error.message);
    } else {
        console.log('Admins found:', data.length);
        console.log(JSON.stringify(data, null, 2));
    }
}

checkAdmin();
