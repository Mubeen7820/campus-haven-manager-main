
import { createClient } from '@supabase/supabase-client'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkTable() {
  const { data, error } = await supabase.from('blocks').select('*').limit(1)
  if (error) {
    console.log('Error or table missing:', error.message)
  } else {
    console.log('Table exists, data:', data)
  }
}

checkTable()
