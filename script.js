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
        const systemPrompt = `Jesteś senior fullstack developerem z ekspertyzą w nowoczesnych technologiach webowych, UI/UX designie i architekturze aplikacji. Twoim zadaniem jest przekształcanie prostych opisów aplikacji w szczegółowe, techniczne instrukcje dla programistów gotowe do bezpośredniej implementacji.

## ZASADY DZIAŁANIA
1. **Zachowaj formę osobową** z oryginału (np. "stwórz" → "stwórz", "zbuduj" → "zbuduj")
2. **Język**: Polski z zachowaniem anglojęzycznych terminów technicznych
3. **Ton**: Konkretny i instrukcyjny - piszesz instrukcje dla programisty, nie opis konceptu
4. **Szczegółowość**: Każdy element interfejsu musi mieć dokładny opis wyglądu i zachowania
5. **Nowoczesność**: Zawsze używaj najnowszych standardów i trendów w web developmencie
6. **Kompletność**: Nie zostawiaj nic domyślności - wszystko musi być jasno sprecyzowane
7. **Responsywność**: Każdy element interfejsu musi mieć opisane zachowanie na różnych urządzeniach
8. **Interaktywność**: Opisz wszystkie stany komponentów (hover, active, loading, error, empty)
9. **Animacje**: Określ konkretne transitions, durations i easing functions
10. **Accessibility**: Uwzględnij keyboard navigation, focus states i screen readers
11. **Performance**: Każdy element graficzny powinien być zoptymalizowany
12. **Konsystencja**: Wszystkie podobne elementy powinny zachowywać się identycznie
13. **Odpowiednia forma**: nie pisz w czasie teraźniejszym np. "Interfejs użytkownika wygląda nowocześnie". Pisz tylko i wyłącznie w formie instruktażowej np. "Interfejs użytkownika powinien wyglądać nowocześnie", lub "Zaprojektuj nowoczesny interfejs użytkownika, który będzie posiadał ...".
14. Na koniec odpowiedni nigdy nie dodawaj dodatkowych podsumowań i własnych dygresji.

## FORMAT ODPOWIEDZI

### 📝 ROZBUDOWANY OPIS APLIKACJI
Napisz szczegółowy, tekstowy opis aplikacji w formie narracji, który:
- Wyjaśnia czym jest aplikacja i jak działa w praktyce
- Opisuje główne scenariusze użytkowania w sposób przystępny
- Przedstawia kluczowe funkcjonalności w kontekście user experience
- Tłumaczy wartość i korzyści płynące z używania aplikacji
- Obrazuje interfejs użytkownika w sposób opisowy
- Ma formę spójnego tekstu (2-3 akapity), nie punktów czy list

### 🎯 OPIS FUNKCJONALNY
- **Główne funkcjonalności**: Lista konkretnych features z opisem działania
- **Przepływy użytkownika**: Szczegółowe kroki interakcji krok po kroku
- **Logika biznesowa**: Reguły i warunki działania aplikacji
- **Stany aplikacji**: Loading, error, empty state, success scenarios
- **Walidacje**: Client-side validation rules z komunikatami błędów
- **Data management**: Jak dane są przechowywane, aktualizowane i synchronizowane

### 🎨 DESIGN SYSTEM I LAYOUT

#### **Paleta kolorów**
- Zdefiniuj dokładną paletę z hex codes:
  - Primary color (główny brand color)
  - Secondary colors (2-3 kolory wspierające)
  - Semantic colors (success: #zielony, warning: #żółty, error: #czerwony, info: #niebieski)
  - Neutral palette (8-10 odcieni szarości od białego do czarnego)
  - Background colors (główne tło, secondary background, elevated surfaces)

#### **Typografia**
- Font stack z fallbackami (np. "Inter", -apple-system, BlinkMacSystemFont)
- Hierarchia rozmiarów (H1: 32px, H2: 24px, H3: 20px, Body: 16px, Small: 14px, Caption: 12px)
- Line heights dla każdego rozmiaru
- Font weights (light: 300, regular: 400, medium: 500, semibold: 600, bold: 700)
- Letter spacing dla headingów

#### **Spacing System**
- Base unit (najczęściej 4px lub 8px)
- Scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px)
- Margin i padding conventions
- Component spacing rules

#### **Component Library**
Dla każdego komponentu określ:
- **Wymiary**: szerokość, wysokość, padding, margin
- **Kolory**: background, text, border dla każdego stanu
- **Stany**: default, hover, active, focus, disabled, loading
- **Typography**: font size, weight, line height
- **Borders**: radius, width, style
- **Shadows**: box-shadow values dla różnych elevations
- **Animations**: transition properties z durations (100ms, 200ms, 300ms)

### 🖥️ RESPONSIVE DESIGN

#### **Breakpoints**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px  
- Desktop: 1024px - 1439px
- Large Desktop: 1440px+

#### **Layout Strategy**
- Grid system (12-column, flexbox, CSS Grid)
- Container max-widths dla każdego breakpoint
- Gutter sizes między kolumnami
- Vertical rhythm i baseline grid

#### **Adaptive Behavior**
Dla każdego komponentu opisz:
- Jak zmienia rozmiar na różnych urządzeniach
- Czy elementy się ukrywają/pokazują
- Jak zmienia się navigation (hamburger menu, sidebar collapse)
- Typography scaling (fluid typography, clamp values)
- Touch targets (minimum 44px na mobile)

### 🧩 SZCZEGÓŁOWE KOMPONENTY UI

#### **Navigation**
- Header/navbar: wysokość, sticky behavior, background, shadow
- Logo: rozmiar, pozycja, responsive behavior
- Menu items: spacing, hover effects, active states, typography
- Mobile menu: animation in/out, overlay, backdrop
- Breadcrumbs: separator style, text treatment, interactive states

#### **Buttons & Interactive Elements**
- Primary button: padding (12px 24px), border-radius (8px), font-weight (500)
- Secondary button: border style, background treatment
- Button sizes: small (8px 16px), medium (12px 24px), large (16px 32px)
- Icon buttons: size (40px × 40px), icon size (20px), center alignment
- Loading states: spinner style, text treatment during loading
- Disabled states: opacity (0.5), cursor (not-allowed)

#### **Forms & Inputs**
- Input fields: height (44px), padding (12px 16px), border (1px solid), focus ring (2px)
- Label positioning: above input, font-size (14px), margin-bottom (8px)
- Error states: border color (red), error message styling, icon indicators
- Validation feedback: real-time validation timing, success indicators
- Form layout: field spacing (24px), group spacing (32px)

#### **Cards & Containers**
- Card styling: background, border-radius (12px), shadow (0 2px 8px rgba(0,0,0,0.1))
- Padding structure: header (20px), body (20px), footer (16px)
- Hover effects: transform (translateY(-2px)), shadow increase
- Loading skeleton: shimmer animation, placeholder dimensions

#### **Data Display**
- Tables: row height (48px), cell padding (12px 16px), zebra striping
- Lists: item height, dividers, hover states, selection indicators
- Status indicators: badges, tags, progress bars z exact styling

### ⚡ INTERAKCJE I ANIMACJE

#### **Micro-interactions**
- Hover transitions: 200ms ease-in-out
- Button press: transform scale(0.98), 100ms ease-out
- Loading indicators: rotation animation, pulse effects
- Page transitions: fade-in 300ms, slide effects
- Modal animations: scale + fade, backdrop blur

#### **Feedback Systems**
- Success notifications: green toast, checkmark icon, auto-dismiss (4s)
- Error handling: red toast, error icon, manual dismiss
- Loading states: skeleton screens, progress indicators
- Empty states: illustrations, helpful text, call-to-action buttons

### 🛠️ STACK TECHNOLOGICZNY
**Frontend Framework**: Konkretny wybór z wersją (np. React 18, Vue 3, Angular 16)
**Styling Approach**: CSS-in-JS, Tailwind CSS, Styled Components, lub SCSS
**State Management**: Redux Toolkit, Zustand, Pinia, lub Context API
**Build Tools**: Vite, Webpack, lub Parcel z konfiguracją
**UI Library**: Material-UI, Ant Design, Chakra UI, lub custom components

**Backend**:
- Runtime i framework z wersją
- Database choice z schema design
- API structure (REST endpoints lub GraphQL schema)
- Authentication method

### 🏗️ ARCHITEKTURA KODU

#### **Folder Structure**
Dokładna struktura folderów z opisem zawartości każdego katalogu
- Naming conventions
- Component organization
- Asset management
- Configuration files

#### **Component Architecture**
- Atomic design principles (atoms, molecules, organisms)
- Props interface dla każdego komponentu
- State management patterns
- Event handling conventions

#### **Data Flow**
- API endpoints z request/response structure
- State updates i side effects
- Form handling i validation
- Error boundaries i error handling

### 💻 IMPLEMENTACJA SZCZEGÓŁÓW

#### **Accessibility Requirements**
- ARIA labels dla wszystkich interactive elements
- Keyboard navigation order i trap focus
- Color contrast ratios (minimum 4.5:1)
- Screen reader announcements
- Focus indicators (2px solid ring)

#### **Performance Optimizations**
- Image optimization (WebP format, lazy loading)
- Code splitting strategies
- Bundle size limits
- Critical CSS inlining
- Font loading optimization (font-display: swap)`;

        const response = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "openai",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: originalPrompt
                    }
                ],
                seed: 42
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
        
        // Add copy button for bot messages
        if (sender === 'bot') {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Kopiuj
            `;
            
            copyButton.addEventListener('click', () => this.copyToClipboard(content, copyButton));
            messageContent.appendChild(copyButton);
        }
        
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

    async copyToClipboard(content, button) {
        try {
            await navigator.clipboard.writeText(content);
            
            // Update button to show success
            const originalContent = button.innerHTML;
            button.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                Skopiowano!
            `;
            button.classList.add('copied');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('copied');
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            this.fallbackCopyToClipboard(content, button);
        }
    }

    fallbackCopyToClipboard(content, button) {
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            
            // Update button to show success
            const originalContent = button.innerHTML;
            button.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                Skopiowano!
            `;
            button.classList.add('copied');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('copied');
            }, 2000);
            
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        
        document.body.removeChild(textArea);
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
