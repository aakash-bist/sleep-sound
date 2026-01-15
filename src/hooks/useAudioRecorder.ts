import { useState, useEffect, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { RECORDING_OPTIONS } from '../constants/sounds';

interface RecordingStatus {
    isRecording: boolean;
    durationMs: number;
}

export function useAudioRecorder() {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [status, setStatus] = useState<RecordingStatus>({
        isRecording: false,
        durationMs: 0,
    });
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

    // Request permissions on mount and cleanup on unmount
    useEffect(() => {
        requestPermissions();
        return () => {
            // Force cleanup on unmount to prevent stale recording objects
            if (recording) {
                recording.stopAndUnloadAsync().catch(() => { });
            }
        };
    }, [recording]);

    const requestPermissions = async () => {
        try {
            const { granted } = await Audio.requestPermissionsAsync();
            setPermissionGranted(granted);

            if (granted) {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
            }
        } catch (error) {
            console.error('Error requesting permissions:', error);
            setPermissionGranted(false);
        }
    };

    const startRecording = async (): Promise<void> => {
        try {
            if (!permissionGranted) {
                await requestPermissions();
                return;
            }

            // EXTRA SAFETY: If there's an existing recording object, unload it first
            if (recording) {
                try {
                    await recording.stopAndUnloadAsync();
                } catch (e) { }
            }

            // Ensure audio mode is set for recording
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: newRecording } = await Audio.Recording.createAsync(
                RECORDING_OPTIONS as any,
                (status) => {
                    if (status.isRecording) {
                        setStatus({
                            isRecording: true,
                            durationMs: status.durationMillis || 0,
                        });
                    }
                },
                100 // Update every 100ms
            );

            setRecording(newRecording);
            setStatus({ isRecording: true, durationMs: 0 });
        } catch (error) {
            console.error('Error starting recording:', error);
            // If it failed because of another recording, try to reset the state
            setRecording(null);
            setStatus({ isRecording: false, durationMs: 0 });
            throw error;
        }
    };

    const stopRecording = async (): Promise<string | null> => {
        try {
            if (!recording) return null;

            setStatus({ isRecording: false, durationMs: status.durationMs });

            await recording.stopAndUnloadAsync();

            // Reset audio mode for playback
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
            });

            const uri = recording.getURI();
            setRecording(null);

            return uri;
        } catch (error) {
            console.error('Error stopping recording:', error);
            setRecording(null);
            throw error;
        }
    };

    const deleteRecording = async (uri: string): Promise<void> => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(uri);
            }
        } catch (error) {
            console.error('Error deleting recording:', error);
        }
    };

    const formatDuration = (ms: number): string => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return {
        startRecording,
        stopRecording,
        deleteRecording,
        status,
        permissionGranted,
        formatDuration,
    };
}
