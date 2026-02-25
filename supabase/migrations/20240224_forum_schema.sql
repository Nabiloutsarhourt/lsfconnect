-- Forum Schema for LSFCONNECT

-- Categories
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Threads
CREATE TABLE IF NOT EXISTS forum_threads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  views INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts (Replies)
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_solution BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forum categories are public" ON forum_categories FOR SELECT USING (true);
CREATE POLICY "Forum threads are viewable by everyone" ON forum_threads FOR SELECT USING (true);
CREATE POLICY "Forum posts are viewable by everyone" ON forum_posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create threads" ON forum_threads FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own threads" ON forum_threads FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON forum_posts FOR UPDATE USING (auth.uid() = author_id);

-- Seed Categories
INSERT INTO forum_categories (title, description, slug, icon, order_index) VALUES
('Linguistique LSF', 'Discussions générales sur la structure et l\'évolution de la LSF.', 'linguistique', 'Hand', 1),
('Domaine Judiciaire', 'Partagez vos expériences et posez des questions sur l\'interprétation juridique.', 'judiciaire', 'Gavel', 2),
('Domaine Médical', 'Vocabulaire spécifique et situations courantes en milieu hospitalier.', 'medical', 'Stethoscope', 3),
('Domaine Social', 'Intervention en milieu scolaire, associatif et familial.', 'social', 'Users', 4),
('Entraide Étudiants', 'Besoin d\'aide pour un exercice ou un cours ? C\'est ici !', 'entraide', 'GraduationCap', 5);
