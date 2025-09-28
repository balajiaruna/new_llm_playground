from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        response = {'message': 'API is working!', 'status': 'success'}
        self.wfile.write(json.dumps(response).encode())
    
    def do_POST(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        
        response = {'message': 'POST request received!', 'status': 'success'}
        self.wfile.write(json.dumps(response).encode())
