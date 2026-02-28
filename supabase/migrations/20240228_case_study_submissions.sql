-- Create case_study_submissions table
CREATE TABLE IF NOT EXISTS case_study_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    grade INTEGER CHECK (grade >= 0 AND grade <= 100),
    feedback TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'graded')),
    graded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE case_study_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can create submissions" 
ON case_study_submissions FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can view their own submissions" 
ON case_study_submissions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view and update all submissions" 
ON case_study_submissions FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);
