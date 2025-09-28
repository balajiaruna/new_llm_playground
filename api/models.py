from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        """Get available models"""
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
        
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(models_data).encode())