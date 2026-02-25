-- Audit Log Infrastructure for LSFCONNECT

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- e.g., 'update_role', 'deactivate_user', 'publish_course'
  target_id UUID, -- UUID of the affected user/course/etc
  target_type TEXT, -- 'user', 'course', 'subscription'
  details JSONB, -- Additional context
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Audit Logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" 
  ON audit_logs FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Function to record log (can be called via RPC or trigger)
CREATE OR REPLACE FUNCTION record_audit_log(
    p_action TEXT,
    p_target_id UUID,
    p_target_type TEXT,
    p_details JSONB DEFAULT '{}'::jsonb
) RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (admin_id, action, target_id, target_type, details)
    VALUES (auth.uid(), p_action, p_target_id, p_target_type, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
