-- Phase 7: Referral System

-- 1. Add referral_code to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- 2. Function to generate random referral code
CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger to auto-generate referral code for new profiles
CREATE OR REPLACE FUNCTION set_referral_code() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_set_referral_code') THEN
    CREATE TRIGGER tr_set_referral_code
    BEFORE INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION set_referral_code();
  END IF;
END $$;

-- 4. REFERRALS table
CREATE TABLE IF NOT EXISTS referrals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reward_awarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(referred_id) -- A user can only be referred once
);

-- 5. RLS POLICIES
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own referrals" ON referrals FOR SELECT USING (
  auth.uid() = referrer_id OR auth.uid() = referred_id
);

-- Backfill existing profiles with referral codes
UPDATE profiles SET referral_code = generate_referral_code() WHERE referral_code IS NULL;
