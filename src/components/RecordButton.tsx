import React, { useEffect, useRef } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import { colors, spacing, borderRadius } from '../constants/theme';

interface RecordButtonProps {
    isRecording: boolean;
    onPress: () => void;
    durationMs: number;
}

export function RecordButton({ isRecording, onPress, durationMs }: RecordButtonProps) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.stopAnimation();
            pulseAnim.setValue(1);
        }
    }, [isRecording]);

    const formatDuration = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            {isRecording && (
                <Animated.View
                    style={[
                        styles.pulseCircle,
                        {
                            transform: [{ scale: pulseAnim }],
                            opacity: pulseAnim.interpolate({
                                inputRange: [1, 1.2],
                                outputRange: [0.6, 0.1],
                            }),
                        },
                    ]}
                />
            )}

            <TouchableOpacity
                style={[styles.button, isRecording && styles.buttonRecording]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <View style={isRecording ? styles.stopSquare : styles.recordCircle} />
            </TouchableOpacity>

            <Text style={styles.duration}>
                {isRecording ? formatDuration(durationMs) : 'Tap to start recording'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.xxl,
    },
    button: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        zIndex: 2,
    },
    buttonRecording: {
        backgroundColor: colors.recording,
        shadowColor: colors.recording,
    },
    recordCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
    },
    stopSquare: {
        width: 24,
        height: 24,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    pulseCircle: {
        position: 'absolute',
        top: -10,
        left: -10,
        width: 100,
        height: 100,
        borderRadius: 60,
        backgroundColor: colors.recording,
        zIndex: 1,
    },
    duration: {
        marginTop: spacing.lg,
        color: colors.text,
        fontSize: 18,
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
    },
});
