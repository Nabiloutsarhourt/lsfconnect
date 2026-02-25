-- Migration: Add Messages Table and Realtime Capabilities

-- 1. Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can see messages they sent or received" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id
);

CREATE POLICY "Users can mark messages as read" ON messages FOR UPDATE USING (
  auth.uid() = receiver_id
);

-- 4. Enable Realtime for the messages table
-- Note: In a real Supabase environment, this is usually done via the UI or by adding to- supabase_realtime publication
-- For SQL purposes:
-- ALTER PUBLICATION supabase_realtime ADD TABLE messages;
