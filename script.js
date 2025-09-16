class PromptEnhancer {
    constructor() {
        this.apiKey = localStorage.getItem('openai_api_key') || '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadApiKey();
        this.updateCharCounter();
    }

    bindEvents() {
        const sendButton = document.getElementById('sendButton');
        const userInput = document.getElementById('userInput');
        const apiKeyInput = document.getElementById('apiKey');

        sendButton.addEventListener('click', () => this.handleSendMessage());
        
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        userInput.addEventListener('input', () => this.updateCharCounter());
        
        apiKeyInput.addEventListener('change', (e) => {
            this.apiKey = e.target.value;
            localStorage.setItem('openai_api_key', this.apiKey);
        });
    }

    loadApiKey() {
        const apiKeyInput = document.getElementById('apiKey');
        if (this.apiKey) {
            apiKeyInput.value = this.apiKey;
        }
    }

    updateCharCounter() {
        const userInput = document.getElementById('userInput');
        const charCount = document.getElementById('charCount');
        charCount.textContent = userInput.value.length;
    }

    async handleSendMessage() {
        const userInput = document.getElementById('userInput');
        const message = userInput.value.trim();

        if (!message) {
            this.showError('Proszę wprowadzić instrukcję do ulepszenia.');
            return;
        }

        if (!this.apiKey) {
            this.showError('Proszę skonfigurować klucz API OpenAI w sekcji konfiguracji.');
            return;
        }

        // Clear input and add user message
        userInput.value = '';
        this.updateCharCounter();
        this.addMessage(message, 'user');

        // Show loading
        this.showLoading(true);
        this.disableSendButton(true);

        try {
            const enhancedPrompt = await this.enhancePrompt(message);
            this.addMessage(enhancedPrompt, 'bot');
        } catch (error) {
            console.error('Error enhancing prompt:', error);
            this.showError('Wystąpił błąd podczas ulepszania instrukcji. Sprawdź klucz API i spróbuj ponownie.');
        } finally {
            this.showLoading(false);
            this.disableSendButton(false);
        }
    }

    async enhancePrompt(originalPrompt) {
        const systemPrompt = `Jesteś ekspertem w tworzeniu aplikacji i architekturze systemów. Twoim zadaniem jest ulepszanie prostych instrukcji tworzenia aplikacji, rozwijając je technicznie przy zachowaniu tej samej formy osobowej.

Zasady:
1. Zachowaj formę osobową z oryginału (np. "stwórz" → "stwórz")
2. Dodaj szczegóły techniczne, architekturę, technologie
3. Uwzględnij najlepsze praktyki i standardy branżowe
4. Rozwiń funkcjonalności i możliwości
5. Zaproponuj konkretne technologie i narzędzia
6. Odpowiadaj w języku polskim
7. Zachowaj profesjonalny ale przystępny ton

Przykład:
Wejście: "stwórz chatbota który będzie generować obrazy"
Wyjście: "Stwórz zaawansowaną aplikację chatbota z integracją API do generowania obrazów (DALL-E, Midjourney lub Stable Diffusion). Aplikacja powinna mieć architekturę mikroserwisową z oddzielnym backendem Node.js/Express do obsługi logiki chatbota, frontend React/Vue.js dla interfejsu użytkownika, oraz bazę danych (MongoDB/PostgreSQL) do przechowywania historii konwersacji i wygenerowanych obrazów. Zaimplementuj system kolejkowania zadań (Redis/Bull) dla asynchronicznego przetwarzania żądań generowania obrazów, dodaj mechanizm cache'owania, uwierzytelnianie użytkowników (JWT), system moderacji treści i API rate limiting. Uwzględnij responsywny design, obsługę wielojęzyczności oraz możliwość eksportowania wygenerowanych obrazów w różnych formatach."`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: originalPrompt }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Format the content with paragraphs
        const paragraphs = content.split('\n').filter(p => p.trim());
        paragraphs.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            messageContent.appendChild(p);
        });
        
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showError(message) {
        // Remove existing error messages
        const existingErrors = document.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const container = document.querySelector('.chat-container');
        container.insertBefore(errorDiv, container.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (show) {
            loadingOverlay.classList.remove('hidden');
        } else {
            loadingOverlay.classList.add('hidden');
        }
    }

    disableSendButton(disable) {
        const sendButton = document.getElementById('sendButton');
        sendButton.disabled = disable;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PromptEnhancer();
});

// Add some demo functionality for testing without API key
window.demoMode = () => {
    const enhancer = new PromptEnhancer();
    const demoPrompt = "stwórz aplikację do zarządzania zadaniami";
    const demoResponse = "Stwórz kompleksową aplikację do zarządzania zadaniami (Task Management System) z wykorzystaniem architektury full-stack. Backend zbuduj w Node.js z frameworkiem Express.js, wykorzystaj bazę danych PostgreSQL z Prisma ORM do zarządzania danymi. Frontend stwórz w React.js z TypeScript, zastosuj Tailwind CSS do stylizacji i Zustand do zarządzania stanem aplikacji. Zaimplementuj system uwierzytelniania z JWT tokenami, role użytkowników (admin, manager, user), real-time powiadomienia przez WebSockets, system komentarzy i załączników, filtry i sortowanie zadań, kalendarz z deadline'ami, dashboard z analityką, eksport danych do PDF/Excel oraz obsługę drag-and-drop do zmiany statusów zadań. Dodaj również funkcjonalności jak etykiety, priorytety, przydzielanie zadań zespołom, historia zmian oraz integrację z zewnętrznymi API (kalendarz, email, Slack).";
    
    setTimeout(() => {
        enhancer.addMessage(demoPrompt, 'user');
        setTimeout(() => {
            enhancer.addMessage(demoResponse, 'bot');
        }, 1000);
    }, 500);
};