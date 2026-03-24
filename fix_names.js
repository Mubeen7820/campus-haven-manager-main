const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'frontend/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixNames() {
    console.log("Fixing names...");
    // Update profiles to null for any names that are generic
    const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('*');

    if (fetchError) {
        console.error("Error fetching profiles:", fetchError);
        return;
    }

    const genericNames = ['mess', 'mess staff', 'mess_staff', 'kitchen master', 'kitchen', 'admin', 'administrator'];

    for (const profile of profiles) {
        const rawName = profile.full_name?.trim().toLowerCase();
        
        if (!rawName || genericNames.includes(rawName)) {
            // derive from email
            let parsedName = profile.email.split('@')[0].split('.')[0];
            parsedName = parsedName.charAt(0).toUpperCase() + parsedName.slice(1);
            
            console.log(`Updating user ${profile.email} to name: ${parsedName}`);
            
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ full_name: parsedName })
                .eq('id', profile.id);
                
            if (updateError) {
                console.error(`Failed to update ${profile.email}:`, updateError);
            }
        }
    }
    console.log("Names fixed!");
}

fixNames();
