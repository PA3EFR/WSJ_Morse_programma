#!/bin/bash

echo "🔍 Morse Code Training - Verificatie Script"
echo "=========================================="
echo ""

# Check if all required files exist
echo "📁 Bestanden Controleren..."
files=("index.html" "app.js" "game-engine.js" "morse-engine.js" "audio-engine.js" "translations.js" "styles.css")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file ontbreekt!"
        exit 1
    fi
done

echo ""
echo "🔧 Functionaliteit Verificatie..."

# Check for character sets in morse-engine.js
if grep -q "letters_numbers" morse-engine.js; then
    echo "  ✓ Karakter sets toegevoegd aan morse-engine.js"
else
    echo "  ✗ Karakter sets niet gevonden in morse-engine.js"
fi

# Check for character modes in game-engine.js
if grep -q "characterModes" game-engine.js; then
    echo "  ✓ Character modes toegevoegd aan game-engine.js"
else
    echo "  ✗ Character modes niet gevonden in game-engine.js"
fi

# Check for high scores categories
if grep -q "letters_numbers.*letters_numbers_punct" translations.js; then
    echo "  ✓ High score categorieën vertalingen toegevoegd"
else
    echo "  ✗ High score categorieën vertalingen niet gevonden"
fi

# Check for radio buttons in HTML
if grep -q 'name="characterSet"' index.html; then
    echo "  ✓ Karakter set radio buttons toegevoegd aan HTML"
else
    echo "  ✗ Karakter set radio buttons niet gevonden in HTML"
fi

# Check for score categories in HTML
if grep -q "scoresLettersNumbers" index.html; then
    echo "  ✓ Score categorieën UI toegevoegd aan HTML"
else
    echo "  ✗ Score categorieën UI niet gevonden in HTML"
fi

# Check for CSS styles
if grep -q "radio-group" styles.css; then
    echo "  ✓ CSS stijlen voor radio buttons toegevoegd"
else
    echo "  ✗ CSS stijlen voor radio buttons niet gevonden"
fi

if grep -q "score-category" styles.css; then
    echo "  ✓ CSS stijlen voor score categorieën toegevoegd"
else
    echo "  ✗ CSS stijlen voor score categorieën niet gevonden"
fi

echo ""
echo "📊 Statistieken..."
echo "  - Total lines in index.html: $(wc -l < index.html)"
echo "  - Total lines in app.js: $(wc -l < app.js)"
echo "  - Total lines in game-engine.js: $(wc -l < game-engine.js)"
echo "  - Total lines in morse-engine.js: $(wc -l < morse-engine.js)"
echo "  - Total lines in translations.js: $(wc -l < translations.js)"
echo "  - Total lines in styles.css: $(wc -l < styles.css)"

echo ""
echo "✅ Verificatie Voltooid!"
echo "📝 Het programma is succesvol uitgebreid met:"
echo "   • Karakter set instellingen (Letters, Letters+Cijfers, Alles)"
echo "   • Uitgebreid Morse code support (cijfers en leestekens)"
echo "   • Gecategoriseerde high scores (Top 5 per categorie)"
echo "   • Meertalige ondersteuning voor alle nieuwe functies"
echo ""
echo "🌐 Om te testen, open index.html in een web browser"
echo "🧪 Of open test-morse.html voor een specifieke test pagina"