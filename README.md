#  Automated Podcast Transcription & Topic Segmentation

**Automated Podcast Transcription & Topic Segmentation** is an audio analysis system that transforms long-form podcast audio into **structured, searchable, and navigable insights**.

The project focuses on making spoken content easier to **understand, explore, and reuse** by automatically identifying topics, summaries, keywords, and timestamps from raw audio.



## Overview

Podcasts contain valuable information, but their linear nature makes them difficult to browse.  
This project addresses that problem by converting audio into **organized knowledge units** that can be consumed programmatically or through a user interface.

At a high level, the system:
- Converts audio into text  
- Identifies topic boundaries  
- Generates summaries and keywords  
- Aligns insights with timestamps  
- Exposes the results through APIs  



## What This Project Does

- Transcribes podcast audio into readable text  
- Segments long transcripts into meaningful topic sections  
- Generates high-quality abstractive summaries (BART) for each topic  
- Extracts semantic keywords (KeyBERT) for search and filtering  
- Preserves timestamps to enable audio navigation  
- Stores processed data in a structured and reusable format  



## Use Cases

- Podcast platforms with chapter-based navigation  
- Audio content analysis and indexing  
- Educational or research-focused podcast exploration  
- AI-powered search over spoken content  
- Backend support for transcript-based user interfaces  




## System Architecture (High Level)

Podcast Audio Upload  
↓  
Backend Upload API (Node.js + Multer)  
↓  
Python Transcription Pipeline (Vosk ASR)  
↓  
Transcript Cleaning & Chunking  
↓  
Topic Segmentation (NLP)  
↓  
Segment Summarization (BART-Large-CNN) & Keyword Extraction (KeyBERT)  
↓  
Timestamp Alignment (Start–End per Segment)  
↓  
Structured JSON Generation  
↓  
MongoDB Storage (Podcasts & Segments)  
↓  
REST APIs (Fetch Podcasts, Segments, Search)  
↓  
Frontend Dashboard (React)  
↓  
Podcast Details View (Search & Keyword Filter)





## Output Format

Each podcast is converted into a structured representation containing:
- Topic-wise transcript segments  
- Summaries for quick understanding  
- Keywords for search and filtering  
- Start and end timestamps for each segment  

This structure makes the data suitable for:
- Frontend applications  
- Search engines  
- Further AI-based analysis  



## Backend Services

The project includes a backend service that:
- Stores podcast and segment data  
- Provides REST APIs for retrieval  
- Supports keyword-based and text-based filtering  
- Enables easy integration with user interfaces  










## Installation & Setup



- Node.js ≥ 18
- Python ≥ 3.9 (3.11.x Recommended)
- MongoDB (local or Atlas)
- FFmpeg (must be available in system PATH)


## Backend Setup
```bash
cd backend
npm install
npm run dev
```

## Python Pipeline Setup
```
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python scripts/download_vosk_model.py  # Download Vosk Model
```

## Frontend Setup
```
cd frontend
npm install
npm run dev
```
## Design Principles

- **Modular** – Each stage of processing is independent  
- **Scalable** – Designed to handle long-form audio content  
- **Extensible** – Easy to add new analysis or models  
- **UI-ready** – Output designed for direct frontend usage  

## Future Enhancements

- Interactive transcript viewer  
- Timestamp-based audio navigation  
- Semantic search over podcast content  
- AI-assisted question answering on podcasts  
- Cloud deployment and scaling  

## Acknowledgements

This project builds upon modern advancements in:
- Speech recognition  
- Natural language processing  
- Audio analytics  
- Backend API design  