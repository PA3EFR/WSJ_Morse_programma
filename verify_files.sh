#!/bin/bash

# Morse Code Program File Verifier
# Dit script controleert of alle bestanden de correcte karakterset bevatten

echo "=== MORSE CODE PROGRAM VERIFICATIE ==="
echo ""
echo "Verwachte karakterset: ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?/:;=+-"
echo "(Geen ' @ _ ¿ ¡ ')"
echo ""

ERRORS=0

# Check for forbidden characters in JavaScript files (except translations.js and backup files)
echo "1. Controleren op verboden karakters in game-engine.js..."
if grep -q "letters_numbers_punct.*['@_¿¡]" game-engine.js 2>/dev/null; then
    echo "   FOUT: game-engine.js bevat verboden karakters!"
    grep "letters_numbers_punct" game-engine.js
    ERRORS=$((ERRORS + 1))
else
    echo "   OK: game-engine.js is correct"
    grep "letters_numbers_punct" game-engine.js | head -1
fi
echo ""

echo "2. Controleren op verboden karakters in morse-engine.js..."
if grep -q "['@_¿¡]" morse-engine.js 2>/dev/null; then
    echo "   FOUT: morse-engine.js bevat verboden karakters!"
    grep "['@_¿¡]" morse-engine.js
    ERRORS=$((ERRORS + 1))
else
    echo "   OK: morse-engine.js is correct"
fi
echo ""

echo "3. Controleren op verboden karakters in app.js..."
if grep -q "letters_numbers_punct.*['@_¿¡]" app.js 2>/dev/null; then
    echo "   FOUT: app.js bevat verboden karakters!"
    grep "letters_numbers_punct" app.js
    ERRORS=$((ERRORS + 1))
else
    echo "   OK: app.js is correct"
fi
echo ""

echo "4. Controleren op verboden karakters in index.html..."
if grep -q "punctuationReference" index.html; then
    if grep -A 20 "punctuationReference" index.html | grep -E "['@_¿¡]" > /dev/null 2>&1; then
        echo "   FOUT: index.html bevat verboden karakters in referentie sectie!"
        grep -A 20 "punctuationReference" index.html | grep -E "['@_¿¡]"
        ERRORS=$((ERRORS + 1))
    else
        echo "   OK: index.html is correct"
    fi
else
    echo "   WAARSCHUWING: Kon punctuationReference niet vinden in index.html"
fi
echo ""

echo "=== SAMENVATTING ==="
if [ $ERRORS -eq 0 ]; then
    echo "Alle bestanden zijn CORRECT!"
    echo ""
    echo "Als je nog steeds '¿' ziet tijdens het spelen:"
    echo "1. Wis je browser cache (Ctrl+Shift+R of Ctrl+F5)"
    echo "2. Wis localStorage: Druk F12 → Console → typ: localStorage.clear() → Enter"
    echo "3. Refresh de pagina opnieuw"
    exit 0
else
    echo "FOUTEN GEVONDEN: $ERRORS problemen moeten worden opgelost!"
    echo "Download een nieuwe versie van de bestanden."
    exit 1
fi
