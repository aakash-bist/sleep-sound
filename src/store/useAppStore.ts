import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Preset } from '../types';

interface AppState {
    // Current session
    voiceUri: string | null;
    backgroundSound: string | null;
    voiceVolume: number;
    backgroundVolume: number;
    isPlaying: boolean;
    sleepTimerMinutes: number | null;
    sleepTimerEndTime: number | null;

    // Saved presets
    presets: Preset[];

    // Actions
    setVoiceUri: (uri: string | null) => void;
    setBackgroundSound: (sound: string | null) => void;
    setVoiceVolume: (volume: number) => void;
    setBackgroundVolume: (volume: number) => void;
    setIsPlaying: (playing: boolean) => void;
    setSleepTimer: (minutes: number | null) => void;
    clearSleepTimer: () => void;

    // Preset actions
    savePreset: (name: string) => void;
    loadPreset: (preset: Preset) => void;
    deletePreset: (id: string) => void;

    // Reset session
    resetSession: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial state
            voiceUri: null,
            backgroundSound: null,
            voiceVolume: 0.8,
            backgroundVolume: 0.3,
            isPlaying: false,
            sleepTimerMinutes: null,
            sleepTimerEndTime: null,
            presets: [],

            // Session actions
            setVoiceUri: (uri) => set({ voiceUri: uri }),

            setBackgroundSound: (sound) => set({ backgroundSound: sound }),

            setVoiceVolume: (volume) => set({ voiceVolume: Math.max(0, Math.min(1, volume)) }),

            setBackgroundVolume: (volume) => set({ backgroundVolume: Math.max(0, Math.min(1, volume)) }),

            setIsPlaying: (playing) => set({ isPlaying: playing }),

            setSleepTimer: (minutes) => {
                if (minutes === null) {
                    set({ sleepTimerMinutes: null, sleepTimerEndTime: null });
                } else {
                    set({
                        sleepTimerMinutes: minutes,
                        sleepTimerEndTime: Date.now() + minutes * 60 * 1000,
                    });
                }
            },

            clearSleepTimer: () => set({ sleepTimerMinutes: null, sleepTimerEndTime: null }),

            // Preset actions
            savePreset: (name) => {
                const state = get();
                const newPreset: Preset = {
                    id: Date.now().toString(),
                    name,
                    voiceUri: state.voiceUri,
                    backgroundSound: state.backgroundSound,
                    voiceVolume: state.voiceVolume,
                    backgroundVolume: state.backgroundVolume,
                    createdAt: Date.now(),
                };
                set({ presets: [...state.presets, newPreset] });
            },

            loadPreset: (preset) => {
                set({
                    voiceUri: preset.voiceUri,
                    backgroundSound: preset.backgroundSound,
                    voiceVolume: preset.voiceVolume,
                    backgroundVolume: preset.backgroundVolume,
                });
            },

            deletePreset: (id) => {
                set({ presets: get().presets.filter((p) => p.id !== id) });
            },

            // Reset
            resetSession: () => {
                set({
                    voiceUri: null,
                    backgroundSound: null,
                    voiceVolume: 0.8,
                    backgroundVolume: 0.3,
                    isPlaying: false,
                    sleepTimerMinutes: null,
                    sleepTimerEndTime: null,
                });
            },
        }),
        {
            name: 'sleep-app-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                // Only persist presets and volume preferences
                presets: state.presets,
                voiceVolume: state.voiceVolume,
                backgroundVolume: state.backgroundVolume,
            }),
        }
    )
);
