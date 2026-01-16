import { useState, useRef, useCallback, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';

interface PlaybackState {
    isPlaying: boolean;
    voicePositionMs: number;
    voiceDurationMs: number;
    error: string | null;
}

interface UseAudioPlayerOptions {
    voiceUri: string | null;
    backgroundSoundUri: number | string | null; // number for require(), string for URL
    voiceVolume: number;
    backgroundVolume: number;
    loop: boolean;
    onPlaybackComplete?: () => void;
    onError?: (title: string, message: string) => void;
}

export function useAudioPlayer(options: UseAudioPlayerOptions) {
    const {
        voiceUri,
        backgroundSoundUri,
        voiceVolume,
        backgroundVolume,
        loop,
        onPlaybackComplete,
        onError,
    } = options;

    const [playbackState, setPlaybackState] = useState<PlaybackState>({
        isPlaying: false,
        voicePositionMs: 0,
        voiceDurationMs: 0,
        error: null,
    });

    const voiceSoundRef = useRef<Audio.Sound | null>(null);
    const backgroundSoundRef = useRef<Audio.Sound | null>(null);
    const positionInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, []);

    // Update voice volume when it changes
    useEffect(() => {
        if (voiceSoundRef.current && playbackState.isPlaying) {
            voiceSoundRef.current.setVolumeAsync(voiceVolume).catch(() => { });
        }
    }, [voiceVolume, playbackState.isPlaying]);

    // Update background volume when it changes
    useEffect(() => {
        if (backgroundSoundRef.current && playbackState.isPlaying) {
            backgroundSoundRef.current.setVolumeAsync(backgroundVolume).catch(() => { });
        }
    }, [backgroundVolume, playbackState.isPlaying]);

    const cleanup = async () => {
        if (positionInterval.current) {
            clearInterval(positionInterval.current);
            positionInterval.current = null;
        }

        if (voiceSoundRef.current) {
            try {
                await voiceSoundRef.current.stopAsync();
                await voiceSoundRef.current.unloadAsync();
            } catch (e) {
                // Ignore cleanup errors
            }
            voiceSoundRef.current = null;
        }

        if (backgroundSoundRef.current) {
            try {
                await backgroundSoundRef.current.stopAsync();
                await backgroundSoundRef.current.unloadAsync();
            } catch (e) {
                // Ignore cleanup errors
            }
            backgroundSoundRef.current = null;
        }
    };

    const startPositionTracking = () => {
        if (positionInterval.current) {
            clearInterval(positionInterval.current);
        }

        positionInterval.current = setInterval(async () => {
            if (voiceSoundRef.current) {
                try {
                    const status = await voiceSoundRef.current.getStatusAsync();
                    if (status.isLoaded) {
                        setPlaybackState(prev => ({
                            ...prev,
                            voicePositionMs: status.positionMillis || 0,
                            voiceDurationMs: status.durationMillis || 0,
                        }));
                    }
                } catch (e) {
                    // Ignore
                }
            }
        }, 250);
    };

    const handleAudioFocusError = () => {
        onError?.(
            'Audio Playback Issue',
            'Could not acquire audio focus. Please try closing other audio apps or restarting Expo Go.'
        );
        setPlaybackState(prev => ({
            ...prev,
            isPlaying: false,
            error: 'Audio focus not available'
        }));
    };

    const play = useCallback(async () => {
        if (!voiceUri && !backgroundSoundUri) {
            console.warn('No audio to play');
            return;
        }

        try {
            await cleanup();

            let voiceDurationMs = 0;

            // Load and play voice if available
            if (voiceUri) {
                try {
                    const { sound, status } = await Audio.Sound.createAsync(
                        { uri: voiceUri },
                        {
                            shouldPlay: false,
                            volume: voiceVolume,
                            isLooping: loop,
                        }
                    );

                    voiceSoundRef.current = sound;
                    voiceDurationMs = (status as any).durationMillis || 0;

                    // Handle playback completion
                    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
                        if (status.isLoaded && status.didJustFinish && !loop) {
                            setPlaybackState(prev => ({ ...prev, isPlaying: false }));
                            onPlaybackComplete?.();
                        }
                    });

                    await sound.playAsync();
                } catch (error: any) {
                    if (error?.message?.includes('AudioFocus')) {
                        handleAudioFocusError();
                        return;
                    }
                    console.error('Error playing voice:', error);
                }
            }

            // Load and play background sound if available
            if (backgroundSoundUri) {
                try {
                    // Handle both bundled assets (number) and URLs (string)
                    const source = typeof backgroundSoundUri === 'number'
                        ? backgroundSoundUri
                        : { uri: backgroundSoundUri };

                    const { sound } = await Audio.Sound.createAsync(
                        source,
                        {
                            shouldPlay: true,
                            volume: backgroundVolume,
                            isLooping: true, // Background always loops
                        }
                    );
                    backgroundSoundRef.current = sound;
                } catch (error: any) {
                    console.error('Error playing background:', error);
                    // Don't show alert for background, voice might still work
                }
            }

            setPlaybackState({
                isPlaying: true,
                voicePositionMs: 0,
                voiceDurationMs: voiceDurationMs,
                error: null,
            });

            startPositionTracking();
        } catch (error: any) {
            console.error('Error playing:', error);
            if (error?.message?.includes('AudioFocus')) {
                handleAudioFocusError();
            } else {
                setPlaybackState(prev => ({ ...prev, isPlaying: false, error: error.message }));
            }
        }
    }, [voiceUri, backgroundSoundUri, voiceVolume, backgroundVolume, loop, onPlaybackComplete]);

    const pause = useCallback(async () => {
        try {
            if (voiceSoundRef.current) {
                await voiceSoundRef.current.pauseAsync();
            }
            if (backgroundSoundRef.current) {
                await backgroundSoundRef.current.pauseAsync();
            }
            setPlaybackState(prev => ({ ...prev, isPlaying: false }));
        } catch (error) {
            console.error('Error pausing:', error);
        }
    }, []);

    const resume = useCallback(async () => {
        try {
            if (voiceSoundRef.current) {
                await voiceSoundRef.current.playAsync();
            }
            if (backgroundSoundRef.current) {
                await backgroundSoundRef.current.playAsync();
            }
            setPlaybackState(prev => ({ ...prev, isPlaying: true }));
        } catch (error: any) {
            console.error('Error resuming:', error);
            if (error?.message?.includes('AudioFocus')) {
                handleAudioFocusError();
            }
        }
    }, []);

    const stop = useCallback(async () => {
        await cleanup();
        setPlaybackState({
            isPlaying: false,
            voicePositionMs: 0,
            voiceDurationMs: 0,
            error: null,
        });
    }, []);

    const togglePlayPause = useCallback(async () => {
        if (playbackState.isPlaying) {
            await pause();
        } else if (voiceSoundRef.current || backgroundSoundRef.current) {
            await resume();
        } else {
            await play();
        }
    }, [playbackState.isPlaying, pause, resume, play]);

    return {
        play,
        pause,
        resume,
        stop,
        togglePlayPause,
        playbackState,
        cleanup,
    };
}
