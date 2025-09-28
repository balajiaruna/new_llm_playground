from flask import Flask, request, jsonify
import os
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Initialize clients
clients = {}

def initialize_clients():
    """Initialize API clients with keys from environment variables"""
    global clients
    
    # Clear proxy environment variables that might interfere
    proxy_vars = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'NO_PROXY', 'no_proxy']
    for var in proxy_vars:
        if var in os.environ:
            del os.environ[var]
    
    # OpenAI client
    openai_api_key = os.getenv('OPENAI_API_KEY')
    if openai_api_key and openai_api_key != 'your_openai_api_key_here':
        import openai
        openai.api_key = openai_api_key
        clients['openai'] = openai
        logger.info("OpenAI client initialized")
    else:
        logger.warning("OpenAI API key not found or not configured")
    
    # Google AI client
    google_api_key = os.getenv('GOOGLE_API_KEY')
    if google_api_key and google_api_key != 'your_google_api_key_here':
        genai.configure(api_key=google_api_key)
        clients['google'] = genai
        logger.info("Google AI client initialized")
    else:
        logger.warning("Google AI API key not found or not configured")
    
    return clients

def call_openai(model, message, system_prompt, temperature, max_tokens, top_p, seed):
    """Call OpenAI API"""
    if 'openai' not in clients:
        raise Exception("OpenAI client not initialized. Please check your API key.")
    
    try:
        messages = []
        
        # Add system prompt if provided
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        # Add user message
        messages.append({"role": "user", "content": message})
        
        # Prepare parameters
        params = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "top_p": top_p
        }
        
        # Add seed if provided
        if seed:
            params["seed"] = int(seed)
        
        # Make API call using legacy format
        response = clients['openai'].ChatCompletion.create(**params)
        return response.choices[0].message.content
        
    except Exception as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise Exception(f"OpenAI API error: {str(e)}")

def call_google_ai(model, message, system_prompt, temperature, max_tokens, top_p, seed):
    """Call Google AI API"""
    if 'google' not in clients:
        raise Exception("Google AI client not initialized. Please check your API key.")
    
    try:
        # Get the model
        genai_model = genai.GenerativeModel(model)
        
        # Prepare the prompt
        full_prompt = message
        if system_prompt:
            full_prompt = f"System: {system_prompt}\n\nUser: {message}"
        
        # Make API call - use the same simple approach that worked in debug
        response = genai_model.generate_content(full_prompt)
        
        # Handle response safely - the Google AI API response.text works perfectly
        try:
            # Check if response was blocked by safety filters
            if hasattr(response, 'candidates') and response.candidates and len(response.candidates) > 0:
                candidate = response.candidates[0]
                if hasattr(candidate, 'finish_reason'):
                    if candidate.finish_reason == 'SAFETY':
                        return "I'm sorry, but I can't provide a response to that request due to safety guidelines."
                    elif candidate.finish_reason == 'RECITATION':
                        return "I'm sorry, but I can't provide a response to that request due to content policy restrictions."
            
            # Use the direct text property - this works perfectly
            if response and hasattr(response, 'text') and response.text:
                return response.text
            
            # Fallback to candidates if text is not available
            if hasattr(response, 'candidates') and response.candidates and len(response.candidates) > 0:
                candidate = response.candidates[0]
                if hasattr(candidate, 'content') and candidate.content:
                    if hasattr(candidate.content, 'parts') and candidate.content.parts and len(candidate.content.parts) > 0:
                        part = candidate.content.parts[0]
                        if hasattr(part, 'text') and part.text:
                            return part.text
            
            return "Sorry, I couldn't generate a response. Please try again."
            
        except Exception as e:
            logger.error(f"Error accessing response content: {e}")
            return "Sorry, I encountered an error processing the response. Please try again."
        
    except Exception as e:
        logger.error(f"Google AI API error: {str(e)}")
        raise Exception(f"Google AI API error: {str(e)}")

# Initialize clients
initialize_clients()

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests"""
    try:
        data = request.get_json()
        
        # Extract parameters
        provider = data.get('provider', 'openai')
        model = data.get('model', 'gpt-3.5-turbo')
        message = data.get('message', '')
        system_prompt = data.get('system_prompt', '')
        temperature = float(data.get('temperature', 0.7))
        max_tokens = int(data.get('max_tokens', 1000))
        top_p = float(data.get('top_p', 1.0))
        seed = data.get('seed')
        
        # Validate required fields
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Call appropriate API
        if provider == 'openai':
            response_text = call_openai(model, message, system_prompt, temperature, max_tokens, top_p, seed)
        elif provider == 'google':
            response_text = call_google_ai(model, message, system_prompt, temperature, max_tokens, top_p, seed)
        else:
            return jsonify({'error': f'Unsupported provider: {provider}'}), 400
        
        # Return response
        return jsonify({
            'response': response_text,
            'model': model,
            'provider': provider,
            'usage': {
                'temperature': temperature,
                'max_tokens': max_tokens,
                'top_p': top_p
            }
        })
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get available models"""
    return jsonify({
        'openai': [
            {'value': 'gpt-4o', 'text': 'GPT-4o'},
            {'value': 'gpt-4o-mini', 'text': 'GPT-4o Mini'},
            {'value': 'gpt-4-turbo', 'text': 'GPT-4 Turbo'},
            {'value': 'gpt-4', 'text': 'GPT-4'},
            {'value': 'gpt-3.5-turbo', 'text': 'GPT-3.5 Turbo'}
        ],
        'google': [
            {'value': 'gemini-2.5-flash', 'text': 'Gemini 2.5 Flash'},
            {'value': 'gemini-2.0-flash', 'text': 'Gemini 2.0 Flash'},
            {'value': 'gemini-flash-latest', 'text': 'Gemini Flash Latest'},
            {'value': 'gemini-pro-latest', 'text': 'Gemini Pro Latest'}
        ]
    })

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'available_clients': list(clients.keys())
    })

if __name__ == '__main__':
    app.run(debug=True)
