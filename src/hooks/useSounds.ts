// Hook for managing background sounds with Cloudinary integration
// This hook is kept for backward compatibility but the main state is in zustand store

import { BackgroundSound } from '../types';

/**
 * Get a sound by ID from the provided sounds array
 */
export function getSoundById(sounds: BackgroundSound[], soundId: string | null): BackgroundSound | null {
    if (!soundId) return null;
    return sounds.find(s => s.id === soundId) || null;
}

/**
 * Get the source (URL) for a sound
 */
export function getSoundSourceFromArray(sounds: BackgroundSound[], soundId: string | null): string | null {
    const sound = getSoundById(sounds, soundId);
    if (!sound) return null;
    return typeof sound.source === 'string' ? sound.source : null;
}
