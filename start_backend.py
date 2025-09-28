#!/usr/bin/env python3
"""
Startup script for the LLM Playground backend
"""
import subprocess
import sys
import os
from pathlib import Path

def check_requirements():
    """Check if required packages are installed"""
    try:
        import flask
        import flask_cors
        import openai
        import google.generativeai
        import dotenv
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def check_env_file():
    """Check if .env file exists and has API keys"""
    env_path = Path('.env')
    if not env_path.exists():
        print("❌ .env file not found")
        return False
    
    with open(env_path, 'r') as f:
        content = f.read()
        
    if 'your_openai_api_key_here' in content or 'your_google_api_key_here' in content:
        print("⚠️  Please update your API keys in the .env file")
        print("   - Replace 'your_openai_api_key_here' with your actual OpenAI API key")
        print("   - Replace 'your_google_api_key_here' with your actual Google AI API key")
        return False
    
    print("✅ .env file found with API keys")
    return True

def main():
    print("🚀 Starting LLM Playground Backend...")
    print("=" * 50)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Check .env file
    if not check_env_file():
        print("\n📝 To get your API keys:")
        print("   - OpenAI: https://platform.openai.com/api-keys")
        print("   - Google AI: https://aistudio.google.com/app/apikey")
        sys.exit(1)
    
    print("\n🌐 Starting Flask server on http://localhost:5000")
    print("📱 Frontend will be available on http://localhost:8080")
    print("🛑 Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start the Flask app
    try:
        subprocess.run([sys.executable, 'app.py'], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
