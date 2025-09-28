import json
import os
import logging
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

def handler(request):
    """Vercel serverless function handler"""
    
    # Set CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }
    
    # Handle preflight requests
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }
    
    try:
        # Parse request body
        if hasattr(request, 'get_json'):
            data = request.get_json()
        else:
            # For Vercel, parse the body manually
            body = request.get('body', '{}')
            if isinstance(body, str):
                data = json.loads(body)
            else:
                data = body
        
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
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Message is required'})
            }
        
        # Call appropriate API
        if provider == 'openai':
            response_text = call_openai(model, message, system_prompt, temperature, max_tokens, top_p, seed)
        elif provider == 'google':
            response_text = call_google_ai(model, message, system_prompt, temperature, max_tokens, top_p, seed)
        else:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': f'Unsupported provider: {provider}'})
            }
        
        # Return response
        response_data = {
            'response': response_text,
            'model': model,
            'provider': provider,
            'usage': {
                'temperature': temperature,
                'max_tokens': max_tokens,
                'top_p': top_p
            }
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response_data)
        }
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': f'Internal server error: {str(e)}'})
        }