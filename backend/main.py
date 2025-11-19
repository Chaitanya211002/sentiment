from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS configuration - allows frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranscriptRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: float  # -1.0 to 1.0
    sentiment_label: str  # "positive", "negative", "neutral"
    keywords: list[str]
    intensity: float  # 0.0 to 1.0 (how strong the emotion is)

@app.post("/process_text", response_model=SentimentResponse)
async def process_text(request: TranscriptRequest):
    try:
        # Call OpenAI API for sentiment analysis
        response = await analyze_sentiment(request.text)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def analyze_sentiment(text: str) -> SentimentResponse:
    """
    Uses OpenAI to extract sentiment and keywords from text
    """
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    prompt = f"""Analyze the following text and provide:
1. Sentiment score (-1.0 for very negative, 0 for neutral, 1.0 for very positive)
2. Sentiment label (positive/negative/neutral)
3. Up to 5 key topics or keywords
4. Intensity (0.0-1.0, how emotionally charged the text is)

Text: "{text}"

Respond ONLY with valid JSON in this exact format:
{{
  "sentiment": 0.5,
  "sentiment_label": "positive",
  "keywords": ["keyword1", "keyword2"],
  "intensity": 0.7
}}"""

    completion = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        response_format={"type": "json_object"}
    )
    
    import json
    result = json.loads(completion.choices[0].message.content)
    
    return SentimentResponse(**result)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)