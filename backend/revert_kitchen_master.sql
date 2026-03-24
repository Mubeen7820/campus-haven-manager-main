UPDATE public.profiles
SET full_name = NULL
WHERE role = 'mess_staff' AND full_name = 'Kitchen Master';
