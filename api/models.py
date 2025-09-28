import json

def handler(request):
    """Get available models"""
    
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
    
    models_data = {
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
    }
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(models_data)
    }
