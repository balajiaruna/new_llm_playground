# LLM Playground

A streamlined, modern interface for interacting with Large Language Models. This playground provides an intuitive ChatGPT-like experience with comprehensive model parameter controls and a responsive design.

## ✨ Features

### 🎨 **Modern Interface**
- Clean, dark-themed design similar to ChatGPT
- Responsive sidebar with collapsible navigation
- Smooth animations and transitions
- Mobile-friendly responsive design

### 🎛️ **Model Parameter Controls**
- **Model Selection**: Choose between GPT-4, GPT-3.5 Turbo, Claude 3, or Local models
- **Temperature Control**: Adjust creativity/randomness (0.0 - 2.0)
- **Max Tokens**: Set response length limit (1 - 4000)
- **Top P**: Control nucleus sampling (0.0 - 1.0)
- Real-time parameter display in header

### 💬 **Chat Features**
- Real-time conversation with typing indicators
- Message formatting with basic markdown support
- Auto-resizing text input with character count
- Example prompts for quick start
- Chat history with persistent storage

### 🎤 **Advanced Functionality**
- **Voice Input**: Speech-to-text functionality
- **File Attachment**: Ready for file upload integration
- **Export/Share**: Share conversations via native sharing or clipboard
- **Keyboard Shortcuts**: Quick navigation and actions

### 📱 **Responsive Design**
- Mobile-optimized sidebar navigation
- Touch-friendly interface elements
- Adaptive layout for all screen sizes
- Optimized typography and spacing

## 🚀 Quick Start

1. **Open the Application**
   ```bash
   # Simply open index.html in your web browser
   open index.html
   ```

2. **Start Chatting**
   - Type your message in the input area
   - Press Enter or click the send button
   - Try the example prompts for inspiration

3. **Adjust Model Parameters**
   - Use the sidebar controls to adjust temperature, max tokens, etc.
   - Changes are applied immediately and saved automatically
   - Parameters are displayed in the header for reference

## 🎛️ Model Parameters Guide

### **Temperature** (0.0 - 2.0)
- **0.0**: Deterministic, focused responses
- **0.7**: Balanced creativity and coherence (recommended)
- **1.5+**: More creative and unpredictable responses

### **Max Tokens** (1 - 4000)
- Controls the maximum length of AI responses
- Higher values allow for longer, more detailed responses
- Consider API costs when setting high values

### **Top P** (0.0 - 1.0)
- **0.1**: Very focused, uses only most likely words
- **1.0**: Uses full vocabulary (default)
- Lower values make responses more focused and consistent

## ⌨️ Keyboard Shortcuts

- `Enter`: Send message
- `Shift + Enter`: New line in message
- `Ctrl/Cmd + K`: Start new chat
- `Escape`: Close sidebar / Focus input

## 📱 Mobile Usage

- Tap the hamburger menu (☰) to open/close sidebar
- Swipe or tap overlay to close sidebar
- All controls are touch-optimized
- Voice input available on supported devices

## 🔧 Customization

### **Adding Real LLM Integration**

To connect to actual LLM APIs, modify the `generateMockResponse` method in `script.js`:

```javascript
async generateAIResponse(userMessage) {
    // Replace mock response with actual API call
    const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: this.modelParams.model,
            messages: [{ role: 'user', content: userMessage }],
            temperature: this.modelParams.temperature,
            max_tokens: this.modelParams.maxTokens,
            top_p: this.modelParams.topP
        })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
}
```

### **Styling Customization**

Edit `styles.css` to customize:
- Color scheme and themes
- Layout and spacing
- Animations and transitions
- Typography and fonts

### **Adding New Features**

The modular JavaScript structure makes it easy to add:
- New model providers
- Additional parameter controls
- Custom message formatting
- Integration with external services

## 🗂️ File Structure

```
llm-playground/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # Full application logic and functionality
└── README.md           # This documentation
```

## 🌟 Key Features Breakdown

### **Sidebar Controls**
- Model selection dropdown
- Interactive parameter sliders with real-time values
- Chat history with clickable items
- API status indicator
- Quick action buttons

### **Main Interface**
- Welcome screen with example prompts
- Chat area with formatted messages
- Smart input area with auto-resize
- Character count and model info display

### **Responsive Behavior**
- Sidebar collapses on mobile devices
- Touch-friendly button sizes
- Optimized text sizes for readability
- Smooth transitions between layouts

## 🔒 Privacy & Storage

- **Local Storage**: Chat history and settings stored locally
- **No Server Required**: Runs entirely in the browser
- **Privacy First**: No data sent to external servers (in demo mode)

## 🛠️ Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Voice Input**: Requires Web Speech API support
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet

## 🚀 Performance

- **Lightweight**: Minimal dependencies, fast loading
- **Efficient**: Optimized DOM manipulation and event handling
- **Smooth**: Hardware-accelerated animations and transitions

## 📈 Future Enhancements

- [ ] File upload and processing
- [ ] Multiple conversation tabs
- [ ] Custom model presets
- [ ] Conversation search and filtering
- [ ] Export to various formats
- [ ] Plugin system for extensions

## 🤝 Contributing

Feel free to:
- Report bugs or issues
- Suggest new features
- Submit improvements
- Add new model integrations

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy your streamlined LLM experience!** 🚀

*Built with modern web technologies for optimal performance and user experience.*
