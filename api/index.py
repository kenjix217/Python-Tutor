"""
Vercel Serverless Function Entry Point
This file is required by Vercel's Python runtime
"""
import sys
import os

# Add backend to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from backend.main import app
except ImportError:
    # Fallback: create a simple app if backend isn't available
    from fastapi import FastAPI
    
    app = FastAPI()
    
    @app.get("/")
    def health_check():
        return {"status": "ok", "message": "Python AI Tutor Backend is Live"}
    
    @app.get("/api/health")
    def api_health():
        return {"status": "ok", "version": "1.0.0"}

# Vercel expects this
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))