from flask import Flask, render_template, request, redirect, url_for
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here'  # Change this in production

# Supabase setup
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/')
def index():
    # Fetch all posts from Supabase
    response = supabase.table('posts').select('*').execute()
    posts = response.data
    return render_template('index.html', posts=posts)

@app.route('/upload', methods=['POST'])
def upload():
    title = request.form['title']
    description = request.form['description']
    photo = request.files['photo']

    if photo:
        # Upload photo to Supabase Storage
        file_name = photo.filename
        file_data = photo.read()
        supabase.storage.from_('photos').upload(file_name, file_data)

        # Get public URL
        photo_url = supabase.storage.from_('photos').get_public_url(file_name)

        # Insert post into database
        supabase.table('posts').insert({
            'title': title,
            'description': description,
            'photo_url': photo_url
        }).execute()

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
