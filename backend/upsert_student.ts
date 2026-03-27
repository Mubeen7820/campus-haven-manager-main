import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function upsertStudent() {
  const name = "Rithish";
  const email = "jyothirithish.jaman@aurora.edu.in";
  const admissionNo = "241U1R2004";
  const password = "Student@123";

  console.log(`Processing student: ${name} (${admissionNo})...`);

  // 1. Check if student exists by admission number
  const { data: existingStudent, error: findError } = await supabase
    .from('students')
    .select('*')
    .eq('admission_no', admissionNo)
    .maybeSingle();

  if (existingStudent) {
    console.log(`Student ${admissionNo} exists. Updating name and email to '${name}' and '${email}'...`);
    const { error: updateError } = await supabase
      .from('students')
      .update({ name: name, email: email })
      .eq('id', existingStudent.id);
    
    if (updateError) console.error("Update error:", updateError);
    else console.log("Student record updated successfully.");
  } else {
    console.log(`Creating new student record for ${name}...`);
    const { error: insertError } = await supabase
      .from('students')
      .insert([{
        name: name,
        email: email,
        admission_no: admissionNo,
        course: 'B.Tech',
        year: 1,
        status: 'Active',
        parent_name: 'Parent',
        parent_phone: '0000000000',
        blood_group: 'Unknown',
        emergency_contact: '0000000000'
      }]);
    
    if (insertError) console.error("Insert error:", insertError);
    else console.log("Student record created successfully.");
  }
}

upsertStudent();
