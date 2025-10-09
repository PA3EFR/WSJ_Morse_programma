# 📡 Morse Code Training - Modern Web Versie

Een moderne webversie van het klassieke DOS morse code training programma, met behoud van de originele competitieve gameplay.

## 🎯 Features

### **Competitieve DOS-stijl Game**
- **Letters A-Z alleen** (geen cijfers/leestekens, zoals origineel)
- **Progressieve moeilijkheid**: denktijd wordt korter per juist antwoord
- **3-levens systeem**: fout antwoord of timeout = leven verloren
- **High Score systeem**: compatible met originele Score.txt formaat
- **Real-time audio**: Web Audio API morse code signalen

### **Extra Functionaliteiten**
- **Encoder/Decoder**: tekst ↔ morse code conversie
- **Oefenmodus**: rustig oefenen zonder tijdsdruk
- **Configureerbaar**: snelheid (WPM), frequentie, volume
- **Responsive design**: werkt op desktop en mobiel
- **Keyboard shortcuts**: voor snelle navigatie

## 🚀 Hoe te gebruiken

1. Open `index.html` in een moderne webbrowser
2. Klik op **"🎯 DOS Challenge"** voor de competitieve ervaring
3. Druk **"Start Competitieve Game"**
4. Luister naar de morse code en type de letter
5. Probeer zo lang mogelijk vol te houden!

### **Spelregels (zoals DOS origineel)**
- Start met 5 seconden denktijd
- Elke juiste letter vermindert de denktijd met 0.1 seconde
- Minimum denktijd: 1 seconde
- 3 levens totaal
- High score alleen bij goede prestaties

## 🎵 Audio Requirements

- **Moderne browser** met Web Audio API support
- **User interaction** vereist voor audio (browser autoplay policy)
- Click op de pagina om audio te activeren

## 📁 Bestanden

- `index.html` - Hoofd HTML bestand
- `styles.css` - Styling en responsive design
- `app.js` - Hoofd applicatie logica
- `morse-engine.js` - Morse code conversie engine
- `audio-engine.js` - Web Audio API implementatie
- `game-engine.js` - Competitieve game logica (DOS-stijl)

## 🏆 High Scores

High scores worden opgeslagen in browser localStorage in het formaat:
```
"SPELER","2025-01-15",1250
"LIANNE","2025-01-14",945
```

Exporteer naar `morse-scores.txt` voor backup.

## ⌨️ Keyboard Shortcuts

- **Spatie**: Herhaal huidige morse code
- **Escape**: Stop audio
- **1-5**: Schakel tussen tabs
- **Enter**: Submit antwoord (in game)

## 🔧 Technische Details

- **Geen server vereist**: Pure client-side JavaScript
- **Web Audio API**: Real-time morse code generatie
- **localStorage**: Persistente high scores en instellingen
- **Responsive CSS**: Mobile-first design
- **ES6+ JavaScript**: Moderne browser features

## 📱 Browser Compatibiliteit

- Chrome 66+
- Firefox 60+
- Safari 11.1+
- Edge 79+

## 🎮 Original DOS Program

Dit is een moderne web-implementatie gebaseerd op het originele DOS programma:
- `MORSE.BAT` - Launcher script
- `MORSE.BAS` - GW-BASIC programma
- `Score.txt` - High score bestand

**Auteur**: MiniMax Agent  
**Licentie**: Open source  
**Versie**: 1.0