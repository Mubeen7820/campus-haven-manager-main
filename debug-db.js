
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lubwqxppmnekdkohszhe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YndxeHBwbW5la2Rrb2hzemhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDE5NjksImV4cCI6MjA4NjcxNzk2OX0.gU1VeZmWQkHvUtGdBw5WSCnLRbpG4aDTxNn6xGBOvwg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugDatabase() {
    console.log('Debugging database content...')

    try {
        // Check Profiles count
        const { count: profileCount, error: pError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        console.log('Total Profiles:', profileCount)

        // Check Students count
        const { count: studentCount, error: sError } = await supabase
            .from('students')
            .select('*', { count: 'exact', head: true })

        console.log('Total Students:', studentCount)

        // List some emails from profiles
        const { data: profiles, error: pListData } = await supabase
            .from('profiles')
            .select('email, role')
            .limit(5)

        console.log('Recent Profiles:', profiles)

        // List some emails from students
        const { data: students, error: sListData } = await supabase
            .from('students')
            .select('email, name')
            .limit(5)

        console.log('Recent Students:', students)

    } catch (err) {
        console.error('Error:', err)
    }
}

debugDatabase()
