import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getTableStructure() {
    const results = [];
    const tables = ['blocks', 'rooms', 'students'];
    for (const table of tables) {
        results.push(`Structure for table: ${table}...`);
        // We can't really get the structure easily via the JS SDK without RPC or querying information_schema
        // But we can try to insert a dummy row or select with a weird condition to see what happens
        // Or better, just select the first row and see the keys
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            results.push(`Error fetching from ${table}: ${error.message}`);
        } else if (data && data.length > 0) {
            results.push(`Keys for ${table}: ${Object.keys(data[0]).join(', ')}`);
        } else {
            results.push(`Table ${table} is empty.`);
        }
    }
    fs.writeFileSync('table-structures.txt', results.join('\n'));
}

getTableStructure();
