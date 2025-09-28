# 🚀 Vercel Deployment Guide

## Prerequisites
1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **API Keys**: Get your OpenAI and Google AI API keys

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 2. Deploy on Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### 3. Configure Environment Variables

In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add these variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `GOOGLE_API_KEY`: Your Google AI API key

### 4. Test Your Deployment

Your app will be available at: `https://your-project-name.vercel.app`

## File Structure for Vercel

```
├── api/
│   ├── chat.py              # Serverless function
│   └── requirements.txt     # Python dependencies
├── index.html               # Frontend
├── styles.css              # Styles
├── script.js               # Frontend logic
├── vercel.json             # Vercel configuration
├── package.json            # Node.js configuration
└── .env                    # Environment variables (local only)
```

## Important Notes

- **API Keys**: Never commit `.env` file to GitHub
- **Serverless Functions**: The `/api/chat.py` runs as a serverless function
- **Static Files**: HTML, CSS, JS are served as static files
- **CORS**: Handled automatically by Vercel
- **Cold Starts**: First request might be slower due to serverless cold start

## Troubleshooting

### Common Issues:
1. **API Keys Not Working**: Check environment variables in Vercel dashboard
2. **CORS Errors**: Ensure you're using relative URLs (`/api/chat`)
3. **Cold Start Timeout**: Consider upgrading to Vercel Pro for longer timeouts
4. **Python Dependencies**: Check `api/requirements.txt` is correct

### Debugging:
- Check Vercel function logs in the dashboard
- Use `vercel logs` command for CLI debugging
- Test API endpoints directly: `https://your-app.vercel.app/api/health`

## Cost Considerations

- **Hobby Plan**: 100GB bandwidth, 100GB-hours function execution
- **Pro Plan**: 1TB bandwidth, 1000GB-hours function execution
- **Enterprise**: Custom limits

Your LLM Playground should work perfectly on Vercel! 🎉
