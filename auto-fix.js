
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function autoFix() {
    const email = 'sahithi.thavishi@aurora.edu.in'
    console.log('Attempting to auto-fix for:', email)

    try {
        // 1. Get User ID (we need to be "logged in" or know the ID)
        // Since we don't have the user's password, we can't sign in.
        // However, if the user ran the SQL, we might find the ID in auth.users
        // But anon key can't read auth.users.

        // Let's see if we can at least create a student record with just the email
        // if RLS is off.
        const { data, error } = await supabase
            .from('students')
            .insert([
                {
                    name: 'Sahithi Thavishi',
                    email: email,
                    admission_no: 'AUTO' + Math.floor(Math.random() * 10000),
                    status: 'Active'
                }
            ])
            .select()

        if (error) {
            console.error('Failed to insert student (This is expected if RLS is ON):', error)
            console.log('This confirms you MUST run the SQL in the Supabase Dashboard.')
        } else {
            console.log('SUCCESS! Auto-created student record:', data)
            console.log('Now refresh your app!')
        }

    } catch (err) {
        console.error('Error:', err)
    }
}

autoFix()
