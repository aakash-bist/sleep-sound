// Sound-related constants and settings
// Sounds are now fetched dynamically from Cloudinary manifest

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
