// Cloudinary Sound Service
// Fetches and manages background sounds from Cloudinary

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackgroundSound } from '../types';

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'deisme7vs';
const MANIFEST_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/sleep-sounds-manifest_mdrrwz.json`;
const CACHE_KEY = 'cloudinary_sounds_cache';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedSounds {
    sounds: BackgroundSound[];
    timestamp: number;
}

interface ManifestSound {
    id: string;
    name: string;
    icon: string;
    url: string;
}

interface SoundsManifest {
    version: number;
    sounds: ManifestSound[];
}

/**
 * Fetches the sounds manifest from Cloudinary
 */
export async function fetchSoundsFromCloudinary(): Promise<BackgroundSound[] | null> {
    try {
        const response = await fetch(MANIFEST_URL, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        });

        if (!response.ok) {
            console.warn('Failed to fetch sounds manifest:', response.status);
            return null;
        }

        const manifest: SoundsManifest = await response.json();

        // Convert manifest format to BackgroundSound format
        const sounds: BackgroundSound[] = manifest.sounds.map((sound) => ({
            id: sound.id,
            name: sound.name,
            icon: sound.icon,
            source: sound.url, // URL string for remote sounds
        }));

        // Cache the sounds
        await cacheSounds(sounds);

        return sounds;
    } catch (error) {
        console.error('Error fetching sounds from Cloudinary:', error);
        return null;
    }
}

/**
 * Cache sounds locally for offline use
 */
async function cacheSounds(sounds: BackgroundSound[]): Promise<void> {
    try {
        const cached: CachedSounds = {
            sounds,
            timestamp: Date.now(),
        };
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch (error) {
        console.error('Error caching sounds:', error);
    }
}

/**
 * Get cached sounds from AsyncStorage
 */
export async function getCachedSounds(): Promise<BackgroundSound[] | null> {
    try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const parsed: CachedSounds = JSON.parse(cached);

        // Check if cache is still valid
        const isExpired = Date.now() - parsed.timestamp > CACHE_EXPIRY_MS;
        if (isExpired) {
            return null;
        }

        return parsed.sounds;
    } catch (error) {
        console.error('Error reading cached sounds:', error);
        return null;
    }
}

/**
 * Clear the sounds cache
 */
export async function clearSoundsCache(): Promise<void> {
    try {
        await AsyncStorage.removeItem(CACHE_KEY);
    } catch (error) {
        console.error('Error clearing sounds cache:', error);
    }
}

/**
 * Get sounds with fallback strategy:
 * 1. Try to fetch from Cloudinary
 * 2. Fall back to cached sounds
 * 3. Return null if both fail (will use static fallback)
 */
export async function getCloudinarySounds(): Promise<BackgroundSound[] | null> {
    // Try to fetch fresh sounds
    const remoteSounds = await fetchSoundsFromCloudinary();
    if (remoteSounds && remoteSounds.length > 0) {
        return remoteSounds;
    }

    // Fall back to cached sounds
    const cachedSounds = await getCachedSounds();
    if (cachedSounds && cachedSounds.length > 0) {
        console.log('Using cached sounds');
        return cachedSounds;
    }

    return null;
}
