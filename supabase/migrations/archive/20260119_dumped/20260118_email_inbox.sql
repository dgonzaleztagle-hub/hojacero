-- Create table for storing incoming emails
CREATE TABLE IF NOT EXISTS email_inbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT,
    body_text TEXT,
    body_html TEXT,
    raw_headers JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE email_inbox ENABLE ROW LEVEL SECURITY;

-- Allow Dashboard users (authenticated) to view and manage emails
CREATE POLICY "Users can view inbox" ON email_inbox
    FOR SELECT TO authenticated
    USING (true); -- Or filter by role if needed

CREATE POLICY "Users can update inbox" ON email_inbox
    FOR UPDATE TO authenticated
    USING (true);

-- Allow Service Role (Cloudflare Worker) to insert emails
-- (Service role bypasses RLS, so this is implicit, but good to note)
