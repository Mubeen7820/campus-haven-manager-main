
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
    console.log('Testing connection to Supabase...')
    try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1)
        if (error) {
            console.error('Supabase Error:', error)
        } else {
            console.log('Success! Data:', data)
        }
    } catch (err) {
        console.error('Unexpected Error:', err)
    }
}

testConnection()
