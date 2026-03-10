
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkStudentStatus() {
    const email = 'sahithi.thavishi@aurora.edu.in'
    console.log('Checking status for:', email)

    try {
        // 1. Check Profile
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .maybeSingle()

        console.log('Profile:', profile)

        // 2. Check Student
        const { data: student, error: sError } = await supabase
            .from('students')
            .select('*')
            .eq('email', email)
            .maybeSingle()

        console.log('Student by Email:', student)

        if (profile) {
            const { data: studentById, error: sIdError } = await supabase
                .from('students')
                .select('*')
                .eq('profile_id', profile.id)
                .maybeSingle()
            console.log('Student by Profile ID:', studentById)
        }

    } catch (err) {
        console.error('Error:', err)
    }
}

checkStudentStatus()
