# Sentiment Aura - Real-Time AI-Powered Sentiment Analysis

A full-stack web application that performs real-time audio transcription and visualizes emotional sentiment through an interactive interface.

---

## Quick Start Guide

### Prerequisites

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **Python** (v3.9+) - [Download](https://www.python.org/)
- **OpenAI API Key** - [Get Key](https://platform.openai.com/api-keys)
- **Deepgram API Key** - [Get Key](https://console.deepgram.com/signup) (Includes $200 free credits)

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/sentiment-aura.git
cd sentiment-aura
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pydantic python-dotenv openai

# Create .env file
# Add your OpenAI API key
echo OPENAI_API_KEY=your_openai_api_key_here > .env
echo DEEPGRAM_API_KEY=your_deepgram_api_key_here > .env

# Start backend server
python main.py
```

Backend will run on `http://localhost:8000`

### 3. Frontend Setup
```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
# Add your API keys
echo REACT_APP_BACKEND_URL=http://localhost:8000 > .env
echo REACT_APP_DEEPGRAM_API_KEY=your_deepgram_api_key_here >> .env

# Start frontend
npm start
```

Frontend will open at `http://localhost:3000`

---

## Usage

1. Click **"Start Recording"** button
2. Allow microphone access when prompted
3. Speak into your microphone
4. Watch the transcript and sentiment analysis appear in real-time!

---
## Tech Stack

- **Frontend:** React, Axios, Web Audio API
- **Backend:** FastAPI (Python)
- **APIs:** Deepgram (transcription), OpenAI (sentiment analysis)

---

## Author

**Chaitanya Patil**  
Northeastern University  
Computer Science Graduate Student

---
