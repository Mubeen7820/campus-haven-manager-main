-- Improve complaints table: add category 'Mess' and a resolution text field
ALTER TABLE public.complaints DROP CONSTRAINT IF EXISTS complaints_category_check;
ALTER TABLE public.complaints ADD CONSTRAINT complaints_category_check 
  CHECK (category IN ('Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Mess', 'Other'));

-- Add resolution field if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='complaints' AND column_name='resolution_text') THEN
        ALTER TABLE public.complaints ADD COLUMN resolution_text TEXT;
    END IF;
END $$;
