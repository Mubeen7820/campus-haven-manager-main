-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mess_attendance ENABLE ROW LEVEL SECURITY;

-- FUNCTIONS
-- A helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure function runs with a predictable search_path
  PERFORM set_config('search_path', 'public, pg_temp', true);

  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- A helper function to check if the current user is mess staff
CREATE OR REPLACE FUNCTION public.is_mess_staff()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'mess_staff'
  );
END;
$$;

-- PROFILES
-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Users can insert their own profile (e.g. during signup if trigger fails)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

-- Admin view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING ( public.is_admin() );


-- ROOMS
DROP POLICY IF EXISTS "Authenticated users can view rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins can manage rooms" ON public.rooms;

-- Everyone (authenticated) can view rooms
CREATE POLICY "Authenticated users can view rooms"
  ON public.rooms FOR SELECT
  TO authenticated
  USING ( true );

-- Only admins can insert/update/delete rooms
CREATE POLICY "Admins can manage rooms"
  ON public.rooms FOR ALL
  USING ( public.is_admin() );


-- STUDENTS
DROP POLICY IF EXISTS "Admins can manage students" ON public.students;
DROP POLICY IF EXISTS "Students can view own record" ON public.students;

-- Admins can manage students
CREATE POLICY "Admins can manage students"
  ON public.students FOR ALL
  USING ( public.is_admin() );

-- Students can view their own record (linked via profile_id)
CREATE POLICY "Students can view own record"
  ON public.students FOR SELECT
  USING ( profile_id = auth.uid() );

-- Mess staff can view student info for attendance verification
CREATE POLICY "Mess staff can view student info"
  ON public.students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );


-- COMPLAINTS
DROP POLICY IF EXISTS "Students can create complaints" ON public.complaints;
DROP POLICY IF EXISTS "Students can view own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Admins can manage complaints" ON public.complaints;
DROP POLICY IF EXISTS "Mess staff can manage complaints" ON public.complaints;
DROP POLICY IF EXISTS "Mess staff can view complaints" ON public.complaints;
DROP POLICY IF EXISTS "Mess staff can update complaints" ON public.complaints;
DROP POLICY IF EXISTS "Mess staff can delete complaints" ON public.complaints;

-- Students can insert their own complaints
CREATE POLICY "Students can create complaints"
  ON public.complaints FOR INSERT
  WITH CHECK ( user_id = auth.uid() );

-- Students can view their own complaints
CREATE POLICY "Students can view own complaints"
  ON public.complaints FOR SELECT
  USING ( user_id = auth.uid() );

-- Admins can view and update all complaints
CREATE POLICY "Admins can manage complaints"
  ON public.complaints FOR ALL
  TO authenticated
  USING ( public.is_admin() );

-- Mess staff can manage complaints (filtered in UI)
CREATE POLICY "Mess staff can view complaints"
  ON public.complaints FOR SELECT
  TO authenticated
  USING ( public.is_mess_staff() );

CREATE POLICY "Mess staff can update complaints"
  ON public.complaints FOR UPDATE
  TO authenticated
  USING ( public.is_mess_staff() );

CREATE POLICY "Mess staff can delete complaints"
  ON public.complaints FOR DELETE
  TO authenticated
  USING ( public.is_mess_staff() );


-- LEAVES
DROP POLICY IF EXISTS "Students can create leave requests" ON public.leaves;
DROP POLICY IF EXISTS "Students can view own leave requests" ON public.leaves;
DROP POLICY IF EXISTS "Admins can manage leave requests" ON public.leaves;

-- Students can insert their own leave requests
CREATE POLICY "Students can create leave requests"
  ON public.leaves FOR INSERT
  WITH CHECK ( user_id = auth.uid() );

-- Students can view their own leave requests
CREATE POLICY "Students can view own leave requests"
  ON public.leaves FOR SELECT
  USING ( user_id = auth.uid() );

-- Admins can view and update all leave requests
CREATE POLICY "Admins can manage leave requests"
  ON public.leaves FOR ALL
  USING ( public.is_admin() );


-- PAYMENTS
DROP POLICY IF EXISTS "Students can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage payments" ON public.payments;

-- Students can view their own payments via student relationship
CREATE POLICY "Students can view own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE students.id = payments.student_id
      AND students.profile_id = auth.uid()
    )
  );

-- Admins can manage payments
CREATE POLICY "Admins can manage payments"
  ON public.payments FOR ALL
  USING ( public.is_admin() );


-- MESS MENU
DROP POLICY IF EXISTS "Everyone can view mess menu" ON public.mess_menu;
DROP POLICY IF EXISTS "Staff can manage menu" ON public.mess_menu;

-- Everyone can view the menu
CREATE POLICY "Everyone can view mess menu"
  ON public.mess_menu FOR SELECT
  TO authenticated
  USING ( true );

-- Admin and Mess Staff can manage menu
CREATE POLICY "Staff can manage menu"
  ON public.mess_menu FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );


-- MESS ATTENDANCE
DROP POLICY IF EXISTS "Staff can manage attendance" ON public.mess_attendance;
DROP POLICY IF EXISTS "Students can view own attendance" ON public.mess_attendance;

-- Admin and Mess Staff can manage attendance
CREATE POLICY "Staff can manage attendance"
  ON public.mess_attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );

-- Students can view their own attendance records
CREATE POLICY "Students can view own attendance"
  ON public.mess_attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.students
      WHERE students.id = mess_attendance.student_id
      AND students.profile_id = auth.uid()
    )
  );


-- MESS INVENTORY
DROP POLICY IF EXISTS "Staff can manage inventory" ON public.mess_inventory;

-- Admin and Mess Staff can manage inventory
CREATE POLICY "Staff can manage inventory"
  ON public.mess_inventory FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'mess_staff')
    )
  );