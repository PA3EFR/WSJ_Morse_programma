# Wijzigingen DOS Morse Code Challenge

## Doorgevoerde Aanpassingen:

### 1. Vereenvoudigde Interface
- ❌ **Encoder/Decoder tab** weggehaald
- ❌ **Oefenen tab** weggehaald  
- ✅ Alleen **DOS Challenge** en **Instellingen** tabs behouden
- ✅ **DOS Challenge** is nu de standaard startpagina

### 2. Highscores Altijd Zichtbaar
- ✅ **Highscores permanent zichtbaar** aan de rechterkant van het DOS Challenge scherm
- ✅ **Sidebar layout** toegevoegd met responsive design
- ✅ Highscores worden direct geladen bij het opstarten

### 3. Eenvoudiger Levensysteem
- ❌ **3 levens** vervangen door **1 leven**
- ✅ **Direct game over** bij verkeerd antwoord of timeout
- ✅ Spelregels aangepast om dit duidelijk te maken

### 4. Progressiebalk Omgedraaid
- ❌ **Oude logica**: balk liep van rechts naar links (krimpend)
- ✅ **Nieuwe logica**: balk loopt van links naar rechts (groeiend van 0% naar 100%)
- ✅ **Kleurenlogica aangepast**: groen → geel → rood naarmate de tijd vordert

### 5. Eenvoudige Score Logica
- ❌ **Complexe puntentelling** met tijdbonus, moeilijkheidsbonus, etc.
- ✅ **Simpel systeem**: Score = aantal juiste letters
- ✅ Highscores tonen nu "X letters" in plaats van "X punten"
- ✅ Game-over bericht toont "Juiste Letters" in plaats van "Finale Score"

### 6. Interface Aanpassingen
- ✅ **Grid layout** voor game + sidebar
- ✅ **Responsive design** voor kleinere schermen
- ✅ Skip knop aangepast naar "Skip (game over)" omdat er maar 1 leven is
- ✅ Game info toont "Juiste Letters" en "Leven" (enkelvoud)

### 7. Code Opschoning
- ❌ Alle encoder/decoder functionaliteit verwijderd
- ❌ Alle training/oefenen functionaliteit verwijderd
- ❌ Complexe score berekening functies verwijderd
- ✅ Keyboard shortcuts vereenvoudigd (alleen game en settings)
- ✅ Tab navigatie vereenvoudigd

## Resultaat:
Een gestroomlijnde, puur competitieve Morse Code challenge die exact de functionaliteit van het originele DOS programma nabootst:
- Alleen letters A-Z
- Progressief snellere tijdslimieten  
- 1 leven (direct game over bij fout)
- Eenvoudige score (aantal juiste letters)
- Altijd zichtbare highscore lijst
- Moderne web interface met DOS-feel