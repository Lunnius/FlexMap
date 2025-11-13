# Flask Render App

A simple Flask application deployed on Render with shared data using Supabase.

## Setup

1. Create a Supabase project at https://supabase.com
2. Create a table named `posts` with columns:
   - id (int, primary key, auto-increment)
   - title (text)
   - description (text)
   - photo_url (text)
3. Create a storage bucket named `photos`
4. Copy `.env.example` to `.env` and fill in your Supabase URL and anon key
5. Run locally: `pip install -r requirements.txt` then `python app.py`

## Deploy to Render

1. Create a GitHub repository and push this code
2. Go to Render.com and create a new Web Service
3. Connect your GitHub repo
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `gunicorn app:app`
6. Add environment variables: SUPABASE_URL and SUPABASE_KEY
7. Deploy

## Features

- Upload photos and descriptions
- View all shared posts
- Data persists across sessions and users
