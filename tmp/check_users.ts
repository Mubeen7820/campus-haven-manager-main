
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'frontend/.env' })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkUser() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  if (error) {
    console.error(error)
    return
  }
  
  for (const user of users) {
    console.log(`User: ${user.email} (${user.id})`)
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    console.log(`  Profile: ${profile?.full_name} / ${profile?.role}`)
    
    if (profile?.role === 'student') {
      const { data: student } = await supabase.from('students').select('*').eq('profile_id', user.id).maybeSingle()
      console.log(`  Student: ${student?.name}`)
    }
  }
}

checkUser()
