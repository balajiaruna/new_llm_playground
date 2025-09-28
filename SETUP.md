# LLM Playground Setup Guide

This guide will help you set up the LLM Playground with real API integrations.

## Prerequisites

- Python 3.8 or higher
- Node.js (optional, for development)
- API keys for OpenAI and/or Google AI

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure API Keys

Edit the `.env` file and replace the placeholder values with your actual API keys:

```bash
# Get your API keys from:
# OpenAI: https://platform.openai.com/api-keys
# Google AI: https://aistudio.google.com/app/apikey

OPENAI_API_KEY=your_actual_openai_api_key_here
GOOGLE_API_KEY=your_actual_google_api_key_here
```

### 3. Start the Backend

```bash
python start_backend.py
```

This will:
- Check if all dependencies are installed
- Verify your API keys are configured
- Start the Flask backend server on port 5000

### 4. Start the Frontend

In a new terminal window:

```bash
python3 -m http.server 8080
```

### 5. Open the Application

Visit `http://localhost:8080` in your browser.

## Manual Setup

If you prefer to start services manually:

### Backend Only
```bash
python app.py
```

### Frontend Only
```bash
python3 -m http.server 8080
```

## API Endpoints

The backend provides the following endpoints:

- `POST /api/chat` - Main chat endpoint
- `GET /api/health` - Health check
- `GET /api/models` - Available models

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key | Optional |
| `GOOGLE_API_KEY` | Google AI API key | Optional |
| `PORT` | Backend port (default: 5000) | No |
| `FLASK_DEBUG` | Debug mode (default: False) | No |

### Model Parameters

The playground supports the following parameters:

- **Temperature**: Controls randomness (0.0 to 2.0)
- **Max Tokens**: Maximum response length
- **Top P**: Nucleus sampling parameter
- **Seed**: For reproducible responses
- **System Prompt**: Instructions for the AI

## Supported Models

### OpenAI
- GPT-4o
- GPT-4o Mini
- GPT-4 Turbo
- GPT-4
- GPT-3.5 Turbo

### Google AI
- Gemini 1.5 Pro
- Gemini 1.5 Flash
- Gemini Pro
- Gemini Pro Vision

## Troubleshooting

### Common Issues

1. **"Address already in use" error**
   - Stop any existing servers: `pkill -f "python.*http.server"`
   - Or use different ports

2. **API key errors**
   - Verify your API keys in the `.env` file
   - Check that the keys are valid and have sufficient credits

3. **CORS errors**
   - Make sure the backend is running on port 5000
   - Check browser console for specific error messages

4. **Module not found errors**
   - Run `pip install -r requirements.txt`
   - Make sure you're using the correct Python version

### Debug Mode

To run in debug mode:

```bash
FLASK_DEBUG=true python app.py
```

### Logs

Check the terminal where you started the backend for detailed error messages and API call logs.

## Development

### Project Structure

```
new_llm_playgroud/
├── app.py                 # Flask backend server
├── start_backend.py       # Startup script
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
├── index.html            # Frontend HTML
├── styles.css            # Frontend styles
├── script.js             # Frontend JavaScript
└── SETUP.md              # This file
```

### Adding New Models

To add support for new models:

1. Update the `modelOptions` in `script.js`
2. Add the model to the backend in `app.py`
3. Implement the API call logic in the appropriate function

## Security Notes

- Never commit your `.env` file to version control
- The `.gitignore` file is configured to exclude `.env`
- API keys are only used server-side for security

## Support

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Check the backend terminal for Python errors
3. Verify your API keys are correct and have credits
4. Ensure all dependencies are installed correctly
