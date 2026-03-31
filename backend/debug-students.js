import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugStudents() {
    console.log('Fetching students...');
    const { data, error, count } = await supabase
        .from('students')
        .select('*', { count: 'exact' });
    
    if (error) {
        fs.writeFileSync('debug-students.txt', `Error: ${JSON.stringify(error, null, 2)}`);
    } else {
        fs.writeFileSync('debug-students.txt', `Count: ${count}\nData: ${JSON.stringify(data, null, 2)}`);
    }
}

debugStudents();
