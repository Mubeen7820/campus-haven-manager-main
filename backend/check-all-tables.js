import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function listTables() {
    // We can't list tables using anon key easily without RLS or information_schema,
    // but maybe we can try to RPC or just query some common names.
    const results = [];
    const possibleTables = ['user', 'users', 'User', 'Users', 'profiles', 'students', 'rooms', 'blocks'];
    for (const table of possibleTables) {
        const { data, error } = await supabase.from(table).select('id').limit(1);
        if (error) {
            results.push(`${table}: ERROR ${error.message}`);
        } else {
            results.push(`${table}: SUCCESS`);
        }
    }
    fs.writeFileSync('all-table-checks.txt', results.join('\n'));
}

listTables();
