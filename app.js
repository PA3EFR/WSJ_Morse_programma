// Main Application - DOS Style Competitive Morse Code Training - Multilingual Version

class MorseApp {
    constructor() {
        // Security settings
        this.adminPassword = 'PA3EFR'; // Verander dit naar je eigen wachtwoord
        
        // Initialize engines
        this.morseEngine = new MorseEngine();
        this.audioEngine = new AudioEngine();
        this.gameEngine = new GameEngine(this.morseEngine, this.audioEngine);
        
        // UI state
        this.currentTab = 'game';  // Start with game tab
        this.timerDisplay = null;
        this.gameActive = false;
        
        // Initialize UI
        this.initializeUI();
        this.loadSettings();
        this.updateMorseReference();
        
        console.log('📻 Jamboree On The Air Morse Challenge geladen!');
    }
    
    /**
     * Initialize all UI event handlers
     */
    initializeUI() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Game functionality (main DOS-style competitive mode)
        this.initGame();
        
        // Settings
        this.initSettings();
        
        // High Scores
        this.initHighScores();
        
        // Keyboard shortcuts
        this.initKeyboardShortcuts();
        
        // Load high scores immediately (always visible in sidebar)
        this.updateHighScoresDisplay();
        
        // Initialize character mode from radio buttons
        this.initCharacterMode();
    }
    
    /**
     * Switch between tabs
     */
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
        
        this.currentTab = tabName;
        
        // Stop any active audio when switching tabs
        this.audioEngine.stop();
        
        // Initialize reference tab if switching to it
        if (tabName === 'reference') {
            setTimeout(() => this.updateMorseReference(), 100);
        }
    }
    
    /**
     * Initialize main DOS-style competitive game
     */
    initGame() {
        const gameAnswer = document.getElementById('gameAnswer');
        
        // Start game button
        document.getElementById('startGame').addEventListener('click', () => {
            this.startCompetitiveGame();
        });
        
        // Auto-submit functionality - submit when letter is typed
        gameAnswer.addEventListener('input', (e) => {
            const value = e.target.value.trim().toUpperCase();
            if (value && /^[A-Z]$/.test(value)) {
                // Valid single letter typed - auto submit
                setTimeout(() => {
                    this.submitGameAnswer();
                }, 100); // Small delay for better UX
            }
        });
        
        // Prevent multiple character input
        gameAnswer.addEventListener('keydown', (e) => {
            // Allow backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) || 
                (e.keyCode === 67 && e.ctrlKey === true) || 
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true)) {
                return;
            }
            
            // Ensure that it is a letter and stop the keypress
            if (e.target.value.length >= 1 && (e.keyCode < 65 || e.keyCode > 90)) {
                e.preventDefault();
            }
        });
        
        // Clear input when focus - fresh start
        gameAnswer.addEventListener('focus', () => {
            gameAnswer.value = '';
        });
    }
    
    /**
     * Start the main competitive DOS-style game
     */
    startCompetitiveGame() {
        console.log('startCompetitiveGame() called');
        const gameResult = document.getElementById('gameResult');
        gameResult.textContent = '';
        gameResult.className = 'game-result';
        
        document.getElementById('gameAnswer').value = '';
        document.getElementById('gameAnswer').focus();
        
        this.gameActive = true;
        
        console.log('About to call gameEngine.startGame()');
        this.gameEngine.startGame(
            // onUpdate callback
            (gameState) => this.updateGameDisplay(gameState),
            // onEnd callback  
            (endState) => this.handleGameEnd(endState),
            // onTimeWarning callback
            (timeLeft) => this.showTimeWarning(timeLeft)
        );
        console.log('gameEngine.startGame() called successfully');
    }
    
    /**
     * Update game display during play - IMPROVED to show correct letter on wrong answer
     */
    updateGameDisplay(gameState) {
        // DEBUG: Log the complete gameState to see what we're getting
        console.log('updateGameDisplay called with gameState:', gameState);
        
        if (gameState.character && gameState.morse) {
            document.getElementById('gameQuestion').textContent = 
                window.i18n.t('what_letter_time', { time: (gameState.thinkTime / 1000).toFixed(1) });
            document.getElementById('gameMorse').textContent = gameState.morse;
        }
        
        // Handle result feedback with improved wrong answer display
        const gameResult = document.getElementById('gameResult');
        if (gameState.result === 'correct') {
            gameResult.innerHTML = window.i18n.t('correct_answer', { 
                char: gameState.character, 
                score: gameState.score 
            });
            gameResult.className = 'game-result correct';
        } else if (gameState.result === 'wrong') {
            // DEBUG: Log specific values
            console.log('Wrong answer detected:', {
                character: gameState.character,
                wrongAnswer: gameState.wrongAnswer,
                morse: gameState.morse
            });
            
            // Enhanced wrong answer feedback
            const feedbackHTML = window.i18n.t('wrong_answer', {
                correct: gameState.character,
                wrong: gameState.wrongAnswer || window.i18n.t('no_answer')
            });
            
            console.log('Setting gameResult.innerHTML to:', feedbackHTML);
            gameResult.innerHTML = feedbackHTML;
            gameResult.className = 'game-result wrong';
        } else if (gameState.result === 'timeout') {
            console.log('Timeout detected:', {
                character: gameState.character,
                morse: gameState.morse
            });
            
            const timeoutHTML = window.i18n.t('timeout_answer', {
                correct: gameState.character
            });
            
            console.log('Setting gameResult.innerHTML to:', timeoutHTML);
            gameResult.innerHTML = timeoutHTML;
            gameResult.className = 'game-result wrong';
        }
        
        // Clear input for next round
        if (gameState.result) {
            document.getElementById('gameAnswer').value = '';
        }
    }
    
    /**
     * Submit answer in competitive game
     */
    submitGameAnswer() {
        if (!this.gameActive) return;
        
        const answer = document.getElementById('gameAnswer').value.trim().toUpperCase();
        if (answer) {
            this.gameEngine.submitAnswer(answer);
        }
    }
    
    /**
     * Handle game end - FIXED: Don't overwrite existing feedback
     */
    async handleGameEnd(endState) {
        console.log('handleGameEnd called with endState:', endState);
        this.gameActive = false;
        
        const gameResult = document.getElementById('gameResult');
        
        // Get current content to preserve feedback
        const currentHTML = gameResult.innerHTML;
        let endMessage = ``;

        if (endState.qualified) {
            endMessage += window.i18n.t('congratulations') + ` `;
            
            // Ask for name
            const playerName = await this.promptForName();
            if (playerName) {
                this.gameEngine.addHighScore(playerName, endState.finalScore);
                endMessage += `\n` + window.i18n.t('added_to_scores', { name: playerName });
                this.updateHighScoresDisplay();
            }
        } else {
            endMessage += `\n\n` + window.i18n.t('game_over', { score: endState.finalScore });
            endMessage += `\n\n` + window.i18n.t('try_again');
        }
        
        // FIXED: Always append to existing feedback instead of replacing it
        if (currentHTML && currentHTML.trim() && !currentHTML.includes(window.i18n.t('click_start'))) {
            console.log('Appending end message to existing feedback');
            gameResult.innerHTML = currentHTML + `<br><br><hr style="margin: 20px 0;"><br>` + endMessage.replace(/\n/g, '<br>');
        } else {
            console.log('No existing feedback, setting end message only');
            gameResult.innerHTML = endMessage.replace(/\n/g, '<br>');
        }
        
        gameResult.className = endState.qualified ? 'game-result correct' : 'game-result wrong';
    }
    
    /**
     * Show time warning
     */
    showTimeWarning(timeLeft) {
        document.getElementById('gameQuestion').style.color = '#ef4444';
        setTimeout(() => {
            document.getElementById('gameQuestion').style.color = '';
        }, 300);
    }
    
    /**
     * Prompt user for name (simple prompt for now)
     */
    promptForName() {
        return new Promise((resolve) => {
            const name = prompt(window.i18n.t('enter_name'), 'SPELER');
            resolve(name ? name.trim() : null);
        });
    }
    
    /**
     * Initialize settings
     */
    initSettings() {
        const wpmSpeed = document.getElementById('wpmSpeed');
        const frequency = document.getElementById('frequency');
        const volume = document.getElementById('volume');
        const visualFeedback = document.getElementById('visualFeedback');
        
        // Update displays
        wpmSpeed.addEventListener('input', () => {
            document.getElementById('wpmDisplay').textContent = wpmSpeed.value + ' WPM';
            this.audioEngine.updateSettings({ wpm: parseInt(wpmSpeed.value) });
        });
        
        frequency.addEventListener('input', () => {
            document.getElementById('freqDisplay').textContent = frequency.value + ' Hz';
            this.audioEngine.updateSettings({ frequency: parseInt(frequency.value) });
        });
        
        volume.addEventListener('input', () => {
            document.getElementById('volumeDisplay').textContent = volume.value + '%';
            this.audioEngine.updateSettings({ volume: volume.value / 100 });
        });
        
        visualFeedback.addEventListener('change', () => {
            // Store visual feedback preference
            localStorage.setItem('morseVisualFeedback', visualFeedback.checked);
        });
        
        // Reset settings
        document.getElementById('resetSettings').addEventListener('click', () => {
            wpmSpeed.value = 15;
            frequency.value = 600;
            volume.value = 50;
            visualFeedback.checked = true;
            
            document.getElementById('wpmDisplay').textContent = '15 WPM';
            document.getElementById('freqDisplay').textContent = '600 Hz';
            document.getElementById('volumeDisplay').textContent = '50%';
            
            this.audioEngine.updateSettings({ wpm: 15, frequency: 600, volume: 0.5 });
        });
        
        // Character set radio buttons
        document.querySelectorAll('input[name="characterSet"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.gameEngine.setCharacterMode(e.target.value);
                this.updateHighScoresDisplay(); // Refresh scores for new category
            });
        });
    }
    
    /**
     * Initialize high scores display
     */
    initHighScores() {
        document.getElementById('clearScores').addEventListener('click', () => {
            // Password beveiliging voor high scores wissen
            const password = prompt(window.i18n.t('admin_password_prompt'));
            if (password !== this.adminPassword) {
                alert(window.i18n.t('wrong_password'));
                return;
            }
            
            if (confirm(window.i18n.t('confirm_clear'))) {
                this.gameEngine.clearHighScores();
                this.updateHighScoresDisplay();
                alert(window.i18n.t('scores_cleared'));
            }
        });
        
        document.getElementById('exportScores').addEventListener('click', () => {
            const scores = this.gameEngine.exportHighScores();
            this.downloadTextFile('morse-scores.txt', scores);
        });
        
        this.updateHighScoresDisplay();
    }
    
    /**
     * Update high scores display - FIXED to show all categories
     */
    updateHighScoresDisplay() {
        // Update all three categories
        this.updateCategoryScores('letters', 'scoresLetters');
        this.updateCategoryScores('letters_numbers', 'scoresLettersNumbers');
        this.updateCategoryScores('letters_numbers_punct', 'scoresLettersNumbersPunct');
    }
    
    /**
     * Update scores for a specific category
     * @param {string} category - Category name
     * @param {string} elementId - DOM element ID
     */
    updateCategoryScores(category, elementId) {
        const scoresContainer = document.getElementById(elementId);
        if (!scoresContainer) {
            console.error(`Score container not found: ${elementId}`);
            return;
        }
        
        const scores = this.gameEngine.getHighScores(category);
        
        scoresContainer.innerHTML = '';
        
        scores.forEach((score, index) => {
            if (score.score > 0 || score.name) { // Show non-empty scores
                const scoreItem = document.createElement('div');
                scoreItem.className = 'score-item';
                scoreItem.innerHTML = `#${index + 1} ${score.name || 'Anoniem'}: ${score.score} letters`;
                scoresContainer.appendChild(scoreItem);
            }
        });
        
        if (scoresContainer.children.length === 0) {
            scoresContainer.innerHTML = `<div class="score-item empty">${window.i18n.t('no_scores_yet')}</div>`;
        }
    }
    
    /**
     * Initialize character mode selection
     */
    initCharacterMode() {
        // Set default mode
        const defaultRadio = document.querySelector('input[name="characterSet"][value="letters"]');
        if (defaultRadio) {
            defaultRadio.checked = true;
            this.gameEngine.setCharacterMode('letters');
        }
    }
    
    /**
     * Initialize keyboard shortcuts
     */
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when not in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    if (this.currentTab === 'game' && this.gameActive) {
                        this.gameEngine.replayMorse();
                    }
                    break;
                    
                case 'Escape':
                    this.audioEngine.stop();
                    break;
                    
                case '1':
                    this.switchTab('game');
                    break;
                case '2':
                    this.switchTab('settings');
                    break;
            }
        });
    }
    
    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const wpm = localStorage.getItem('morseWPM');
            const freq = localStorage.getItem('morseFreq');
            const vol = localStorage.getItem('morseVolume');
            const visual = localStorage.getItem('morseVisualFeedback');
            
            if (wpm) document.getElementById('wpmSpeed').value = wpm;
            if (freq) document.getElementById('frequency').value = freq;
            if (vol) document.getElementById('volume').value = vol;
            if (visual !== null) document.getElementById('visualFeedback').checked = visual === 'true';
            
            // Update audio engine
            this.audioEngine.updateSettings({
                wpm: parseInt(wpm) || 15,
                frequency: parseInt(freq) || 600,
                volume: (parseInt(vol) || 50) / 100
            });
            
            // Update displays
            document.getElementById('wpmDisplay').textContent = (wpm || 15) + ' WPM';
            document.getElementById('freqDisplay').textContent = (freq || 600) + ' Hz';
            document.getElementById('volumeDisplay').textContent = (vol || 50) + '%';
            
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    /**
     * Update morse reference - Add click listeners for audio playback
     */
    updateMorseReference() {
        // Add click listeners to all morse character items
        document.querySelectorAll('.morse-char-item').forEach(charItem => {
            charItem.addEventListener('click', (e) => {
                // Get the character from morse-char-display
                const charDisplay = charItem.querySelector('.morse-char-display');
                if (charDisplay) {
                    const character = charDisplay.textContent.trim();
                    console.log(`Playing morse for character: ${character}`);
                    
                    // Stop any current audio
                    this.audioEngine.stop();
                    
                    // Play the morse code for this character
                    this.audioEngine.playCharacter(character);
                    
                    // Add visual feedback
                    charItem.classList.add('playing');
                    setTimeout(() => {
                        charItem.classList.remove('playing');
                    }, 1000);
                }
            });
            
            // Add cursor pointer to indicate clickability
            charItem.style.cursor = 'pointer';
        });
    }
    
    /**
     * Download text file
     */
    downloadTextFile(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.morseApp = new MorseApp();
});