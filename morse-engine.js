// Morse Code Engine - Core functionality for encoding/decoding

class MorseEngine {
    constructor() {
        // Morse Code alphabet - Letters A-Z only (like DOS version)
        this.morseCode = {
            'A': '.-',     'B': '-...',   'C': '-.-.',   'D': '-..',    'E': '.',
            'F': '..-.',   'G': '--.',    'H': '....',   'I': '..',     'J': '.---',
            'K': '-.-',    'L': '.-..',   'M': '--',     'N': '-.',     'O': '---',
            'P': '.--.',   'Q': '--.-',   'R': '.-.',    'S': '...',    'T': '-',
            'U': '..-',    'V': '...-',   'W': '.--',    'X': '-..-',   'Y': '-.--',
            'Z': '--..',
            // Numbers
            '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',  '4': '....-',
            '5': '.....',  '6': '-....',  '7': '--...',  '8': '---..',  '9': '----.',
            // Punctuation
            '.': '.-.-.-', ',': '--..--', '?': '..--..', '\'': '.----.',
            '/': '-..-.',  ':': '---...', ';': '-.-.-.', '=': '-...-',
            '+': '.-.-.',  '-': '-....-', '@': '.--.-.',  '_': '..--.-',
            '¿': '..--.-', '¡': '--..-'}
        };
        
        // Reverse lookup for decoding
        this.morseToText = {};
        for (const [letter, morse] of Object.entries(this.morseCode)) {
            this.morseToText[morse] = letter;
        }
        
        // Training sets (DOS style - letters only)
        this.trainingSets = {
            letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            numbers: '0123456789'.split(''),
            punctuation: '.,?\'/:;=+-_@¿¡'.split(''),
            letters_numbers: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''),
            letters_numbers_punct: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?\'/:;=+-_@¿¡'.split(''),
            common: 'ETAOINSHRDLU'.split(''), // Most common letters first (for easier start)
            difficult: 'QXZJKVWY'.split(''), // More complex morse patterns
            beginner: 'EISHVUF'.split(''), // Simple patterns to start with
        };
    }
    
    /**
     * Encode text to morse code
     * @param {string} text - Text to encode
     * @returns {string} Morse code representation
     */
    textToMorse(text) {
        if (!text) return '';
        
        return text.toUpperCase()
            .split('')
            .map(char => {
                if (char === ' ') return '/'; // Word separator
                return this.morseCode[char] || ''; // Unknown chars become empty
            })
            .filter(morse => morse !== '') // Remove empty strings
            .join(' ');
    }
    
    /**
     * Decode morse code to text
     * @param {string} morse - Morse code to decode
     * @returns {string} Decoded text
     */
    morseToTextDecode(morse) {
        if (!morse) return '';
        
        // Replace multiple spaces with single spaces
        morse = morse.replace(/\s+/g, ' ').trim();
        
        // Split by word separator (/)
        const words = morse.split('/');
        
        return words.map(word => {
            return word.trim()
                .split(' ')
                .map(morseChar => this.morseToText[morseChar] || '?')
                .join('');
        }).join(' ');
    }
    
    /**
     * Validate morse code string
     * @param {string} morse - Morse code to validate
     * @returns {boolean} True if valid morse code
     */
    isValidMorse(morse) {
        if (!morse) return false;
        
        // Remove spaces and word separators
        const cleanMorse = morse.replace(/[\s\/]/g, '');
        
        // Check if contains only dots, dashes
        return /^[.-]*$/.test(cleanMorse);
    }
    
    /**
     * Get random character for training
     * @param {string} set - Training set name
     * @returns {string} Random character
     */
    getRandomCharacter(set = 'letters') {
        const characters = this.trainingSets[set] || this.trainingSets.letters;
        return characters[Math.floor(Math.random() * characters.length)];
    }

    /**
     * Get available characters for a specific game mode
     * @param {string} mode - Game mode: 'letters', 'letters_numbers', 'letters_numbers_punct'
     * @returns {string[]} Array of available characters
     */
    getCharactersForMode(mode) {
        switch(mode) {
            case 'letters':
                return this.trainingSets.letters;
            case 'letters_numbers':
                return this.trainingSets.letters_numbers;
            case 'letters_numbers_punct':
                return this.trainingSets.letters_numbers_punct;
            default:
                return this.trainingSets.letters;
        }
    }
    
    /**
     * Get random word (not used in DOS version, but kept for compatibility)
     * @returns {string} Random sequence of letters
     */
    getRandomWord() {
        // DOS version doesn't use words, so return random letter sequence
        return this.generateRandomText(3 + Math.floor(Math.random() * 4), 'common');
    }
    
    /**
     * Generate random text of specified length
     * @param {number} length - Length of text to generate
     * @param {string} type - Type of text ('letters', 'common', 'difficult', 'beginner')
     * @returns {string} Random text
     */
    generateRandomText(length = 5, type = 'letters') {
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += this.getRandomCharacter(type);
        }
        
        return result;
    }
    
    /**
     * Calculate Words Per Minute (WPM) from timing
     * @param {string} text - Text that was sent
     * @param {number} timeMs - Time taken in milliseconds
     * @returns {number} WPM calculation
     */
    calculateWPM(text, timeMs) {
        const standardWordLength = 5; // PARIS standard
        const words = text.length / standardWordLength;
        const minutes = timeMs / 60000;
        return Math.round(words / minutes);
    }
    
    /**
     * Get morse code for a character
     * @param {string} char - Character to encode
     * @returns {string} Morse code
     */
    getCharacterMorse(char) {
        return this.morseCode[char.toUpperCase()] || '';
    }
    
    /**
     * Get all available characters
     * @returns {string[]} Array of available characters
     */
    getAvailableCharacters() {
        return Object.keys(this.morseCode);
    }
    
    /**
     * Get morse code reference chart
     * @returns {Object} Complete morse code chart
     */
    getMorseChart() {
        return { ...this.morseCode };
    }
    
    /**
     * Check if character is supported
     * @param {string} char - Character to check
     * @returns {boolean} True if supported
     */
    isCharacterSupported(char) {
        return this.morseCode.hasOwnProperty(char.toUpperCase());
    }
    
    /**
     * Get difficulty level for a character (based on morse complexity)
     * @param {string} char - Character to analyze
     * @returns {number} Difficulty level (1-5)
     */
    getCharacterDifficulty(char) {
        const morse = this.getCharacterMorse(char);
        if (!morse) return 0;
        
        const length = morse.length;
        const complexity = morse.split('').filter(c => c === '-').length; // Count dashes
        
        if (length <= 2) return 1;
        if (length === 3 && complexity <= 1) return 2;
        if (length === 3) return 3;
        if (length === 4) return 4;
        return 5;
    }
    
    /**
     * Get training progression (characters ordered by difficulty)
     * @returns {string[]} Characters in difficulty order
     */
    getTrainingProgression() {
        const chars = this.getAvailableCharacters();
        return chars.sort((a, b) => {
            const diffA = this.getCharacterDifficulty(a);
            const diffB = this.getCharacterDifficulty(b);
            if (diffA !== diffB) return diffA - diffB;
            return a.localeCompare(b);
        });
    }
    
    /**
     * Format morse code for display
     * @param {string} morse - Morse code to format
     * @returns {string} Formatted morse code
     */
    formatMorseForDisplay(morse) {
        return morse
            .replace(/\//g, ' / ') // Add spaces around word separators
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MorseEngine;
}