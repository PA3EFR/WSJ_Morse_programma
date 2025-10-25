// Audio Engine - Web Audio API implementation for Morse Code

class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentTimeout = null;
        this.playQueue = [];
        
        // Default settings (can be modified via settings)
        this.settings = {
            frequency: 600,    // Hz
            wpm: 15,          // Words per minute
            volume: 0.5,      // 0.0 to 1.0
            waveform: 'sine'  // sine, square, sawtooth, triangle
        };
        
        // Timing calculations based on WPM
        this.updateTimings();
        
        // Initialize audio context on first user interaction
        this.initAudio();
    }
    
    /**
     * Initialize Web Audio API context
     */
    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Handle audio context suspension (browser autoplay policy)
            if (this.audioContext.state === 'suspended') {
                // Will be resumed on first user interaction
                document.addEventListener('click', this.resumeAudioContext.bind(this), { once: true });
                document.addEventListener('keydown', this.resumeAudioContext.bind(this), { once: true });
            }
            
        } catch (error) {
            console.error('Web Audio API not supported:', error);
            throw new Error('Audio not supported in this browser');
        }
    }
    
    /**
     * Resume audio context (required by browser autoplay policies)
     */
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
    
    /**
     * Update timing calculations based on WPM
     */
    updateTimings() {
        // Standard: PARIS = 50 units, so 1 WPM = 50 units per minute
        const unitsPerMinute = this.settings.wpm * 50;
        const unitTimeMs = 60000 / unitsPerMinute;
        
        this.timings = {
            dot: unitTimeMs,
            dash: unitTimeMs * 3,
            symbolGap: unitTimeMs,      // Gap between dots/dashes within character
            letterGap: unitTimeMs * 3,  // Gap between letters
            wordGap: unitTimeMs * 7     // Gap between words
        };
    }
    
    /**
     * Create oscillator with current settings
     * @returns {OscillatorNode} Configured oscillator
     */
    createOscillator() {
        if (!this.audioContext) throw new Error('Audio context not initialized');
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.frequency.setValueAtTime(this.settings.frequency, this.audioContext.currentTime);
        oscillator.type = this.settings.waveform;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        return { oscillator, gainNode };
    }
    
    /**
     * Play a single tone (dot or dash)
     * @param {number} duration - Duration in milliseconds
     * @param {Function} callback - Called when tone ends
     */
    playTone(duration, callback) {
        try {
            const { oscillator, gainNode } = this.createOscillator();
            const now = this.audioContext.currentTime;
            const endTime = now + (duration / 1000);
            
            // Envelope to prevent clicks
            const attackTime = 0.005; // 5ms attack
            const releaseTime = 0.005; // 5ms release
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(this.settings.volume, now + attackTime);
            gainNode.gain.setValueAtTime(this.settings.volume, endTime - releaseTime);
            gainNode.gain.linearRampToValueAtTime(0, endTime);
            
            oscillator.start(now);
            oscillator.stop(endTime);
            
            // Schedule callback
            this.currentTimeout = setTimeout(callback, duration);
            
        } catch (error) {
            console.error('Error playing tone:', error);
            callback();
        }
    }
    
    /**
     * Play silence for specified duration
     * @param {number} duration - Duration in milliseconds
     * @param {Function} callback - Called when silence ends
     */
    playSilence(duration, callback) {
        this.currentTimeout = setTimeout(callback, duration);
    }
    
    /**
     * Convert morse character to audio sequence
     * @param {string} morseChar - Single morse character (e.g., '.-')
     * @returns {Array} Array of {type, duration} objects
     */
    morseToAudioSequence(morseChar) {
        const sequence = [];
        
        for (let i = 0; i < morseChar.length; i++) {
            const symbol = morseChar[i];
            
            if (symbol === '.') {
                sequence.push({ type: 'tone', duration: this.timings.dot });
            } else if (symbol === '-') {
                sequence.push({ type: 'tone', duration: this.timings.dash });
            }
            
            // Add gap between symbols (except after last symbol)
            if (i < morseChar.length - 1) {
                sequence.push({ type: 'silence', duration: this.timings.symbolGap });
            }
        }
        
        return sequence;
    }
    
    /**
     * Play morse code string
     * @param {string} morseCode - Complete morse code string
     * @param {Function} onProgress - Called with progress info
     * @param {Function} onComplete - Called when playback finishes
     */
    async playMorseCode(morseCode, onProgress = null, onComplete = null) {
        await this.resumeAudioContext();
        
        if (this.isPlaying) {
            this.stop();
        }
        
        this.isPlaying = true;
        this.playQueue = [];
        
        // Parse morse code into audio sequence
        const elements = morseCode.split(' ');
        let totalElements = 0;
        
        elements.forEach((element, elementIndex) => {
            if (element === '/') {
                // Word separator
                this.playQueue.push({ 
                    type: 'silence', 
                    duration: this.timings.wordGap,
                    elementIndex,
                    isWordGap: true
                });
            } else if (element) {
                // Morse character
                const sequence = this.morseToAudioSequence(element);
                sequence.forEach(item => {
                    this.playQueue.push({
                        ...item,
                        elementIndex,
                        morseChar: element
                    });
                });
                
                // Add letter gap (except after last element)
                if (elementIndex < elements.length - 1 && elements[elementIndex + 1] !== '/') {
                    this.playQueue.push({ 
                        type: 'silence', 
                        duration: this.timings.letterGap,
                        elementIndex,
                        isLetterGap: true
                    });
                }
            }
            totalElements++;
        });
        
        // Play the sequence
        this.playQueueRecursive(0, totalElements, onProgress, onComplete);
    }
    
    /**
     * Recursively play audio queue
     * @param {number} index - Current index in queue
     * @param {number} totalElements - Total number of elements
     * @param {Function} onProgress - Progress callback
     * @param {Function} onComplete - Completion callback
     */
    playQueueRecursive(index, totalElements, onProgress, onComplete) {
        if (!this.isPlaying || index >= this.playQueue.length) {
            this.isPlaying = false;
            if (onComplete) onComplete();
            return;
        }
        
        const item = this.playQueue[index];
        
        // Call progress callback
        if (onProgress) {
            onProgress({
                elementIndex: item.elementIndex,
                totalElements,
                morseChar: item.morseChar,
                isWordGap: item.isWordGap,
                isLetterGap: item.isLetterGap,
                progress: (item.elementIndex / totalElements) * 100
            });
        }
        
        const nextCallback = () => {
            this.playQueueRecursive(index + 1, totalElements, onProgress, onComplete);
        };
        
        if (item.type === 'tone') {
            this.playTone(item.duration, nextCallback);
        } else {
            this.playSilence(item.duration, nextCallback);
        }
    }
    
    /**
     * Stop current playback
     */
    stop() {
        this.isPlaying = false;
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
        this.playQueue = [];
    }
    
    /**
     * Update audio settings
     * @param {Object} newSettings - New settings to apply
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.updateTimings();
    }
    
    /**
     * Get current settings
     * @returns {Object} Current audio settings
     */
    getSettings() {
        return { ...this.settings };
    }
    
    /**
     * Test audio by playing a simple pattern
     */
    async testAudio() {
        await this.playMorseCode('... --- ...', null, () => {
            console.log('Audio test completed');
        });
    }
    
    /**
     * Play single character for training
     * @param {string} character - Character to play
     * @param {Function} onComplete - Called when done
     */
    async playCharacter(character, onComplete = null) {
        const morseEngine = new MorseEngine();
        const morse = morseEngine.getCharacterMorse(character);
        
        if (morse) {
            await this.playMorseCode(morse, null, onComplete);
        } else if (onComplete) {
            onComplete();
        }
    }
    
    /**
     * Calculate total playback duration for morse code
     * @param {string} morseCode - Morse code to analyze
     * @returns {number} Duration in milliseconds
     */
    calculateDuration(morseCode) {
        let totalDuration = 0;
        const elements = morseCode.split(' ');
        
        elements.forEach((element, elementIndex) => {
            if (element === '/') {
                totalDuration += this.timings.wordGap;
            } else if (element) {
                // Calculate character duration
                for (const symbol of element) {
                    if (symbol === '.') {
                        totalDuration += this.timings.dot;
                    } else if (symbol === '-') {
                        totalDuration += this.timings.dash;
                    }
                    totalDuration += this.timings.symbolGap;
                }
                totalDuration -= this.timings.symbolGap; // Remove last symbol gap
                
                // Add letter gap
                if (elementIndex < elements.length - 1 && elements[elementIndex + 1] !== '/') {
                    totalDuration += this.timings.letterGap;
                }
            }
        });
        
        return totalDuration;
    }
    
    /**
     * Check if audio is currently playing
     * @returns {boolean} True if playing
     */
    getIsPlaying() {
        return this.isPlaying;
    }
    
    /**
     * Cleanup audio resources
     */
    dispose() {
        this.stop();
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioEngine;
}