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

ZASADY OGÓLNE:
1. Zachowaj formę osobową z oryginału (np. "stwórz" → "stwórz")
2. Odpowiadaj w języku polskim
3. Zachowaj profesjonalny ale przystępny ton
4. Uwzględnij najlepsze praktyki i standardy branżowe

FORMAT ODPOWIEDZI:
Struktura twojej odpowiedzi powinna zawierać następujące sekcje:

🎯 OPIS FUNKCJONALNY:
- Rozszerz funkcjonalności aplikacji
- Dodaj szczegóły dotyczące możliwości i features
- Uwzględnij user experience i interfejs

🛠️ STACK TECHNOLOGICZNY:
- Frontend: (np. React, Vue.js, Angular + CSS framework)
- Backend: (np. Node.js/Express, Python/Django, Java/Spring)
- Baza danych: (np. PostgreSQL, MongoDB, Redis)
- Dodatkowe narzędzia i biblioteki

🏗️ ARCHITEKTURA SYSTEMU:
- Typ architektury (monolityczna, mikroserwisy, serverless)
- Struktura komponentów
- Integracje z zewnętrznymi API
- Wzorce projektowe

📁 STRUKTURA PROJEKTU:
- Organizacja folderów i plików
- Kluczowe katalogi
- Separacja logiki biznesowej

🔒 BEZPIECZEŃSTWO I PERFORMANCE:
- Uwierzytelnianie i autoryzacja
- Optymalizacje wydajności
- Caching i skalowanie
- Monitoring i logging

🚀 DODATKOWE FUNKCJONALNOŚCI:
- Zaawansowane features
- Integracje
- Możliwości rozszerzenia

Przykład:
Wejście: "stwórz chatbota który będzie generować obrazy"

Wyjście:
"Stwórz zaawansowaną aplikację chatbota do generowania obrazów z wykorzystaniem AI.

🎯 OPIS FUNKCJONALNY:
Aplikacja powinna umożliwiać użytkownikom prowadzenie konwersacji tekstowych z botem, który na podstawie opisów generuje obrazy. Interfejs chatowy z historią konwersacji, możliwością zapisywania ulubionych obrazów, galerii wygenerowanych grafik z opcjami filtrowania i wyszukiwania.

🛠️ STACK TECHNOLOGICZNY:
- Frontend: React.js z TypeScript, Tailwind CSS, Socket.io-client
- Backend: Node.js z Express.js, Socket.io dla real-time
- Baza danych: PostgreSQL (metadata), Redis (cache, sesje)
- AI API: OpenAI DALL-E, Stable Diffusion lub Midjourney
- Storage: AWS S3 lub Cloudinary dla obrazów

🏗️ ARCHITEKTURA SYSTEMU:
- Architektura mikroserwisowa z oddzielnym serwisem dla generowania obrazów
- API Gateway do routingu żądań
- Queue system (Bull/Redis) dla asynchronicznego przetwarzania
- WebSocket connections dla real-time komunikacji

📁 STRUKTURA PROJEKTU:
/frontend (React app)
/backend (/api, /services, /middleware, /models)
/image-service (mikroservice do AI)
/shared (typy TypeScript, utils)
/docs (dokumentacja API)

🔒 BEZPIECZEŃSTWO I PERFORMANCE:
- JWT authentication z refresh tokens
- Rate limiting per user/IP
- Input validation i sanitization
- CDN dla obrazów, lazy loading
- Monitoring z Prometheus/Grafana

🚀 DODATKOWE FUNKCJONALNOŚCI:
- Edycja wygenerowanych obrazów (crop, resize, filtry)
- Współdzielenie galerii między użytkownikami
- API webhooks dla integracji z zewnętrznymi systemami
- Mobile app (React Native)
- Admin panel do zarządzania użytkownikami i contentem"`;

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
                max_tokens: 2000,
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
    const demoResponse = `Stwórz kompleksową aplikację do zarządzania zadaniami z nowoczesną architekturą i funkcjonalnościami współpracy zespołowej.

🎯 OPIS FUNKCJONALNY:
Aplikacja powinna umożliwiać tworzenie, przydzielanie i śledzenie zadań w projektach zespołowych. Dashboard z widokiem kalendarza, kanban board, listy zadań z filtrami według priorytetów, statusów i przypisanych osób. System notyfikacji real-time, komentarze, załączniki, czasomierz pracy, raporty produktywności.

🛠️ STACK TECHNOLOGICZNY:
- Frontend: React.js z TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js z Express.js, Socket.io dla real-time
- Baza danych: PostgreSQL z Prisma ORM, Redis dla cache i sesji
- Authentication: NextAuth.js z JWT
- File Storage: AWS S3 lub Cloudinary
- Email: SendGrid lub Nodemailer

🏗️ ARCHITEKTURA SYSTEMU:
- Architektura monolityczna modularna z możliwością przejścia na mikroserwisy
- RESTful API z GraphQL endpoint dla złożonych zapytań
- WebSocket connections dla real-time updates
- Event-driven architecture z message queue (Bull/Redis)

📁 STRUKTURA PROJEKTU:
/frontend
  /src (/components, /pages, /hooks, /store, /utils)
/backend
  /src (/routes, /controllers, /services, /models, /middleware)
/shared (/types, /constants, /validators)
/database (/migrations, /seeds)
/docs (/api-documentation)

🔒 BEZPIECZEŃSTWO I PERFORMANCE:
- Uwierzytelnianie dwuetapowe (2FA)
- Role-based access control (RBAC)
- Rate limiting per endpoint
- Input validation z Joi/Zod
- SQL injection protection
- Redis caching dla często używanych danych
- Database indexing i query optimization

🚀 DODATKOWE FUNKCJONALNOŚCI:
- Integration z Calendar (Google Calendar, Outlook)
- Slack/Teams webhooks dla notyfikacji
- Time tracking z raportami produktywności
- Templates dla często używanych projektów
- Export danych do Excel/PDF
- Mobile app (React Native)
- Dark/light mode
- Multi-language support
- Offline mode z synchronizacją`;
    
    setTimeout(() => {
        enhancer.addMessage(demoPrompt, 'user');
        setTimeout(() => {
            enhancer.addMessage(demoResponse, 'bot');
        }, 1000);
    }, 500);
};