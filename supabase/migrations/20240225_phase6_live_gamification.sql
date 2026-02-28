-- Phase 6: Live Virtual Classes & Gamification

-- 1. LIVE SESSIONS table
CREATE TABLE IF NOT EXISTS live_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 60,
    instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    meeting_id TEXT NOT NULL UNIQUE, -- Jitsi Room Name
    status TEXT CHECK (status IN ('scheduled', 'live', 'ended')) DEFAULT 'scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. GAMIFICATION: BADGES
CREATE TABLE IF NOT EXISTS badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_type TEXT NOT NULL, -- e.g., 'Trophy', 'Star', 'Flame'
    criteria_type TEXT NOT NULL, -- e.g., 'course_completed', 'quiz_perfect', 'login_streak'
    criteria_value INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER_BADGES (Junction table)
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- 4. PROFILES: Points for Leaderboard
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INT DEFAULT 0;

-- 5. RLS POLICIES
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Live sessions viewable by all" ON live_sessions FOR SELECT USING (true);
CREATE POLICY "Admins/Experts can manage live sessions" ON live_sessions USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'expert'))
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are public" ON badges FOR SELECT USING (true);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User badges viewable by all" ON user_badges FOR SELECT USING (true);

-- Seed some initial badges
INSERT INTO badges (name, description, icon_type, criteria_type) VALUES
('Pionnier LSF', 'Première connexion à la plateforme.', 'Sparkles', 'login'),
('Étudiant Assidu', 'Complétez votre premier cours.', 'GraduationCap', 'course_completed'),
('Expert Judiciaire', 'Validez une étude de cas judiciaire.', 'Gavel', 'case_study_completed')
ON CONFLICT DO NOTHING;
