// Game Engine - Competitive Morse Code Training (DOS Style) - IMPROVED VERSION - Multilingual

class GameEngine {
    constructor(morseEngine, audioEngine) {
        this.morseEngine = morseEngine;
        this.audioEngine = audioEngine;
        
        // Game state
        this.isGameActive = false;
        this.currentCharacter = '';
        this.currentMorse = '';
        this.score = 0;
        this.streak = 0;
        this.level = 1;
        this.lives = 3;
        
        // DOS-style competitive timing
        this.baseThinkTime = 5000; // Start with 5 seconds
        this.currentThinkTime = this.baseThinkTime;
        this.minThinkTime = 1000;  // Minimum 1 second
        this.timeReduction = 100;  // Reduce by 100ms per correct answer
        
        // Timer management
        this.gameTimer = null;
        this.startTime = null;
        
        // Game progression (only letters A-Z like DOS version)
        this.availableLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        
        // Character set modes
        this.characterModes = {
            'letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'letters_numbers': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            'letters_numbers_punct': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?\'/:;=+-_@¿¡'
        };
        
        this.currentCharacterMode = 'letters'; // Default mode
        
        // Callbacks for UI updates
        this.onGameUpdate = null;
        this.onGameEnd = null;
        this.onTimeWarning = null;
        
        // High scores (matching Score.txt format but with categories)
        this.loadHighScores();
    }
    
    /**
     * Start new competitive game
     * @param {Function} onUpdate - Called on game state updates
     * @param {Function} onEnd - Called when game ends
     * @param {Function} onTimeWarning - Called when time is running low
     */
    startGame(onUpdate, onEnd, onTimeWarning) {
        this.onGameUpdate = onUpdate;
        this.onGameEnd = onEnd;
        this.onTimeWarning = onTimeWarning;
        
        // Reset game state
        this.isGameActive = true;
        this.score = 0;
        this.streak = 0;
        this.level = 1;
        this.lives = 1;  // Only 1 life as requested
        this.currentThinkTime = this.baseThinkTime;
        
        // Start first round
        this.nextCharacter();
    }
    
    /**
     * Generate next character and start timer
     */
    nextCharacter() {
        if (!this.isGameActive) return;
        
        // Get current character set based on mode
        const characterSet = this.characterModes[this.currentCharacterMode] || this.characterModes.letters;
        
        // Select random character from the current set
        this.currentCharacter = characterSet[
            Math.floor(Math.random() * characterSet.length)
        ];
        this.currentMorse = this.morseEngine.getCharacterMorse(this.currentCharacter);
        
        // Update UI FIRST before playing audio
        if (this.onGameUpdate) {
            this.onGameUpdate({
                score: this.score,
                level: this.level,
                lives: this.lives,
                streak: this.streak,
                thinkTime: this.currentThinkTime,
                character: this.currentCharacter,
                morse: this.currentMorse
            });
        }
        
        // Small delay to ensure UI updates before audio starts
        setTimeout(() => {
            // Play the morse code
            this.audioEngine.playCharacter(this.currentCharacter);
            
            // Start countdown timer
            this.startTimer();
        }, 100);
    }
    
    /**
     * Start the countdown timer for current character
     */
    startTimer() {
        if (this.gameTimer) {
            clearTimeout(this.gameTimer);
            clearInterval(this.warningTimer);
            clearInterval(this.progressTimer);
        }

        this.startTime = Date.now();
        
        // Show and reset progress bar
        this.showProgressBar();
        
        // Update progress bar continuously
        this.progressTimer = setInterval(() => {
            if (!this.isGameActive) return;
            
            const elapsed = Date.now() - this.startTime;
            const progress = (elapsed / this.currentThinkTime) * 100;
            const timeLeft = Math.max(0, this.currentThinkTime - elapsed);
            
            this.updateProgressBar(progress, timeLeft);
            
            if (progress >= 100) {
                clearInterval(this.progressTimer);
            }
        }, 50); // Update every 50ms for smooth animation
        
        // Set warning timer at 75% of think time
        const warningTime = this.currentThinkTime * 0.25;
        this.warningTimer = setTimeout(() => {
            if (this.onTimeWarning && this.isGameActive) {
                this.onTimeWarning(warningTime);
            }
        }, this.currentThinkTime - warningTime);
        
        // Set game over timer
        this.gameTimer = setTimeout(() => {
            this.timeOut();
        }, this.currentThinkTime);
    }
    
    /**
     * Handle player answer - IMPROVED to ensure wrongAnswer is properly passed
     * @param {string} answer - Player's answer
     * @returns {boolean} True if correct
     */
    submitAnswer(answer) {
        if (!this.isGameActive) return false;
        
        // Clear all timers
        if (this.gameTimer) {
            clearTimeout(this.gameTimer);
            clearInterval(this.warningTimer);
            clearInterval(this.progressTimer);
        }
        
        // Hide progress bar
        this.hideProgressBar();
        
        const isCorrect = answer.toUpperCase() === this.currentCharacter;
        const responseTime = Date.now() - this.startTime;
        
        if (isCorrect) {
            this.handleCorrectAnswer(responseTime);
        } else {
            // IMPROVED: Pass both the wrong answer and correct character
            this.handleWrongAnswer(answer.toUpperCase());
        }
        
        return isCorrect;
    }
    
    /**
     * Handle correct answer
     * @param {number} responseTime - Time taken to answer
     */
    handleCorrectAnswer(responseTime) {
        this.score++; // Simple: score = number of correct letters
        this.streak++;
        
        // Increase difficulty (reduce think time) - DOS style progression
        if (this.currentThinkTime > this.minThinkTime) {
            this.currentThinkTime = Math.max(
                this.minThinkTime,
                this.currentThinkTime - this.timeReduction
            );
        }
        
        // Level up every 10 correct answers
        this.level = Math.floor(this.streak / 10) + 1;
        
        if (this.onGameUpdate) {
            this.onGameUpdate({
                score: this.score,
                level: this.level,
                lives: this.lives,
                streak: this.streak,
                thinkTime: this.currentThinkTime,
                character: this.currentCharacter,
                morse: this.currentMorse,
                result: 'correct',
                responseTime
            });
        }
        
        // Continue with next character
        setTimeout(() => this.nextCharacter(), 1000);
    }
    
    /**
     * Handle wrong answer - IMPROVED to show both wrong and correct answers
     * @param {string} wrongAnswer - The incorrect answer given
     */
    handleWrongAnswer(wrongAnswer) {
        console.log('handleWrongAnswer called with:', wrongAnswer);
        console.log('Current game state:', {
            currentCharacter: this.currentCharacter,
            currentMorse: this.currentMorse,
            lives: this.lives
        });
        
        this.lives--;
        this.streak = 0; // Reset streak on wrong answer
        
        // IMPROVED: Ensure all necessary data is passed to UI
        const gameStateUpdate = {
            score: this.score,
            level: this.level,
            lives: this.lives,
            streak: this.streak,
            thinkTime: this.currentThinkTime,
            character: this.currentCharacter, // The CORRECT character
            morse: this.currentMorse,         // The morse code
            result: 'wrong',
            wrongAnswer: wrongAnswer || window.i18n.t('no_answer'), // What the user typed
            correctAnswer: this.currentCharacter         // What it should have been
        };
        
        console.log('Sending gameStateUpdate to UI:', gameStateUpdate);
        
        if (this.onGameUpdate) {
            this.onGameUpdate(gameStateUpdate);
        }
        
        if (this.lives <= 0) {
            // FIXED: Add delay to ensure UI update happens before game ends
            setTimeout(() => {
                console.log('Game ending due to wrong answer...');
                this.endGame('wrong_answer');
            }, 1000);
        } else {
            // Continue with next character after brief pause
            setTimeout(() => this.nextCharacter(), 1500);
        }
    }
    
    /**
     * Handle timeout - IMPROVED to show correct answer
     */
    timeOut() {
        console.log('timeOut called');
        console.log('Current game state:', {
            currentCharacter: this.currentCharacter,
            currentMorse: this.currentMorse,
            lives: this.lives
        });
        
        // Clear timers and hide progress bar
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
        }
        this.hideProgressBar();
        
        this.lives--;
        this.streak = 0; // Reset streak on timeout
        
        // IMPROVED: Show what the correct answer was
        const gameStateUpdate = {
            score: this.score,
            level: this.level,
            lives: this.lives,
            streak: this.streak,
            thinkTime: this.currentThinkTime,
            character: this.currentCharacter, // The CORRECT character
            morse: this.currentMorse,         // The morse code
            result: 'timeout',
            correctAnswer: this.currentCharacter // What it should have been
        };
        
        console.log('Sending timeout gameStateUpdate to UI:', gameStateUpdate);
        
        if (this.onGameUpdate) {
            this.onGameUpdate(gameStateUpdate);
        }
        
        if (this.lives <= 0) {
            // FIXED: Add delay to ensure UI update happens before game ends
            setTimeout(() => {
                console.log('Game ending due to timeout...');
                this.endGame('timeout');
            }, 1000);
        } else {
            // Continue with next character
            setTimeout(() => this.nextCharacter(), 1500);
        }
    }
    
    /**
     * End the game
     * @param {string} reason - Reason for game end
     */
    endGame(reason) {
        this.isGameActive = false;
        
        // Clean up all timers
        if (this.gameTimer) {
            clearTimeout(this.gameTimer);
            clearInterval(this.warningTimer);
            clearInterval(this.progressTimer);
        }
        
        // Hide progress bar
        this.hideProgressBar();
        
        // Check if score qualifies for high scores
        const qualified = this.checkHighScore(this.score);
        
        if (this.onGameEnd) {
            this.onGameEnd({
                finalScore: this.score,
                level: this.level,
                streak: this.streak,
                reason,
                qualified
            });
        }
        
        return { score: this.score, qualified };
    }
    
    /**
     * Stop current game
     */
    stopGame() {
        if (this.isGameActive) {
            this.endGame('stopped');
        }
    }
    
    /**
     * Replay current morse character
     */
    replayMorse() {
        if (this.isGameActive && this.currentCharacter) {
            this.audioEngine.playCharacter(this.currentCharacter);
        }
    }
    
    /**
     * Skip current character (costs a life)
     */
    skipCharacter() {
        if (this.isGameActive) {
            this.handleWrongAnswer('SKIPPED');
        }
    }
    
    /**
     * Load high scores from localStorage (with categories)
     */
    loadHighScores() {
        try {
            const stored = localStorage.getItem('morseHighScores');
            if (stored) {
                const data = JSON.parse(stored);
                
                // Handle both old format (array) and new format (object with categories)
                if (Array.isArray(data)) {
                    // Old format - convert to new format
                    this.highScores = {
                        letters: data.slice(0, 5),
                        letters_numbers: Array(5).fill({ name: '', score: 0, date: '' }),
                        letters_numbers_punct: Array(5).fill({ name: '', score: 0, date: '' })
                    };
                } else {
                    // New format with categories
                    this.highScores = {
                        letters: data.letters || Array(5).fill({ name: '', score: 0, date: '' }),
                        letters_numbers: data.letters_numbers || Array(5).fill({ name: '', score: 0, date: '' }),
                        letters_numbers_punct: data.letters_numbers_punct || Array(5).fill({ name: '', score: 0, date: '' })
                    };
                }
            } else {
                // Initialize empty categories
                this.highScores = {
                    letters: Array(5).fill({ name: '', score: 0, date: '' }),
                    letters_numbers: Array(5).fill({ name: '', score: 0, date: '' }),
                    letters_numbers_punct: Array(5).fill({ name: '', score: 0, date: '' })
                };
            }
            
            // Ensure each category has 5 slots
            Object.keys(this.highScores).forEach(category => {
                while (this.highScores[category].length < 5) {
                    this.highScores[category].push({ name: '', score: 0, date: '' });
                }
                this.highScores[category] = this.highScores[category].slice(0, 5);
            });
            
        } catch (error) {
            console.error('Error loading high scores:', error);
            this.highScores = {
                letters: Array(5).fill({ name: '', score: 0, date: '' }),
                letters_numbers: Array(5).fill({ name: '', score: 0, date: '' }),
                letters_numbers_punct: Array(5).fill({ name: '', score: 0, date: '' })
            };
        }
    }
    
    /**
     * Save high scores to localStorage
     */
    saveHighScores() {
        try {
            localStorage.setItem('morseHighScores', JSON.stringify(this.highScores));
        } catch (error) {
            console.error('Error saving high scores:', error);
        }
    }
    
    /**
     * Check if score qualifies for high scores in current category
     * @param {number} score - Score to check
     * @returns {boolean} True if qualifies
     */
    checkHighScore(score) {
        const categoryScores = this.highScores[this.currentCharacterMode];
        const lowestScore = Math.min(...categoryScores.map(s => s.score));
        return score > lowestScore;
    }
    
    /**
     * Add new high score to current category
     * @param {string} name - Player name
     * @param {number} score - Score achieved
     */
    addHighScore(name, score) {
        const newScore = {
            name: name.substring(0, 20), // Limit name length
            score: score,
            date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        };
        
        // Add to current category
        this.highScores[this.currentCharacterMode].push(newScore);
        this.highScores[this.currentCharacterMode].sort((a, b) => b.score - a.score);
        this.highScores[this.currentCharacterMode] = this.highScores[this.currentCharacterMode].slice(0, 5); // Keep top 5
        
        this.saveHighScores();
    }
    
    /**
     * Get high scores list by category
     * @param {string} category - Category name (optional, returns all if not specified)
     * @returns {Object|Array} High scores by category or all categories
     */
    getHighScores(category) {
        if (category && this.highScores[category]) {
            return [...this.highScores[category]];
        }
        return JSON.parse(JSON.stringify(this.highScores)); // Deep copy
    }
    
    /**
     * Clear all high scores
     */
    clearHighScores() {
        this.highScores = {
            letters: Array(5).fill({ name: '', score: 0, date: '' }),
            letters_numbers: Array(5).fill({ name: '', score: 0, date: '' }),
            letters_numbers_punct: Array(5).fill({ name: '', score: 0, date: '' })
        };
        this.saveHighScores();
    }
    
    /**
     * Export high scores in DOS Score.txt format with categories
     * @returns {string} Formatted high scores
     */
    exportHighScores() {
        let exportText = '';
        
        Object.keys(this.highScores).forEach(category => {
            exportText += `\n=== ${category.toUpperCase()} ===\n`;
            exportText += this.highScores[category]
                .map(score => `"${score.name}","${score.date}",${score.score}`)
                .join('\n');
            exportText += '\n';
        });
        
        return exportText;
    }
    
    /**
     * Set the character mode for the game
     * @param {string} mode - Character mode: 'letters', 'letters_numbers', 'letters_numbers_punct'
     */
    setCharacterMode(mode) {
        if (this.characterModes[mode]) {
            this.currentCharacterMode = mode;
            console.log('Character mode set to:', mode);
        }
    }

    /**
     * Get the current character mode
     * @returns {string} Current character mode
     */
    getCharacterMode() {
        return this.currentCharacterMode;
    }

    /**
     * Get current game state
     * @returns {Object} Current game state
     */
    getGameState() {
        return {
            isActive: this.isGameActive,
            score: this.score,
            level: this.level,
            lives: this.lives,
            streak: this.streak,
            currentCharacter: this.currentCharacter,
            currentMorse: this.currentMorse,
            thinkTime: this.currentThinkTime,
            characterMode: this.currentCharacterMode,
            timeRemaining: this.gameTimer ? this.currentThinkTime - (Date.now() - this.startTime) : 0
        };
    }
    
    /**
     * Get statistics for current session
     * @returns {Object} Session statistics
     */
    getSessionStats() {
        return {
            highestScore: this.score,
            highestLevel: this.level,
            longestStreak: this.streak
        };
    }
    
    /**
     * Show progress bar UI
     */
    showProgressBar() {
        const container = document.getElementById('timeProgressContainer');
        if (container) {
            container.style.display = 'block';
            this.updateProgressBar(0, this.currentThinkTime);
        }
    }
    
    /**
     * Hide progress bar UI
     */
    hideProgressBar() {
        const container = document.getElementById('timeProgressContainer');
        if (container) {
            container.style.display = 'none';
        }
    }
    
    /**
     * Update progress bar display
     * @param {number} progress - Progress percentage (0-100)
     * @param {number} timeLeft - Time remaining in milliseconds
     */
    updateProgressBar(progress, timeLeft) {
        const progressBar = document.getElementById('timeProgressBar');
        const progressText = document.getElementById('timeProgressText');
        
        if (progressBar) {
            // Progress runs from left to right (0% to 100%)
            progressBar.style.width = progress + '%';
            
            // Change color based on progress
            if (progress < 50) {
                progressBar.style.background = '#10b981'; // Green (early)
            } else if (progress < 75) {
                progressBar.style.background = '#f59e0b'; // Yellow (middle)
            } else {
                progressBar.style.background = '#ef4444'; // Red (almost done)
            }
        }
        
        if (progressText) {
            progressText.textContent = (timeLeft / 1000).toFixed(1) + 's';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}