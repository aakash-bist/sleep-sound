import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSize, spacing, borderRadius, shadows } from '../constants/theme';
import { Preset } from '../types';

interface PresetCardProps {
    preset: Preset;
    onPress: () => void;
    onDelete: () => void;
    isPlaying?: boolean;
}

export function PresetCard({ preset, onPress, onDelete, isPlaying }: PresetCardProps) {
    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <TouchableOpacity
            style={[styles.container, isPlaying && styles.containerPlaying]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🎵</Text>
                    {isPlaying && <View style={styles.playingIndicator} />}
                </View>

                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>
                        {preset.name}
                    </Text>
                    <Text style={styles.meta}>
                        {preset.backgroundSound ? `With background • ` : ''}
                        {formatDate(preset.createdAt)}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderRadius: 24,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    containerPlaying: {
        borderColor: colors.accent,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    icon: {
        fontSize: 24,
    },
    playingIndicator: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#2ecc71',
        borderWidth: 2,
        borderColor: '#050a1b',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 14,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 1,
        marginBottom: 4,
    },
    meta: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
        fontWeight: 'bold',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    deleteButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.2)',
    },
});
