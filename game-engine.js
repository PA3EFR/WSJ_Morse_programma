// Game Engine - Competitive Morse Code Training (DOS Style) - IMPROVED VERSION

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
        
        // Callbacks for UI updates
        this.onGameUpdate = null;
        this.onGameEnd = null;
        this.onTimeWarning = null;
        
        // High scores (matching Score.txt format)
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
        
        // Select random letter (A-Z only, like DOS version)
        this.currentCharacter = this.availableLetters[
            Math.floor(Math.random() * this.availableLetters.length)
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
            wrongAnswer: wrongAnswer || 'geen antwoord', // What the user typed
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
     * Load high scores from localStorage (mimicking Score.txt)
     */
    loadHighScores() {
        try {
            const stored = localStorage.getItem('morseHighScores');
            this.highScores = stored ? JSON.parse(stored) : [];
            
            // Ensure we have 10 slots (like Score.txt format)
            while (this.highScores.length < 10) {
                this.highScores.push({ name: '', score: 0, date: '' });
            }
        } catch (error) {
            console.error('Error loading high scores:', error);
            this.highScores = Array(10).fill({ name: '', score: 0, date: '' });
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
     * Check if score qualifies for high scores
     * @param {number} score - Score to check
     * @returns {boolean} True if qualifies
     */
    checkHighScore(score) {
        // Find lowest score in high scores
        const lowestScore = Math.min(...this.highScores.map(s => s.score));
        return score > lowestScore;
    }
    
    /**
     * Add new high score
     * @param {string} name - Player name
     * @param {number} score - Score achieved
     */
    addHighScore(name, score) {
        const newScore = {
            name: name.substring(0, 20), // Limit name length
            score: score,
            date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        };
        
        this.highScores.push(newScore);
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 10); // Keep top 10
        
        this.saveHighScores();
    }
    
    /**
     * Get high scores list
     * @returns {Array} High scores array
     */
    getHighScores() {
        return [...this.highScores];
    }
    
    /**
     * Clear all high scores
     */
    clearHighScores() {
        this.highScores = Array(10).fill({ name: '', score: 0, date: '' });
        this.saveHighScores();
    }
    
    /**
     * Export high scores in DOS Score.txt format
     * @returns {string} Formatted high scores
     */
    exportHighScores() {
        return this.highScores
            .map(score => `"${score.name}","${score.date}",${score.score}`)
            .join('\n');
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