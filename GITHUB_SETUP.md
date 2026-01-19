# WSJ Morse Programma - GitHub Repository Setup

## Snelle Start

### Stap 1: Maak een GitHub account aan
Ga naar https://github.com en maak een account aan als je nog geen account hebt.

### Stap 2: Maak een nieuwe repository aan
1. Ga naar https://github.com/new
2. Repository name: `WSJ_Morse_programma`
3. Kies "Public" of "Private"
4. Klik op "Create repository"

### Stap 3: Upload de bestanden
Kies één van deze methoden:

#### Methode A: Via GitHub website
1. Klik op "uploading an existing file"
2. Sleep alle bestanden uit de `/workspace/morse_program/` map naar de upload pagina
3. Klik op "Commit changes"

#### Methode B: Via Git command line
```bash
cd /workspace/morse_program
git init
git add .
git commit -m "Initial commit: WSJ Morse Programma"
git branch -M main
git remote add origin https://github.com/JOUW_GEBRUIKERSNAAM/WSJ_Morse_programma.git
git push -u origin main
```

### Stap 4: Start de build
1. Ga naar je repository op GitHub
2. Klik op het "Actions" tabblad
3. Je ziet de workflow "Build Windows Executable"
4. Klik op "Run workflow" om de build te starten

### Stap 5: Download de .exe
1. Na de build, ga naar het "Actions" tabblad
2. Klik op de completed workflow run
3. Onder "Artifacts" vind je "WSJ_Morse_Programma_Windows"
4. Klik om de .exe te downloaden

## Wat er gebeurt

De GitHub Action zal:
1. ✅ Een Windows machine opstarten
2. ✅ Node.js 20 installeren
3. ✅ Alle dependencies installeren
4. ✅ De Windows .exe compileren
5. ✅ Een downloadbaar bestand maken

## Resultaat

Na de build vind je in de `dist/` map:
- `WSJ_Morse_Programma_Setup.exe` - Installatieprogramma dat je kunt delen

## Installatie

1. Download `WSJ_Morse_Programma_Setup.exe`
2. Dubbelklik om te installeren
3. Volg de installatiewizard
4. De applicatie wordt toegevoegd aan je startmenu en desktop

## Updates

Als je wijzigingen wilt maken:
1. Bewerk de bestanden lokaal
2. Upload de gewijzigde bestanden naar GitHub
3. De workflow wordt automatisch opnieuw uitgevoerd
4. Download de nieuwe .exe

## Vereisten

- GitHub account (gratis)
- Internetverbinding voor de build
- Ongeveer 2-5 minuten voor de build

## Ondersteunde Windows versies

- Windows 10 (64-bit)
- Windows 11 (64-bit)
