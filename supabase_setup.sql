-- Execute this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Create the posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users (or public if you want)
-- For simplicity, allowing public access (adjust as needed for security)
CREATE POLICY "Allow all operations for everyone" ON posts
FOR ALL USING (true);

-- Create the photos storage bucket (if not created via UI)
-- Note: You can create this via the Storage tab in Supabase Dashboard instead
-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);
