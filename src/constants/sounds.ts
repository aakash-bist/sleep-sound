// Bundled background sounds configuration
// Local audio files for baby sleep sounds

import { BackgroundSound } from '../types';

// Baby-friendly soothing sounds for peaceful sleep
export const backgroundSounds: BackgroundSound[] = [
    {
        id: 'rain',
        name: 'Gentle Rain',
        icon: '🌧️',
        source: require('../../assets/sounds/rain.mp3'),
    },
    {
        id: 'ocean',
        name: 'Ocean Waves',
        icon: '🌊',
        source: require('../../assets/sounds/ocean.mp3'),
    },
    {
        id: 'sleep_tune',
        name: 'Sleep Tune',
        icon: '🌙',
        source: require('../../assets/sounds/sleep_tune.mp3'),
    },
    {
        id: 'music-box',
        name: 'Music Box',
        icon: '🎁',
        source: require('../../assets/sounds/music-box.mp3'),
    },
    {
        id: 'kitten-snore',
        name: 'Kitten Snore',
        icon: '🐱',
        source: require('../../assets/sounds/kitten-snore.mp3'),
    },
    {
        id: 'piano',
        name: 'Soft Piano',
        icon: '🎹',
        source: require('../../assets/sounds/piano.mp3'),
    },
    {
        id: 'flute',
        name: 'Gentle Flute',
        icon: '🪈',
        source: require('../../assets/sounds/flute.mp3'),
    },
    {
        id: 'guitar',
        name: 'Acoustic Guitar',
        icon: '🎸',
        source: require('../../assets/sounds/guitar.mp3'),
    },
    {
        id: 'calm-guitar',
        name: 'Calm Guitar',
        icon: '🎸',
        source: require('../../assets/sounds/calm-guitar.mp3'),
    },
    {
        id: 'violin',
        name: 'Soft Violin',
        icon: '🎻',
        source: require('../../assets/sounds/violin.mp3'),
    },
    {
        id: 'baby_sleep_new',
        name: 'Baby Sleep',
        icon: '👶',
        source: require('../../assets/sounds/baby_sleep_new.mp3'),
    },
    {
        id: 'krishna_flute',
        name: 'Krishna Flute',
        icon: '🕉️',
        source: require('../../assets/sounds/krishna_flute.mp3'),
    },
    {
        id: 'krishna_peaceful_flute',
        name: 'Peaceful Krishna',
        icon: '🕉️',
        source: require('../../assets/sounds/krishna_peaceful_flute.mp3'),
    },
    {
        id: 'sitar',
        name: 'Sitar Melody',
        icon: '🪕',
        source: require('../../assets/sounds/sitar.mp3'),
    },
    {
        id: 'sitar_chanakya',
        name: 'Sitar Chanakya',
        icon: '🪕',
        source: require('../../assets/sounds/sitar_chanakya.mp3'),
    },
    {
        id: 'har_har_mahadev',
        name: 'Har Har Mahadev',
        icon: '🔱',
        source: require('../../assets/sounds/har_har_mahadev.mp3'),
    },
    {
        id: 'rishabh_sharma',
        name: 'Rishabh Sharma',
        icon: '🪕',
        source: require('../../assets/sounds/rishabh_sharma.mp3'),
    },
    {
        id: 'touching',
        name: 'Touching Tune',
        icon: '✨',
        source: require('../../assets/sounds/touching.mp3'),
    },
    {
        id: 'krisshh_flute',
        name: 'Krisshh Flute',
        icon: '🪈',
        source: require('../../assets/sounds/krisshh_flute.mp3'),
    },
];

// Helper to get sound source by ID
export const getSoundSource = (soundId: string | null): number | null => {
    if (!soundId) return null;
    const sound = backgroundSounds.find(s => s.id === soundId);
    if (!sound) return null;
    return typeof sound.source === 'number' ? sound.source : null;
};

// Legacy helper for URL-based sounds (keeping for compatibility)
export const getSoundUrl = (soundId: string | null): string | null => {
    if (!soundId) return null;
    const sound = backgroundSounds.find(s => s.id === soundId);
    if (!sound) return null;
    return typeof sound.source === 'string' ? sound.source : null;
};

// Sleep timer options in minutes
export const sleepTimerOptions = [
    { label: 'Off', value: null },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 },
    { label: '90 min', value: 90 },
];

// Crossfade duration in milliseconds
export const CROSSFADE_DURATION_MS = 3000;

// Recording settings
export const RECORDING_OPTIONS = {
    android: {
        extension: '.m4a',
        outputFormat: 2, // MPEG_4
        audioEncoder: 3, // AAC
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
    },
    ios: {
        extension: '.m4a',
        audioQuality: 127, // MAX
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
    web: {},
};
