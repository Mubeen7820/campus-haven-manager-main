
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkFix() {
    const email = 'sahithi.thavishi@aurora.edu.in'
    console.log('Final verification for:', email)

    try {
        const { data: profile, error: pError } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle()
        const { data: student, error: sError } = await supabase.from('students').select('*').eq('email', email).maybeSingle()

        console.log('Profile found:', !!profile)
        console.log('Student found:', !!student)

        if (profile && student) {
            console.log('VERIFICATION SUCCESSFUL!')
        } else {
            console.log('VERIFICATION FAILED: Data still missing.')
        }
    } catch (err) {
        console.error('Error:', err)
    }
}

checkFix()
