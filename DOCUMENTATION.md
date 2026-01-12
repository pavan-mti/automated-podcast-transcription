# Automated Podcast Transcription & Topic Segmentation
An AI-powered system that automatically transcribes podcast audio and performs topic-based segmentation using advanced speech recognition and natural language processing techniques.
## Abstract
This project is an advanced audio analysis pipeline designed to transform unstructured podcast audio into structured, searchable, and navigable knowledge. By combining offline Speech-to-Text (ASR) with Natural Language Processing (NLP), the system segments long audio files into topic-based chunks, generating coherent summaries and semantic keywords for each section. This allows users to consume podcast content non-linearly and discover relevant information efficiently.

## Problem Statement
Podcasts are a valuable source of information, but their linear audio format makes them opaque to search engines and difficult for listeners to navigate. Finding a specific topic within an hour-long episode requires tedious manual scrubbing. Existing solutions often lack granular segmentation or provide low-quality, extractive summaries that fail to capture the essence of the conversation.

## Objectives
*   **Automate Transcription**: Convert audio to text with high accuracy using offline privacy-first models.
*   **Topic Segmentation**: Automatically detect topic shifts to break episodes into logical chapters.
*   **Semantic Enrichment**: Generate high-quality abstractive summaries and relevant keywords for each chapter using state-of-the-art Transformers (BART, KeyBERT).
*   **User Navigation**: Provide a structured data format that enables precise timestamp-based navigation.

## Approach / Architecture
The system operates as a sequential pipeline:
1.  **Audio Ingestion**: Accepts standard audio formats (MP3, WAV).
2.  **Preprocessing**: Normalizes volume and applies noise reduction to improve ASR performance.
3.  **Transcription**: valid timestamps are generated using **Vosk** (Kaldi-based ASR).
4.  **Segmentation**: **TextTiling** analyzes the transcript to find lexical shifts representing topic boundaries.
5.  **Summarization & Keyword Extraction**:
    *   **BART-Large-CNN-SAMSum**: Summarizes conversational text, robust to short/fragmented inputs.
    *   **KeyBERT**: Extracts semantic keywords using BERT embeddings.
6.  **Storage & serving**: Results are stored in JSON/MongoDB and served via a Node.js API to a React frontend.

## Features
*   **Offline Privacy**: All processing allows for local execution without sending audio to third-party clouds.
*   **Intelligent Summarization**: Context-aware summaries that handle dialogue interruptions and filler words.
*   **Robustness**: Fallback mechanisms for short segments to prevent hallucinations.
*   **Keyword Navigation**: Jump to specific parts of the audio based on keyword relevance.
*   **JSON Export**: Structured output ready for integration with other platforms.

## Tech Stack
*   **Frontend**: React.js
*   **Backend**: Node.js (Express)
*   **Core Processing (Python)**:
    *   **ASR**: `vosk`
    *   **NLP Models**: `transformers` (Hugging Face), `keybert`, `sentence-transformers`
    *   **Audio**: `librosa`, `soundfile`, `noisereduce`
    *   **Logic**: `nltk`, `scikit-learn`, `numpy`
*   **Database**: MongoDB

## System Requirements
*   **OS**: Windows, Linux, or macOS
*   **Runtime**: Python 3.9+ and Node.js v18+
*   **Hardware**:
    *   **RAM**: Minimum 8GB (16GB recommended) for running BART and BERT models comfortably.
    *   **Storage**: ~3GB for model weights (Vosk + BART + KeyBERT).
    *   **CPU**: Multi-core processor recommended for faster transcription.

## Installation & Setup
1.  **Clone Repository**:
    ```bash
    git clone -b intern-pavan https://github.com/springboardmentor13579x-proj/Automated-Podcast-Transcription-and-Topic-Segmentation.git
    ```
2.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    ```
3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    ```
4.  **Python Environment**:
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    ```
5.  **Model Availability**:
    Ensure the Vosk model is downloaded to `models/` and Hugging Face models will allow auto-download on first run.

## Usage / API Documentation
![Architecture Diagram](images/LandingPage.jpeg)

### Running the Pipeline
You can run the processing stages manually via the provided Python scripts:
1.  **Transcribe**: `python -m src.transcription.batch_transcriber`
2.  **Segment**: `python -m src.segmentation.batch_segmenter`
3.  **Summarize & Extract**: `python -m src.segmentation.batch_keyword_summarizer`

### API Endpoints (Backend)
*   `POST /upload`: Upload audio file for processing.
*   `GET /podcasts`: List all processed podcasts.
*   `GET /podcasts/:id`: Get detailed segments and metadata for a specific podcast.

## Project Structure
```
automated-podcast-transcription/
├── backend/                # API Server
├── frontend/               # User Interface
├── data/                   # File storage
│   └── segments/           # Intermediate JSON segments
├── database/               # Final processed output
├── models/                 # Local ML models
├── src/                    # Core Python Logic
│   ├── preprocessing/      # Audio normalization/cleaning
│   ├── transcription/      # Vosk wrapper
│   ├── segmentation/       # TextTiling, BART, KeyBERT logic
│   └── utils/              # Helper functions
└── requirements.txt        # Python dependencies
```

## Testing
*   **Unit Tests**: Located in `tests/` directory.
*   **Verification Scripts**:
    *   `reproduce_issue.py`: Verifies model behavior on specific problematic segments.
    *   `verify_fix.py`: Checks robustness of summarization fixes.

## Results / Sample Output
**Input Audio Segment**:
> *"were and the opportunities for work and career that lay in front of you..."*

**Processed JSON Output**:
```json
{
  "segment_id": 0,
  "text": "were and the opportunities for work...",
  "summary": "Not many people had a clear idea of what they wanted to do for their career.",
  "keywords": ["career", "work", "opportunities"],
  "start_time": 12.5,
  "end_time": 45.2
}
```

## Limitations
*   **Processing Speeds**: Offline transcription and summarization is slower than real-time cloud APIs.
*   **Accents**: Vosk model accuracy varies with heavy accents or poor audio quality.
*   **Memory Intensity**: Large transformer models (BART) are memory-heavy.

## Troubleshooting
*   **Issue**: `ModuleNotFoundError: No module named 'src'`
    *   **Fix**: Run scripts from the root using `python -m src.path.to.script`.
*   **Issue**: Summaries are just "." or empty.
    *   **Fix**: The system now has a safeguard to return original text for failed summaries. Check valid input text length.
*   **Issue**: High Memory Usage / OOM.
    *   **Fix**: Close other heavy applications or switch to a smaller summarization model in `src/segmentation/summarizer.py`.
*   **Issue**: Required library or module not found.
    *   **Fix**: Ensure the project runs inside the `.venv` virtual environment. Create it using `python -m venv .venv` if it doesn’t exist, activate it (`.venv\Scripts\activate` on Windows or `source .venv/bin/activate` on Linux/macOS), and verify that the selected Python interpreter in your IDE points to the `.venv` directory before running the project.

## Future Enhancements
*   **Speaker Diarization**: Distinguish between multiple speakers in the transcript.
*   **Cloud Integration**: Optional AWS/GCP connection for faster processing.
*   **Vector Search**: Implement RAG (Retrieval-Augmented Generation) for "Chat with Podcast" functionality.
*   **Real-time Processing**: Stream audio for live transcription and segmentation.
