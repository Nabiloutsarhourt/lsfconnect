-- Initial Schema for LSFCONNECT

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('client', 'expert', 'admin')) DEFAULT 'client',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXPERTS table (extended info)
CREATE TABLE IF NOT EXISTS experts (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT,
  specialties TEXT[], -- e.g., ['Medical', 'Legal', 'Social']
  hourly_rate NUMERIC(10, 2) DEFAULT 0.00,
  lsf_video_url TEXT, -- LSF presentation video
  certificate_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  availability JSONB DEFAULT '[]', -- Availability slots
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKINGS table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  expert_id UUID REFERENCES experts(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 60,
  type TEXT CHECK (type IN ('video', 'in_person')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  price NUMERIC(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REVIEWS table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  expert_id UUID REFERENCES experts(id) ON DELETE SET NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

-- Profiles: Users can view all profiles (to find experts) but only update their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Experts: Publicly viewable, only expert can update their own info
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Expert info is viewable by everyone" ON experts FOR SELECT USING (true);
CREATE POLICY "Experts can update own info" ON experts FOR UPDATE USING (auth.uid() = id);

-- Bookings: Users can see only their own bookings (as client or expert)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own bookings" ON bookings FOR SELECT USING (
  auth.uid() = client_id OR auth.uid() = expert_id
);
CREATE POLICY "Clients can create bookings" ON bookings FOR INSERT WITH CHECK (
  auth.uid() = client_id
);

-- Notifications: Users only see their own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own notifications" ON notifications FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (
  auth.uid() = user_id
);

-- TRIGGERS for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
