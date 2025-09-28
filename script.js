class LLMPlayground {
    constructor() {
        this.messagesData = [];
        this.isTyping = false;
        this.currentChatId = null;
        this.chatHistory = [];
        this.modelParams = {
            provider: 'openai',
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 1000,
            topP: 1.0,
            seed: null,
            systemPrompt: '',
            apiKey: ''
        };
        
        this.initializeElements();
        this.bindEvents();
        this.loadChatHistory();
        this.loadSettings();
        this.updateModelDisplay();
    }

    initializeElements() {
        // Header elements
        this.newChatBtn = document.getElementById('newChatBtn');

        // Right pane elements
        this.rightPane = document.getElementById('rightPane');
        this.rightPaneToggle = document.getElementById('rightPaneToggle');
        this.providerSelect = document.getElementById('providerSelect');
        this.modelSelect = document.getElementById('modelSelect');
        this.temperatureSlider = document.getElementById('temperatureSlider');
        this.maxTokensSlider = document.getElementById('maxTokensSlider');
        this.topPSlider = document.getElementById('topPSlider');
        this.tempValue = document.getElementById('tempValue');
        this.tokensValue = document.getElementById('tokensValue');
        this.topPValue = document.getElementById('topPValue');
        this.seedInput = document.getElementById('seedInput');
        this.randomSeedBtn = document.getElementById('randomSeedBtn');
        this.systemPrompt = document.getElementById('systemPrompt');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.saveSettingsBtn = document.getElementById('saveSettingsBtn');
        this.resetSettingsBtn = document.getElementById('resetSettingsBtn');

        // Main content elements
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.chatContainer = document.getElementById('chatContainer');
        this.messages = document.getElementById('messages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.charCount = document.getElementById('charCount');

        // Header elements
        this.currentModel = document.getElementById('currentModel');
        this.currentParams = document.getElementById('currentParams');
        this.activeModel = document.getElementById('activeModel');
        this.clearBtn = document.getElementById('clearBtn');
        this.shareBtn = document.getElementById('shareBtn');

        // Action buttons
        this.attachBtn = document.getElementById('attachBtn');
        this.voiceBtn = document.getElementById('voiceBtn');

        // Example prompts
        this.examplePrompts = document.querySelectorAll('.example-prompt');
    }

    bindEvents() {
        // Header events
        this.newChatBtn.addEventListener('click', () => this.startNewChat());

        // Right pane events
        this.rightPaneToggle.addEventListener('click', () => this.toggleRightPane());
        
        // Provider selection
        this.providerSelect.addEventListener('change', (e) => {
            this.switchProvider(e.target.value);
        });

        // Model parameter events
        this.modelSelect.addEventListener('change', (e) => this.updateModel(e.target.value));
        this.temperatureSlider.addEventListener('input', (e) => this.updateTemperature(e.target.value));
        this.maxTokensSlider.addEventListener('input', (e) => this.updateMaxTokens(e.target.value));
        this.topPSlider.addEventListener('input', (e) => this.updateTopP(e.target.value));
        this.seedInput.addEventListener('input', (e) => this.updateSeed(e.target.value));
        this.randomSeedBtn.addEventListener('click', () => this.generateRandomSeed());
        this.systemPrompt.addEventListener('input', (e) => this.updateSystemPrompt(e.target.value));
        this.apiKeyInput.addEventListener('input', (e) => this.updateApiKey(e.target.value));

        // Settings actions
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.resetSettingsBtn.addEventListener('click', () => this.resetSettings());

        // Message input events
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.updateSendButtonState();
            this.autoResizeTextarea();
        });

        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        this.sendBtn.addEventListener('click', () => this.handleSendMessage());

        // Header action events
        this.clearBtn.addEventListener('click', () => this.clearConversation());
        this.shareBtn.addEventListener('click', () => this.shareConversation());

        // Other action events
        this.attachBtn.addEventListener('click', () => this.handleAttachment());
        this.voiceBtn.addEventListener('click', () => this.toggleVoiceInput());

        // Example prompt events
        this.examplePrompts.forEach(prompt => {
            prompt.addEventListener('click', (e) => {
                const promptText = e.currentTarget.dataset.prompt;
                this.messageInput.value = promptText;
                this.updateCharCount();
                this.updateSendButtonState();
                this.messageInput.focus();
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.startNewChat();
            }
            if (e.key === 'Escape') {
                this.messageInput.focus();
            }
        });
    }

    updateModelDisplay() {
        const modelNames = {
            // OpenAI
            'gpt-4o': 'GPT-4o',
            'gpt-4o-mini': 'GPT-4o Mini',
            'gpt-4-turbo': 'GPT-4 Turbo',
            'gpt-4': 'GPT-4',
            'gpt-3.5-turbo': 'GPT-3.5 Turbo',
            
            // Google
            'gemini-1.5-pro': 'Gemini 1.5 Pro',
            'gemini-1.5-flash': 'Gemini 1.5 Flash',
            'gemini-pro': 'Gemini Pro',
            'gemini-pro-vision': 'Gemini Pro Vision',
            
            // Legacy
            'local': 'Local Model'
        };

        const displayName = modelNames[this.modelParams.model] || this.modelParams.model;
        this.currentModel.textContent = displayName;
        this.activeModel.textContent = displayName.split(' ')[0];
        this.currentParams.textContent = `T: ${this.modelParams.temperature} | Max: ${this.modelParams.maxTokens}`;
    }

    // Right pane methods
    toggleRightPane() {
        this.rightPane.classList.toggle('open');
        const icon = this.rightPaneToggle.querySelector('i');
        if (this.rightPane.classList.contains('open')) {
            icon.className = 'fas fa-chevron-left';
        } else {
            icon.className = 'fas fa-chevron-right';
        }
    }

    switchProvider(provider) {
        this.modelParams.provider = provider;
        
        // Update provider dropdown
        this.providerSelect.value = provider;

        // Update model options based on provider
        this.updateModelOptions(provider);
        this.updateModelDisplay();
        this.saveSettings();
    }

    updateModelOptions(provider) {
        const modelSelect = this.modelSelect;
        
        // Clear existing options
        modelSelect.innerHTML = '';

        const modelOptions = {
            'openai': [
                { value: 'gpt-4o', text: 'GPT-4o' },
                { value: 'gpt-4o-mini', text: 'GPT-4o Mini' },
                { value: 'gpt-4-turbo', text: 'GPT-4 Turbo' },
                { value: 'gpt-4', text: 'GPT-4' },
                { value: 'gpt-3.5-turbo', text: 'GPT-3.5 Turbo' }
            ],
            'google': [
                { value: 'gemini-2.5-flash', text: 'Gemini 2.5 Flash' },
                { value: 'gemini-2.0-flash', text: 'Gemini 2.0 Flash' },
                { value: 'gemini-flash-latest', text: 'Gemini Flash Latest' },
                { value: 'gemini-pro-latest', text: 'Gemini Pro Latest' }
            ]
        };

        const models = modelOptions[provider] || [];
        
        // Add new options
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.text;
            modelSelect.appendChild(option);
        });

        // Select the first model if current model is not available for this provider
        if (models.length > 0) {
            const currentModelExists = models.find(m => m.value === this.modelParams.model);
            if (currentModelExists) {
                modelSelect.value = this.modelParams.model;
            } else {
                this.modelParams.model = models[0].value;
                modelSelect.value = this.modelParams.model;
                this.updateModelDisplay();
            }
        }
    }

    // Model parameter methods
    updateModel(model) {
        this.modelParams.model = model;
        this.updateModelDisplay();
        this.saveSettings();
    }

    updateTemperature(value) {
        this.modelParams.temperature = parseFloat(value);
        this.tempValue.textContent = value;
        this.updateModelDisplay();
        this.saveSettings();
    }

    updateMaxTokens(value) {
        this.modelParams.maxTokens = parseInt(value);
        this.tokensValue.textContent = value;
        this.updateModelDisplay();
        this.saveSettings();
    }

    updateTopP(value) {
        this.modelParams.topP = parseFloat(value);
        this.topPValue.textContent = value;
        this.updateModelDisplay();
        this.saveSettings();
    }

    updateSeed(value) {
        this.modelParams.seed = value ? parseInt(value) : null;
        this.saveSettings();
    }

    generateRandomSeed() {
        const randomSeed = Math.floor(Math.random() * 2147483647);
        this.seedInput.value = randomSeed;
        this.modelParams.seed = randomSeed;
        this.saveSettings();
    }

    updateSystemPrompt(value) {
        this.modelParams.systemPrompt = value;
        this.saveSettings();
    }

    updateApiKey(value) {
        this.modelParams.apiKey = value;
        this.saveSettings();
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            this.modelParams = {
                provider: 'openai',
                model: 'gpt-3.5-turbo',
                temperature: 0.7,
                maxTokens: 1000,
                topP: 1.0,
                seed: null,
                systemPrompt: '',
                apiKey: ''
            };
            
            this.updateModelControls();
            this.updateModelDisplay();
            this.saveSettings();
        }
    }

    updateModelControls() {
        // Update provider dropdown
        this.providerSelect.value = this.modelParams.provider;

        // Update model options
        this.updateModelOptions(this.modelParams.provider);

        // Update sliders and inputs
        this.temperatureSlider.value = this.modelParams.temperature;
        this.maxTokensSlider.value = this.modelParams.maxTokens;
        this.topPSlider.value = this.modelParams.topP;
        this.seedInput.value = this.modelParams.seed || '';
        this.systemPrompt.value = this.modelParams.systemPrompt || '';
        this.apiKeyInput.value = this.modelParams.apiKey || '';

        // Update display values
        this.tempValue.textContent = this.modelParams.temperature;
        this.tokensValue.textContent = this.modelParams.maxTokens;
        this.topPValue.textContent = this.modelParams.topP;
    }

    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = `${count} characters`;
        
        if (count > 2000) {
            this.charCount.style.color = '#ff4444';
        } else if (count > 1500) {
            this.charCount.style.color = '#ffaa44';
        } else {
            this.charCount.style.color = '#666666';
        }
    }

    updateSendButtonState() {
        const hasText = this.messageInput.value.trim().length > 0;
        this.sendBtn.disabled = !hasText || this.isTyping;
        
        if (hasText && !this.isTyping) {
            this.sendBtn.style.opacity = '1';
            this.sendBtn.style.cursor = 'pointer';
        } else {
            this.sendBtn.style.opacity = '0.5';
            this.sendBtn.style.cursor = 'not-allowed';
        }
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    // Chat methods
    async handleSendMessage() {
        const message = this.messageInput.value.trim();
        console.log('handleSendMessage called with message:', message);
        console.log('isTyping:', this.isTyping);
        
        if (!message || this.isTyping) {
            console.log('Message empty or already typing, returning');
            return;
        }

        // Switch to chat view if on welcome screen
        if (this.welcomeScreen.style.display !== 'none') {
            console.log('Switching to chat view');
            this.switchToChatView();
        }

        // Add user message
        console.log('Adding user message to chat');
        this.addMessage('user', message);
        
        this.messageInput.value = '';
        this.updateCharCount();
        this.updateSendButtonState();
        this.autoResizeTextarea();

        // Generate AI response
        console.log('Generating AI response...');
        await this.generateAIResponse(message);
        
        // Save chat
        this.saveChatHistory();
    }

    switchToChatView() {
        this.welcomeScreen.style.display = 'none';
        this.chatContainer.style.display = 'block';
        this.messageInput.focus();
        
        // Create new chat if needed
        if (!this.currentChatId) {
            this.currentChatId = Date.now().toString();
        }
    }

    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? 'U' : 'AI';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Handle markdown-like formatting
        const formattedContent = this.formatMessage(content);
        messageContent.innerHTML = formattedContent;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        this.messages.appendChild(messageDiv);
        this.scrollToBottom();

        // Store message
        this.messagesData.push({ 
            sender, 
            content, 
            timestamp: new Date(),
            id: Date.now() + Math.random()
        });
    }

    formatMessage(content) {
        // Simple markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    async generateAIResponse(userMessage) {
        console.log('generateAIResponse called with message:', userMessage);
        this.isTyping = true;
        this.showTypingIndicator();
        this.updateSendButtonState();

        try {
            // Call the backend API
            console.log('Calling backend API...');
            const response = await this.callBackendAPI(userMessage);
            
            this.hideTypingIndicator();
            this.addMessage('assistant', response);
        } catch (error) {
            console.error('Error generating AI response:', error);
            this.hideTypingIndicator();
            this.addMessage('assistant', `Sorry, I encountered an error: ${error.message}. Please check your API keys and try again.`);
        } finally {
            this.isTyping = false;
            this.updateSendButtonState();
        }
    }

    async callBackendAPI(userMessage) {
        // Use relative URL for Vercel deployment
        const backendUrl = '/api/chat';
        
        const requestData = {
            provider: this.modelParams.provider,
            model: this.modelParams.model,
            message: userMessage,
            system_prompt: this.modelParams.systemPrompt,
            temperature: this.modelParams.temperature,
            max_tokens: this.modelParams.maxTokens,
            top_p: this.modelParams.topP,
            seed: this.modelParams.seed
        };

        console.log('Sending request to backend:', requestData);
        console.log('Backend URL:', backendUrl);

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Backend error:', errorData);
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Backend response:', data);
        return data.response;
    }

    generateMockResponse(userMessage) {
        const responses = [
            "That's an interesting question! Let me think about that...",
            "I understand what you're asking. Here's my perspective on that topic.",
            "Great question! This is a complex topic with several aspects to consider.",
            "I'd be happy to help you with that. Let me break it down for you.",
            "That's a thoughtful inquiry. Based on what I know, here's what I can tell you.",
        ];

        let response = responses[Math.floor(Math.random() * responses.length)];
        
        // Add context based on user message
        if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
            response = "Hello! Welcome to the LLM Playground. I'm here to help answer your questions and have conversations with you. What would you like to explore today?";
        } else if (userMessage.toLowerCase().includes('help')) {
            response = "I'm here to help! You can ask me questions about various topics, request explanations, get creative writing assistance, help with problem-solving, or just have a conversation. What specific area would you like help with?";
        } else if (userMessage.toLowerCase().includes('code') || userMessage.toLowerCase().includes('programming')) {
            response = "I'd be happy to help with coding! I can assist with writing functions, debugging, explaining concepts, or reviewing code. What programming language or specific problem are you working with?";
        }

        // Add model parameter info
        response += `\n\n*Response generated using ${this.modelParams.model} with temperature ${this.modelParams.temperature} and max tokens ${this.modelParams.maxTokens}.*`;
        
        return response;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing';
        typingDiv.id = 'typing-indicator';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = 'AI';

        const typingContent = document.createElement('div');
        typingContent.className = 'message-content';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        
        typingContent.appendChild(typingIndicator);
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingContent);

        this.messages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    // Chat management methods
    startNewChat() {
        this.messagesData = [];
        this.currentChatId = null;
        this.messages.innerHTML = '';
        this.welcomeScreen.style.display = 'flex';
        this.chatContainer.style.display = 'none';
        this.messageInput.value = '';
        this.updateCharCount();
        this.updateSendButtonState();
        this.autoResizeTextarea();
        this.messageInput.focus();
    }

    clearConversation() {
        if (confirm('Are you sure you want to clear this conversation?')) {
            this.messagesData = [];
            this.messages.innerHTML = '';
            this.welcomeScreen.style.display = 'flex';
            this.chatContainer.style.display = 'none';
            this.currentChatId = null;
        }
    }

    shareConversation() {
        if (this.messagesData.length === 0) {
            alert('No conversation to share!');
            return;
        }

        const conversationText = this.messagesData
            .map(msg => `${msg.sender.toUpperCase()}: ${msg.content}`)
            .join('\n\n');

        if (navigator.share) {
            navigator.share({
                title: 'LLM Playground Conversation',
                text: conversationText
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(conversationText).then(() => {
                alert('Conversation copied to clipboard!');
            }).catch(() => {
                alert('Failed to copy conversation. Please try again.');
            });
        }
    }

    // Storage methods
    saveChatHistory() {
        if (this.messagesData.length > 0 && this.currentChatId) {
            const chatData = {
                id: this.currentChatId,
                title: this.messagesData[0]?.content.substring(0, 50) + '...',
                messages: this.messagesData,
                timestamp: new Date(),
                modelParams: { ...this.modelParams }
            };

            let history = JSON.parse(localStorage.getItem('llm_chat_history') || '[]');
            const existingIndex = history.findIndex(chat => chat.id === this.currentChatId);
            
            if (existingIndex >= 0) {
                history[existingIndex] = chatData;
            } else {
                history.unshift(chatData);
            }

            // Keep only last 50 chats
            history = history.slice(0, 50);
            localStorage.setItem('llm_chat_history', JSON.stringify(history));
        }
    }

    loadChatHistory() {
        const history = JSON.parse(localStorage.getItem('llm_chat_history') || '[]');
        this.chatHistory = history;
    }

    renderMessages() {
        this.messages.innerHTML = '';
        this.messagesData.forEach(msg => {
            this.addMessage(msg.sender, msg.content);
        });
    }

    saveSettings() {
        localStorage.setItem('llm_model_params', JSON.stringify(this.modelParams));
    }

    loadSettings() {
        const saved = localStorage.getItem('llm_model_params');
        if (saved) {
            this.modelParams = { ...this.modelParams, ...JSON.parse(saved) };
            this.updateModelControls();
            this.updateModelDisplay();
        } else {
            // Initialize with default provider
            this.updateModelOptions(this.modelParams.provider);
        }
    }


    // Other methods
    handleAttachment() {
        alert('File attachment feature coming soon!');
    }

    toggleVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                this.voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
                this.voiceBtn.style.background = '#ff4444';
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.messageInput.value = transcript;
                this.updateCharCount();
                this.updateSendButtonState();
                this.autoResizeTextarea();
            };

            recognition.onend = () => {
                this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                this.voiceBtn.style.background = '#404040';
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                this.voiceBtn.style.background = '#404040';
                alert('Speech recognition error. Please try again.');
            };

            recognition.start();
        } else {
            alert('Speech recognition not supported in this browser.');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const playground = new LLMPlayground();
    playground.loadSettings();
    
    // Set initial focus
    setTimeout(() => {
        playground.messageInput.focus();
    }, 100);
});
