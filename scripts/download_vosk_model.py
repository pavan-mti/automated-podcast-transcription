import os
import urllib.request
import zipfile
import shutil

MODEL_URL = "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip"
MODEL_ZIP = "vosk-model-small-en-us-0.15.zip"
MODEL_DIR = "models"
EXTRACTED_FOLDER = "vosk-model-small-en-us-0.15"

def download_and_setup_model():
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
        
    final_model_path = os.path.join(MODEL_DIR, "vosk-model-small-en-us-0.15")
    if os.path.exists(final_model_path):
        print("Vosk model already exists.")
        return

    print("Downloading Vosk model (this may take a moment)...")
    zip_path = os.path.join(MODEL_DIR, MODEL_ZIP)
    
    # Download
    urllib.request.urlretrieve(MODEL_URL, zip_path)
    print("Download complete. Extracting...")
    
    # Extract
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(MODEL_DIR)
        
    # Cleanup zip
    os.remove(zip_path)
    print(f"Model ready at: {final_model_path}")

if __name__ == "__main__":
    download_and_setup_model()
