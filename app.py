from flask import Flask, render_template, request, send_from_directory
import pyttsx3
import fitz  # PyMuPDF
import os
import datetime # Added for the cache-busting function

app = Flask(__name__)

# Ensure output directory for static files and uploads
os.makedirs("static", exist_ok=True)
os.makedirs("uploads", exist_ok=True)

@app.context_processor
def inject_now():
    """Makes 'now()' available to all templates for cache-busting."""
    return {'now': datetime.datetime.now().timestamp}

def pdf_to_text(pdf_path):
    """Extracts text from a PDF using PyMuPDF."""
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None
    return text

def convert_to_audio(text, voice_choice="male", rate=150):
    """Converts text to speech and saves as static/audio.mp3"""
    try:
        engine = pyttsx3.init()
        voices = engine.getProperty("voices")

        # Choose voice
        if voice_choice == "female" and len(voices) > 1:
            engine.setProperty("voice", voices[1].id)
        else:
            engine.setProperty("voice", voices[0].id)

        # Speaking rate
        engine.setProperty("rate", int(rate))

        # Save audio
        audio_path = "static/audio.mp3"
        engine.save_to_file(text, audio_path)
        engine.runAndWait()
        return audio_path
    except Exception as e:
        print(f"Error converting to audio: {e}")
        return None

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        file = request.files.get("pdf_file")
        if not file or not file.filename.endswith(".pdf"):
            return render_template("index.html", error="Please upload a valid PDF file.")

        # Save uploaded file
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)

        voice_choice = request.form.get("voice")
        rate = request.form.get("rate")

        # Process the file
        text = pdf_to_text(file_path)
        if text is None:
            return render_template("index.html", error="Could not extract text from PDF.")
        
        audio_path = convert_to_audio(text, voice_choice, rate)
        if audio_path is None:
            return render_template("index.html", error="Could not convert text to audio.")

        # Go to the result page
        return render_template("result.html")

    # Show the main upload page
    return render_template("index.html")

@app.route("/download")
def download_audio():
    """Allows user to download the generated MP3"""
    return send_from_directory("static", "audio.mp3", as_attachment=True, download_name="audiobook.mp3")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)