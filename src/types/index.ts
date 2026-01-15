// TypeScript interfaces for the Sleep App

export interface Preset {
    id: string;
    name: string;
    voiceUri: string | null;
    backgroundSound: string | null;
    voiceVolume: number;
    backgroundVolume: number;
    createdAt: number;
}

export interface BackgroundSound {
    id: string;
    name: string;
    icon: string;
    source: number | string; // require() returns number, URLs are strings
}

export interface RecordingStatus {
    isRecording: boolean;
    durationMs: number;
}

export interface PlaybackState {
    isPlaying: boolean;
    positionMs: number;
    durationMs: number;
}
