import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSize, spacing, borderRadius, shadows } from '../constants/theme';

interface PlaybackControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onStop: () => void;
    positionMs?: number;
    durationMs?: number;
    showStop?: boolean;
}

export function PlaybackControls({
    isPlaying,
    onPlayPause,
    onStop,
    positionMs = 0,
    durationMs = 0,
    showStop = true,
}: PlaybackControlsProps) {
    const formatTime = (ms: number): string => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const progress = durationMs > 0 ? positionMs / durationMs : 0;

    return (
        <View style={styles.container}>
            {durationMs > 0 && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>{formatTime(positionMs)}</Text>
                        <Text style={styles.time}>{formatTime(durationMs)}</Text>
                    </View>
                </View>
            )}

            <View style={styles.controls}>
                {showStop && (
                    <TouchableOpacity style={styles.secondaryButton} onPress={onStop}>
                        <View style={styles.stopIcon} />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.playButton}
                    onPress={onPlayPause}
                    activeOpacity={0.8}
                >
                    {isPlaying ? (
                        <View style={styles.pauseIcon}>
                            <View style={styles.pauseBar} />
                            <View style={styles.pauseBar} />
                        </View>
                    ) : (
                        <View style={styles.playIcon} />
                    )}
                </TouchableOpacity>

                {showStop && <View style={styles.secondaryButton} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    progressContainer: {
        width: '100%',
        marginBottom: spacing.lg,
    },
    progressTrack: {
        height: 6,
        backgroundColor: colors.surface,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: 3,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.sm,
    },
    time: {
        fontSize: fontSize.sm,
        color: colors.textMuted,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xl,
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.medium,
    },
    secondaryButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playIcon: {
        width: 0,
        height: 0,
        marginLeft: 6,
        borderLeftWidth: 24,
        borderTopWidth: 16,
        borderBottomWidth: 16,
        borderLeftColor: colors.text,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
    },
    pauseIcon: {
        flexDirection: 'row',
        gap: 8,
    },
    pauseBar: {
        width: 8,
        height: 28,
        backgroundColor: colors.text,
        borderRadius: 2,
    },
    stopIcon: {
        width: 20,
        height: 20,
        backgroundColor: colors.textMuted,
        borderRadius: 2,
    },
});
