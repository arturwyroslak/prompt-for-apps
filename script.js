class PromptEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCharCounter();
    }

    bindEvents() {
        const sendButton = document.getElementById('sendButton');
        const userInput = document.getElementById('userInput');

        sendButton.addEventListener('click', () => this.handleSendMessage());
        
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        userInput.addEventListener('input', () => this.updateCharCounter());
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
- Opisz główne przepływy użytkownika (user flows)

🎨 INTERFEJS I DESIGN:
- Szczegółowy opis responsywnego interfejsu użytkownika
- Komponenty UI i ich funkcjonalności
- Zasady projektowania (Material Design, Apple HIG, lub custom design system)
- Kolory, typografia, ikony i animacje
- Dostępność (accessibility) i użyteczność
- Adaptive design dla różnych urządzeń (desktop, tablet, mobile)

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

🚀 DODATKOWE FUNKCJONALNOŚCI:
- Zaawansowane features
- Integracje
- Możliwości rozszerzenia

Przykład odpowiedzi:
Wejście: "stwórz aplikację do zarządzania projektami"

Wyjście:
"Stwórz kompleksową aplikację do zarządzania projektami z nowoczesną architekturą i intuicyjnym interfejsem.

🎯 OPIS FUNKCJONALNY:
Aplikacja powinna umożliwiać tworzenie, przydzielanie i śledzenie zadań w projektach zespołowych. Dashboard z przeglądem projektów, kalendarz z deadline'ami, system powiadomień, raporty postępu i analizy produktywności zespołu.

🎨 INTERFEJS I DESIGN:
Zaprojektuj nowoczesny, minimalistyczny interfejs z jasną hierarchią wizualną. Główny dashboard z kartami projektów w layoutcie grid responsywnym (4 kolumny na desktop, 2 na tablet, 1 na mobile). Zastosuj design system z paletą kolorów: główny #3B82F6 (niebieski), akcent #10B981 (zielony), tło #F8FAFC (jasny). Sidebar z nawigacją zwijany na urządzeniach mobilnych. Komponenty: TopBar z search i notyfikacjami, ProjectCard z progress bar i avatar team members, TaskList z drag-and-drop, CalendarView z color-coded events. Animacje: smooth transitions (300ms ease-in-out), hover effects, loading skeletons. Dark mode support z automatycznym przełączaniem.

🛠️ STACK TECHNOLOGICZNY:
- Frontend: React.js z TypeScript, Tailwind CSS, Framer Motion, React Query
- Backend: Node.js z Express.js, Socket.io dla real-time
- Baza danych: PostgreSQL z Prisma ORM, Redis dla cache
- Auth: NextAuth.js z JWT tokens
- File Storage: AWS S3 lub Cloudinary

🏗️ ARCHITEKTURA SYSTEMU:
- Architektura modularna z separation of concerns
- RESTful API z GraphQL endpoint dla złożonych zapytań
- Real-time updates przez WebSockets
- Event-driven architecture z message queue

📁 STRUKTURA PROJEKTU:
/frontend (/components, /pages, /hooks, /store, /utils, /styles)
/backend (/routes, /controllers, /services, /models, /middleware)
/shared (/types, /constants, /validators)
/database (/migrations, /seeds)

🚀 DODATKOWE FUNKCJONALNOŚCI:
- Integracja z Calendar (Google, Outlook)
- Export raportów do PDF/Excel
- Mobile app (React Native)
- Slack/Teams notifications
- Time tracking z automatyczną analizą produktywności
- Templates dla typowych projektów"`;

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=AIzaSyBIQAq-rkn_-rf7ifmLANt1kyYsLZ-XQPk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `${systemPrompt}\n\nUżytkownik: ${originalPrompt}`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    thinkingConfig: {
                        thinkingBudget: 0
                    }
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
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
    const demoResponse = `Stwórz kompleksową aplikację do zarządzania zadaniami z nowoczesną architekturą i intuicyjnym interfejsem.

🎯 OPIS FUNKCJONALNY:
Aplikacja powinna umożliwiać tworzenie, przydzielanie i śledzenie zadań w projektach zespołowych. Dashboard z przeglądem projektów, kalendarz z deadline'ami, system powiadomień, raporty postępu i analizy produktywności zespołu. Kanban board z drag-and-drop, filtry według priorytetów i statusów, czasomierz pracy, komentarze i załączniki.

🎨 INTERFEJS I DESIGN:
Zaprojektuj nowoczesny, minimalistyczny interfejs z jasną hierarchią wizualną. Główny dashboard z kartami projektów w responsywnym grid layout (3 kolumny na desktop, 2 na tablet, 1 na mobile). Design system z paletą: primary #3B82F6 (niebieski), success #10B981 (zielony), background #F8FAFC. Sidebar z nawigacją zwijany na mobile. Komponenty: TopBar z search i notyfikacjami, ProjectCard z progress bar, TaskList z drag-and-drop, Calendar z color-coded events. Smooth animations (300ms ease-in-out), hover effects, loading states. Dark mode z automatycznym przełączaniem na podstawie preferencji systemu.

🛠️ STACK TECHNOLOGICZNY:
- Frontend: React.js z TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js z Express.js, Socket.io dla real-time
- Baza danych: PostgreSQL z Prisma ORM, Redis dla cache i sesji
- Authentication: NextAuth.js z JWT
- File Storage: AWS S3 lub Cloudinary
- Email: SendGrid lub Nodemailer

🏗️ ARCHITEKTURA SYSTEMU:
- Architektura modularna z separation of concerns
- RESTful API z GraphQL endpoint dla złożonych zapytań
- WebSocket connections dla real-time updates
- Event-driven architecture z message queue (Bull/Redis)

📁 STRUKTURA PROJEKTU:
/frontend (/components, /pages, /hooks, /store, /utils, /styles)
/backend (/routes, /controllers, /services, /models, /middleware)
/shared (/types, /constants, /validators)
/database (/migrations, /seeds)
/docs (/api-documentation)

🚀 DODATKOWE FUNKCJONALNOŚCI:
- Integracja z Calendar (Google Calendar, Outlook)
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