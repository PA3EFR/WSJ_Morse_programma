// Multilingual Support for Morse Code Training App

class TranslationEngine {
    constructor() {
        this.currentLanguage = 'nl';
        this.translations = {
            // Dutch (Nederlands)
            nl: {
                title: "Jamboree On The Air Morse Challenge",
                subtitle: "Test samen of alleen je morse kennis. Succes, namens de Plusscouts PA3EFR/J",
                tab_game: "🎯 MORSE GAME",
                tab_reference: "📚 Referentie",
                tab_settings: "⚙️ Instellingen",
                morse_challenge: "Morse Challenge",
                rules_title: "📋 Spelregels",
                rule_1: "🎯 Alleen letters A-Z (geen cijfers of leestekens)",
                // Character set descriptions (used in dynamic rules dropdown)
                mode_letters_only: "Karakters: <strong>Alleen Letters (A-Z)</strong>",
                mode_letters_numbers: "Karakters: <strong>Letters en Cijfers (A-Z, 0-9)</strong>",
                mode_letters_numbers_punct: "Karakters: <strong>Letters, Cijfers en Leestekens</strong>",
                rule_2: "⏰ Denktijd wordt <strong>korter per juist antwoord</strong>",
                rule_3: "❌ Verkeerd antwoord of timeout = game over",
                rule_4: "💀 1 leven = direct game over bij fout",
                rule_5: "🏆 High score = aantal juiste letters!",
                click_start: "Klik op 'Start Game'",
                type_letter: "Type een letter (auto-submit)...",
                auto_submit_info: "💡 Type gewoon een letter - automatisch verzonden!",
                start_game: "Start Game",
                high_scores: "🏆 High Scores",
                clear_scores: "🗑️ Wis",
                export_scores: "💾 Export",
                settings_title: "⚙️ Instellingen",
                morse_speed: "Morse Snelheid (WPM):",
                tone_frequency: "Toon Frequentie (Hz):",
                volume: "Volume:",
                visual_feedback: "Visuele feedback tijdens afspelen",
                reset_settings: "🔄 Reset naar Standaard",
                local_storage_note: "High scores worden lokaal opgeslagen, niet op internet !",
                // Game messages
                what_letter_time: "Wat is deze letter? ({time}s denktijd)",
                correct_answer: "✅ <strong>Correct!</strong> Het was inderdaad '<strong>{char}</strong>' (Score: {score})",
                wrong_answer: "❌ <strong>Fout!</strong><br>Het juiste antwoord was: '<strong style='color: #059669; font-size: 1.2em;'>{correct}</strong>'<br>Jij antwoordde: '<strong style='color: #dc2626;'>{wrong}</strong>'<br>",
                timeout_answer: "⏰ <strong>Tijd op!</strong><br>Het juiste antwoord was: '<strong style='color: #059669; font-size: 1.2em;'>{correct}</strong>'<br>",
                game_over: "💀 Game Over! Score: {score} letters",
                try_again: "Probeer het nogmaals voor een high score!",
                congratulations: "🏆 Gefeliciteerd!",
                enter_name: "Voer je naam in voor de high score lijst:",
                added_to_scores: "Je bent toegevoegd aan de high scores als '{name}'!",
                no_scores_yet: "Nog geen high scores...",
                admin_password_prompt: "Voer het admin wachtwoord in om high scores te wissen (hint: Callsign Designer):",
                wrong_password: "Onjuist wachtwoord! High scores kunnen niet gewist worden.",
                confirm_clear: "Weet je zeker dat je alle high scores wilt wissen?",
                scores_cleared: "High scores zijn gewist.",
                no_answer: "geen antwoord"
            },
            
            // German (Deutsch)
            de: {
                title: "Jamboree On The Air Morse Challenge",
                subtitle: "Teste dein Morse-Wissen allein oder zusammen. Viel Erfolg, von den Plusscouts PA3EFR/J",
                tab_game: "🎯 MORSE SPIEL",
                tab_reference: "📚 Referenz",
                tab_settings: "⚙️ Einstellungen",
                morse_challenge: "Morse Challenge",
                rules_title: "📋 Spielregeln",
                rule_1: "🎯 Nur Buchstaben A-Z (keine Zahlen oder Zeichen)",
                // Character set descriptions (used in dynamic rules dropdown)
                mode_letters_only: "Zeichen: <strong>Nur Buchstaben (A-Z)</strong>",
                mode_letters_numbers: "Zeichen: <strong>Buchstaben und Zahlen (A-Z, 0-9)</strong>",
                mode_letters_numbers_punct: "Zeichen: <strong>Buchstaben, Zahlen und Sonderzeichen</strong>",
                rule_2: "⏰ Denkzeit wird <strong>kürzer bei jeder richtigen Antwort</strong>",
                rule_3: "❌ Falsche Antwort oder Timeout = Spiel vorbei",
                rule_4: "💀 1 Leben = Sofort Game Over bei Fehler",
                rule_5: "🏆 High Score = Anzahl richtiger Buchstaben!",
                click_start: "Klicke auf 'Spiel Starten'",
                type_letter: "Gib einen Buchstaben ein (Auto-Submit)...",
                auto_submit_info: "💡 Gib einfach einen Buchstaben ein - automatisch gesendet!",
                start_game: "Spiel Starten",
                high_scores: "🏆 Bestenliste",
                clear_scores: "🗑️ Löschen",
                export_scores: "💾 Export",
                settings_title: "⚙️ Einstellungen",
                morse_speed: "Morse Geschwindigkeit (WPM):",
                tone_frequency: "Ton Frequenz (Hz):",
                volume: "Lautstärke:",
                visual_feedback: "Visuelles Feedback während Wiedergabe",
                reset_settings: "🔄 Auf Standard zurücksetzen",
                local_storage_note: "Bestenliste wird lokal gespeichert, nicht im Internet!",
                // Game messages
                what_letter_time: "Welcher Buchstabe ist das? ({time}s Denkzeit)",
                correct_answer: "✅ <strong>Richtig!</strong> Es war tatsächlich '<strong>{char}</strong>' (Punkte: {score})",
                wrong_answer: "❌ <strong>Falsch!</strong><br>Die richtige Antwort war: '<strong style='color: #059669; font-size: 1.2em;'>{correct}</strong>'<br>Du hast geantwortet: '<strong style='color: #dc2626;'>{wrong}</strong>'<br>",
                timeout_answer: "⏰ <strong>Zeit abgelaufen!</strong><br>Die richtige Antwort war: '<strong style='color: #059669; font-size: 1.2em;'>{correct}</strong>'<br>",
                game_over: "💀 Spiel vorbei! Punkte: {score} Buchstaben",
                try_again: "Versuche es nochmal für einen High Score!",
                congratulations: "🏆 Herzlichen Glückwunsch!",
                enter_name: "Gib deinen Namen für die Bestenliste ein:",
                added_to_scores: "Du wurdest als '{name}' zur Bestenliste hinzugefügt!",
                no_scores_yet: "Noch keine Bestenliste...",
                admin_password_prompt: "Gib das Admin-Passwort ein um die Bestenliste zu löschen (Hinweis: Callsign Designer):",
                wrong_password: "Falsches Passwort! Bestenliste kann nicht gelöscht werden.",
                confirm_clear: "Bist du sicher, dass du die gesamte Bestenliste löschen willst?",
                scores_cleared: "Bestenliste wurde gelöscht.",
                no_answer: "keine Antwort"
            },
            
            // English
            en: {
                title: "Jamboree On The Air Morse Challenge",
                subtitle: "Test your morse knowledge together or alone. Good luck, from the Plusscouts PA3EFR/J",
                tab_game: "🎯 MORSE GAME",
                tab_reference: "📚 Reference",
                tab_settings: "⚙️ Settings",
                morse_challenge: "Morse Challenge",
                rules_title: "📋 Game Rules",
                rule_1: "🎯 Only letters A-Z (no numbers or punctuation)",
                // Character set descriptions (used in dynamic rules dropdown)
                mode_letters_only: "Characters: <strong>Letters Only (A-Z)</strong>",
                mode_letters_numbers: "Characters: <strong>Letters and Numbers (A-Z, 0-9)</strong>",
                mode_letters_numbers_punct: "Characters: <strong>Letters, Numbers and Punctuation</strong>",
                rule_2: "⏰ Think time gets <strong>shorter with each correct answer</strong>",
                rule_3: "❌ Wrong answer or timeout = game over",
                rule_4: "💀 1 life = instant game over on mistake",
                rule_5: "🏆 High score = number of correct letters!",
                click_start: "Click 'Start Game'",
                type_letter: "Type a letter (auto-submit)...",
                auto_submit_info: "💡 Just type a letter - automatically submitted!",
                start_game: "Start Game",
                high_scores: "🏆 High Scores",
                clear_scores: "🗑️ Clear",
                export_scores: "💾 Export",
                settings_title: "⚙️ Settings",
                morse_speed: "Morse Speed (WPM):",
                tone_frequency: "Tone Frequency (Hz):",
                volume: "Volume:",
                visual_feedback: "Visual feedback during playback",
                reset_settings: "🔄 Reset to Default",
                local_storage_note: "High scores are stored locally, not on the internet!",
                // Game messages
                what_letter_time: "What is this letter? ({time}s think time)",
                correct_answer: "✅ <strong>Correct!</strong> It was indeed '<strong>{char}</strong>' (Score: {score})",
                wrong_answer: "❌ <strong>Wrong!</strong><br>The correct answer was: '<strong style='color: #059669; font-size: 1.2em;'>{correct}</strong>'<br>You answered: '<strong style='color: #dc2626;'>{wrong}</strong>'<br>",
                timeout_answer: "⏰ <strong>Time's up!</strong><br>The correct answer was: '<strong style='color: #059669; font-size: 1.2em;'>{correct}</strong>'<br>",
                game_over: "💀 Game Over! Score: {score} letters",
                try_again: "Try again for a high score!",
                congratulations: "🏆 Congratulations!",
                enter_name: "Enter your name for the high score list:",
                added_to_scores: "You've been added to the high scores as '{name}'!",
                no_scores_yet: "No high scores yet...",
                admin_password_prompt: "Enter admin password to clear high scores (hint: Callsign Designer):",
                wrong_password: "Wrong password! High scores cannot be cleared.",
                confirm_clear: "Are you sure you want to clear all high scores?",
                scores_cleared: "High scores have been cleared.",
                no_answer: "no answer"
            },
            
            // French (Français)
            fr: {
                title: "Jamboree On The Air Morse Challenge",
                subtitle: "Testez vos connaissances morse ensemble ou seul. Bonne chance, des Plusscouts PA3EFR/J",
                tab_game: "🎯 JEU MORSE",
                tab_reference: "📚 Référence",
                tab_settings: "⚙️ Paramètres",
                morse_challenge: "Défi Morse",
                rules_title: "📋 Règles du Jeu",
                rule_1: "🎯 Seulement lettres A-Z (pas de chiffres ou ponctuation)",
                // Character set descriptions (used in dynamic rules dropdown)
                mode_letters_only: "Caractères: <strong>Lettres uniquement (A-Z)</strong>",
                mode_letters_numbers: "Caractères: <strong>Lettres et chiffres (A-Z, 0-9)</strong>",
                mode_letters_numbers_punct: "Caractères: <strong>Lettres, chiffres et ponctuation</strong>",
                rule_2: "⏰ Temps de réflexion devient <strong>plus court à chaque bonne réponse</strong>",
                rule_3: "❌ Mauvaise réponse ou timeout = fin de partie",
                rule_4: "💀 1 vie = fin immédiate en cas d'erreur",
                rule_5: "🏆 Meilleur score = nombre de lettres correctes!",
                click_start: "Cliquez sur 'Démarrer'",
                type_letter: "Tapez une lettre (soumission auto)...",
                auto_submit_info: "💡 Tapez simplement une lettre - envoyé automatiquement!",
                start_game: "Démarrer le Jeu",
                high_scores: "🏆 Meilleurs Scores",
                clear_scores: "🗑️ Effacer",
                export_scores: "💾 Export",
                settings_title: "⚙️ Paramètres",
                morse_speed: "Vitesse Morse (MPM):",
                tone_frequency: "Fréquence du Ton (Hz):",
                volume: "Volume:",
                visual_feedback: "Retour visuel pendant la lecture",
                reset_settings: "🔄 Réinitialiser par Défaut",
                local_storage_note: "Les meilleurs scores sont stockés localement, pas sur internet!",
                // Game messages
                what_letter_time: "Quelle est cette lettre? ({time}s de réflexion)",
                correct_answer: "✅ <strong>Correct!</strong> C'était bien '<strong>{char}</strong>' (Score: {score})",
                wrong_answer: "❌ <strong>Faux!</strong><br>La bonne réponse était: '<strong style='color: #059669; font-size: 1.2em;'>{correct}</strong>'<br>Vous avez répondu: '<strong style='color: #dc2626;'>{wrong}</strong>'<br>",
                timeout_answer: "⏰ <strong>Temps écoulé!</strong><br>La bonne réponse était: '<strong style='color: #059669; font-size: 1.2em;'>{correct}</strong>'<br>",
                game_over: "💀 Fin de Partie! Score: {score} lettres",
                try_again: "Réessayez pour un meilleur score!",
                congratulations: "🏆 Félicitations!",
                enter_name: "Entrez votre nom pour la liste des meilleurs scores:",
                added_to_scores: "Vous avez été ajouté aux meilleurs scores comme '{name}'!",
                no_scores_yet: "Pas encore de meilleurs scores...",
                admin_password_prompt: "Entrez le mot de passe admin pour effacer les scores (indice: Callsign Designer):",
                wrong_password: "Mauvais mot de passe! Les scores ne peuvent pas être effacés.",
                confirm_clear: "Êtes-vous sûr de vouloir effacer tous les meilleurs scores?",
                scores_cleared: "Les meilleurs scores ont été effacés.",
                no_answer: "aucune réponse"
            },
            
            // Spanish (Español)
            es: {
                title: "Jamboree On The Air Morse Challenge",
                subtitle: "Prueba tu conocimiento morse juntos o solo. Buena suerte, de los Plusscouts PA3EFR/J",
                tab_game: "🎯 JUEGO MORSE",
                tab_reference: "📚 Referencia",
                tab_settings: "⚙️ Ajustes",
                morse_challenge: "Desafío Morse",
                rules_title: "📋 Reglas del Juego",
                rule_1: "🎯 Solo letras A-Z (sin números o puntuación)",
                // Character set descriptions (used in dynamic rules dropdown)
                mode_letters_only: "Caracteres: <strong>Solo letras (A-Z)</strong>",
                mode_letters_numbers: "Caracteres: <strong>Letras y números (A-Z, 0-9)</strong>",
                mode_letters_numbers_punct: "Caracteres: <strong>Letras, números y puntuación</strong>",
                rule_2: "⏰ Tiempo de reflexión se vuelve <strong>más corto con cada respuesta correcta</strong>",
                rule_3: "❌ Respuesta incorrecta o timeout = fin del juego",
                rule_4: "💀 1 vida = fin inmediato del juego en error",
                rule_5: "🏆 Puntuación alta = número de letras correctas!",
                click_start: "Haz clic en 'Iniciar Juego'",
                type_letter: "Escribe una letra (envío automático)...",
                auto_submit_info: "💡 Solo escribe una letra - ¡enviado automáticamente!",
                start_game: "Iniciar Juego",
                high_scores: "🏆 Mejores Puntuaciones",
                clear_scores: "🗑️ Borrar",
                export_scores: "💾 Exportar",
                settings_title: "⚙️ Ajustes",
                morse_speed: "Velocidad Morse (PPM):",
                tone_frequency: "Frecuencia del Tono (Hz):",
                volume: "Volumen:",
                visual_feedback: "Retroalimentación visual durante reproducción",
                reset_settings: "🔄 Restablecer por Defecto",
                local_storage_note: "¡Las mejores puntuaciones se almacenan localmente, no en internet!",
                // Game messages
                what_letter_time: "¿Qué letra es esta? ({time}s de reflexión)",
                correct_answer: "✅ <strong>¡Correcto!</strong> Era realmente '<strong>{char}</strong>' (Puntuación: {score})",
                wrong_answer: "❌ <strong>¡Incorrecto!</strong><br>La respuesta correcta era: '<strong style='color: #059669; font-size: 1.2em;'>{correct}</strong>'<br>Tú respondiste: '<strong style='color: #dc2626;'>{wrong}</strong>'<br>",
                timeout_answer: "⏰ <strong>¡Se acabó el tiempo!</strong><br>La respuesta correcta era: '<strong style='color: #059669; font-size: 1.2em;'>{correct}</strong>'<br>",
                game_over: "💀 ¡Fin del Juego! Puntuación: {score} letras",
                try_again: "¡Inténtalo de nuevo para una puntuación alta!",
                congratulations: "🏆 ¡Felicidades!",
                enter_name: "Ingresa tu nombre para la lista de mejores puntuaciones:",
                added_to_scores: "¡Has sido añadido a las mejores puntuaciones como '{name}'!",
                no_scores_yet: "Aún no hay mejores puntuaciones...",
                admin_password_prompt: "Ingresa la contraseña de admin para borrar puntuaciones (pista: Callsign Designer):",
                wrong_password: "¡Contraseña incorrecta! Las puntuaciones no pueden ser borradas.",
                confirm_clear: "¿Estás seguro de que quieres borrar todas las mejores puntuaciones?",
                scores_cleared: "Las mejores puntuaciones han sido borradas.",
                no_answer: "sin respuesta"
            }
        };
        
        // Load saved language or default to Dutch
        this.loadLanguage();
    }
    
    /**
     * Load language preference from localStorage
     */
    loadLanguage() {
        const saved = localStorage.getItem('selectedLanguage');
        if (saved && this.translations[saved]) {
            this.currentLanguage = saved;
        }
    }
    
    /**
     * Save language preference to localStorage
     */
    saveLanguage() {
        localStorage.setItem('selectedLanguage', this.currentLanguage);
    }
    
    /**
     * Set current language
     * @param {string} lang - Language code (nl, de, en, fr, es)
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            this.saveLanguage();
            this.updateUI();
            
            // Update HTML lang attribute
            document.documentElement.lang = lang;
        }
    }
    
    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    /**
     * Get translation for key
     * @param {string} key - Translation key
     * @param {Object} params - Parameters for string interpolation
     * @returns {string} Translated text
     */
    t(key, params = {}) {
        let text = this.translations[this.currentLanguage][key] || this.translations['nl'][key] || key;
        
        // Replace parameters in text
        Object.keys(params).forEach(param => {
            text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
        });
        
        return text;
    }
    
    /**
     * Update all UI elements with current language
     */
    updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.innerHTML = this.t(key);
        });
        
        // Update all elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // Update language selector buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === this.currentLanguage) {
                btn.classList.add('active');
            }
        });
    }
    
    /**
     * Initialize language selector
     */
    initLanguageSelector() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setLanguage(btn.dataset.lang);
            });
        });
        
        // Set initial state
        this.updateUI();
    }
}

// Global translation engine instance
window.i18n = new TranslationEngine();

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.i18n.initLanguageSelector();
    });
} else {
    window.i18n.initLanguageSelector();
}