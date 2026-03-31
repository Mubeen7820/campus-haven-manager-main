-- Re-run this in Supabase SQL Editor if attendance is failing
-- This ensures the Mess Staff has permission to search for students and mark attendance

-- 1. Ensure Mess Staff can see ALL students (Required for marking attendance)
DROP POLICY IF EXISTS "Mess staff can view student info" ON public.students;
CREATE POLICY "Mess staff can view student info"
  ON public.students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );

-- 2. Ensure Mess Staff can insert attendance records
DROP POLICY IF EXISTS "Staff can manage attendance" ON public.mess_attendance;
CREATE POLICY "Staff can manage attendance"
  ON public.mess_attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );

-- 3. Verify the students table RLS is enabled
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_attendance ENABLE ROW LEVEL SECURITY;
