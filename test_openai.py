#!/usr/bin/env python3
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Clear proxy environment variables
proxy_vars = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'NO_PROXY', 'no_proxy']
for var in proxy_vars:
    if var in os.environ:
        print(f"Removing {var}: {os.environ[var]}")
        del os.environ[var]

# Test OpenAI initialization
try:
    import openai
    print(f"OpenAI version: {openai.__version__}")
    
    api_key = os.getenv('OPENAI_API_KEY')
    if api_key and api_key != 'your_openai_api_key_here':
        openai.api_key = api_key
        print("OpenAI client initialized successfully")
        
        # Test a simple API call
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=10
        )
        print("API call successful!")
        print(f"Response: {response.choices[0].message.content}")
    else:
        print("No valid API key found")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
