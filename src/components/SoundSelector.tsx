import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { colors, fontSize, spacing, borderRadius } from '../constants/theme';
import { backgroundSounds } from '../constants/sounds';

interface SoundSelectorProps {
    selectedSound: string | null;
    onSelectSound: (soundId: string | null) => void;
}

export function SoundSelector({ selectedSound, onSelectSound }: SoundSelectorProps) {
    const previewSoundRef = useRef<Audio.Sound | null>(null);

    // Cleanup preview sound on unmount
    useEffect(() => {
        return () => {
            stopPreview();
        };
    }, []);

    const stopPreview = async () => {
        if (previewSoundRef.current) {
            try {
                await previewSoundRef.current.stopAsync();
                await previewSoundRef.current.unloadAsync();
            } catch (e) {
                // Ignore cleanup errors
            }
            previewSoundRef.current = null;
        }
    };

    const playPreview = async (sound: typeof backgroundSounds[0]) => {
        try {
            // Stop any existing preview
            await stopPreview();

            // Create and play preview
            const source = typeof sound.source === 'number'
                ? sound.source
                : { uri: sound.source };

            const { sound: audioSound } = await Audio.Sound.createAsync(
                source,
                {
                    shouldPlay: true,
                    volume: 0.5,
                    isLooping: false,
                }
            );

            previewSoundRef.current = audioSound;

            // Auto-stop after 5 seconds
            setTimeout(() => {
                stopPreview();
            }, 5000);
        } catch (error) {
            console.error('Error playing preview:', error);
        }
    };

    const handleSoundPress = async (soundId: string | null) => {
        if (soundId === null) {
            // Stop preview when "None" is selected
            await stopPreview();
        } else {
            // Find and preview the sound
            const sound = backgroundSounds.find(s => s.id === soundId);
            if (sound) {
                await playPreview(sound);
            }
        }
        onSelectSound(soundId);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Background Sound</Text>
            <Text style={styles.subtitle}>Tap to preview</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <TouchableOpacity
                    style={[styles.soundCard, !selectedSound && styles.soundCardSelected]}
                    onPress={() => handleSoundPress(null)}
                >
                    <Text style={styles.soundIcon}>🔇</Text>
                    <Text
                        style={[
                            styles.soundName,
                            !selectedSound && styles.soundNameSelected,
                        ]}
                    >
                        None
                    </Text>
                </TouchableOpacity>

                {backgroundSounds.map((sound) => (
                    <TouchableOpacity
                        key={sound.id}
                        style={[
                            styles.soundCard,
                            selectedSound === sound.id && styles.soundCardSelected,
                        ]}
                        onPress={() => handleSoundPress(sound.id)}
                    >
                        <Text style={styles.soundIcon}>{sound.icon}</Text>
                        <Text
                            style={[
                                styles.soundName,
                                selectedSound === sound.id && styles.soundNameSelected,
                            ]}
                        >
                            {sound.name}
                        </Text>
                        {selectedSound === sound.id && (
                            <View style={styles.playingIndicator}>
                                <Text style={styles.playingText}>♪</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.xl,
    },
    title: {
        fontSize: 12,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: spacing.xs,
        paddingHorizontal: spacing.lg,
    },
    subtitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.2)',
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
    },
    soundCard: {
        width: 100,
        height: 120,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        position: 'relative',
    },
    soundCardSelected: {
        borderColor: colors.accent,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    soundIcon: {
        fontSize: 36,
        marginBottom: spacing.md,
    },
    soundName: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    soundNameSelected: {
        color: '#fff',
    },
    playingIndicator: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: colors.accent,
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.accent,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    playingText: {
        fontSize: 12,
        color: '#fff',
    },
});
