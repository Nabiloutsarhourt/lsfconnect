-- Migration: Add settings columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notification_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS student_mode BOOLEAN DEFAULT FALSE;
