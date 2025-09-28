import json
import os

def handler(request):
    """Health check endpoint"""
    
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
    
    # Check which clients are available
    available_clients = []
    
    if os.getenv('OPENAI_API_KEY') and os.getenv('OPENAI_API_KEY') != 'your_openai_api_key_here':
        available_clients.append('openai')
    
    if os.getenv('GOOGLE_API_KEY') and os.getenv('GOOGLE_API_KEY') != 'your_google_api_key_here':
        available_clients.append('google')
    
    health_data = {
        'status': 'healthy',
        'available_clients': available_clients
    }
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(health_data)
    }
