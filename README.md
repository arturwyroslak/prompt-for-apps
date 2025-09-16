# Prompt for Apps 🤖

Aplikacja AI do ulepszania instrukcji tworzenia aplikacji. Przekształca proste opisy w szczegółowe, techniczne specyfikacje z uwzględnieniem architektury, technologii i najlepszych praktyk.

## 🎯 Funkcjonalności

- **Interfejs czatu** - intuicyjna konwersacja z AI
- **Ulepszanie promptów** - przekształcanie prostych instrukcji w szczegółowe specyfikacje techniczne
- **Wsparcie języka polskiego** - pełna obsługa języka polskiego
- **Integracja z OpenAI** - wykorzystuje GPT-4 do generowania ulepszonych instrukcji
- **Responsywny design** - działa na komputerach i urządzeniach mobilnych
- **Lokalne przechowywanie** - klucz API przechowywany bezpiecznie w przeglądarce

## 🚀 Jak używać

1. **Konfiguracja API**: 
   - Otwórz sekcję "⚙️ Konfiguracja API"
   - Wprowadź swój klucz API OpenAI
   - Klucz zostanie zapisany lokalnie w przeglądarce

2. **Używanie aplikacji**:
   - Wprowadź prostą instrukcję, np.: "stwórz chatbota który będzie generować obrazy"
   - Naciśnij "Wyślij" lub Enter
   - Otrzymasz szczegółową, techniczną wersję swojej instrukcji

## 📝 Przykłady

**Wejście:**
```
stwórz aplikację do zarządzania zadaniami
```

**Wyjście:**
```
Stwórz kompleksową aplikację do zarządzania zadaniami (Task Management System) 
z wykorzystaniem architektury full-stack. Backend zbuduj w Node.js z frameworkiem 
Express.js, wykorzystaj bazę danych PostgreSQL z Prisma ORM do zarządzania danymi. 
Frontend stwórz w React.js z TypeScript, zastosuj Tailwind CSS do stylizacji...
```

## 🛠️ Instalacja i uruchomienie

### Opcja 1: Bezpośrednio w przeglądarce
1. Otwórz plik `index.html` w przeglądarce
2. Skonfiguruj klucz API OpenAI
3. Zacznij używać aplikacji!

### Opcja 2: Z serwerem lokalnym
```bash
# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev

# Lub uruchom serwer produkcyjny
npm start
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

## 🔧 Wymagania

- Przeglądarka internetowa z obsługą JavaScript ES6+
- Klucz API OpenAI (można uzyskać na [platform.openai.com](https://platform.openai.com))
- Node.js (opcjonalnie, do uruchomienia serwera lokalnego)

## 🔒 Bezpieczeństwo

- Klucz API jest przechowywany lokalnie w przeglądarce (localStorage)
- Komunikacja z API OpenAI odbywa się bezpośrednio z przeglądarki
- Nie przechowujemy żadnych danych na serwerze

## 📱 Funkcjonalności techniczne

- **Responsywny design** - dopasowuje się do różnych rozmiarów ekranu
- **Obsługa klawiatury** - Enter do wysłania, Shift+Enter do nowej linii
- **Licznik znaków** - ograniczenie do 500 znaków na wiadomość
- **Loading state** - wizualne wskazanie przetwarzania
- **Obsługa błędów** - informowanie o problemach z API
- **Auto-scroll** - automatyczne przewijanie do najnowszych wiadomości

## 🎨 Technologie

- **Frontend**: HTML5, CSS3 (z animacjami), Vanilla JavaScript
- **API**: OpenAI GPT-4
- **Styling**: Custom CSS z gradientami i efektami blur
- **Storage**: localStorage do przechowywania klucza API

## 📄 Licencja

MIT License - zobacz [LICENSE](LICENSE) dla szczegółów.

## 🤝 Współtworzenie

1. Fork tego repozytorium
2. Stwórz branch dla swojej funkcjonalności (`git checkout -b feature/AmazingFeature`)
3. Commit swoje zmiany (`git commit -m 'Add some AmazingFeature'`)
4. Push do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📞 Kontakt

Artur Wyrosłak - [GitHub](https://github.com/arturwyroslak)

Link do projektu: [https://github.com/arturwyroslak/prompt-for-apps](https://github.com/arturwyroslak/prompt-for-apps)