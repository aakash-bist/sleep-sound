import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { colors, fontSize, spacing, borderRadius } from '../constants/theme';
import { sleepTimerOptions } from '../constants/sounds';

interface SleepTimerProps {
    selectedMinutes: number | null;
    endTime: number | null;
    onSelectTimer: (minutes: number | null) => void;
}

export function SleepTimer({ selectedMinutes, endTime, onSelectTimer }: SleepTimerProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [remainingMs, setRemainingMs] = useState(0);

    useEffect(() => {
        if (endTime) {
            const interval = setInterval(() => {
                const remaining = Math.max(0, endTime - Date.now());
                setRemainingMs(remaining);
                if (remaining === 0) {
                    clearInterval(interval);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [endTime]);

    const formatRemaining = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSelect = (minutes: number | null) => {
        onSelectTimer(minutes);
        setModalVisible(false);
    };

    return (
        <>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.icon}>⏱️</Text>
                <Text style={styles.buttonText}>
                    {selectedMinutes && endTime
                        ? formatRemaining(remainingMs)
                        : selectedMinutes
                            ? `${selectedMinutes} min`
                            : 'Timer Off'}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Sleep Timer</Text>

                        {sleepTimerOptions.map((option) => (
                            <TouchableOpacity
                                key={option.label}
                                style={[
                                    styles.option,
                                    selectedMinutes === option.value && styles.optionSelected,
                                ]}
                                onPress={() => handleSelect(option.value)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        selectedMinutes === option.value && styles.optionTextSelected,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
    },
    icon: {
        fontSize: fontSize.md,
    },
    buttonText: {
        fontSize: fontSize.sm,
        color: colors.text,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
    },
    modalTitle: {
        fontSize: fontSize.xl,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    option: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
    },
    optionSelected: {
        backgroundColor: colors.primary,
    },
    optionText: {
        fontSize: fontSize.lg,
        color: colors.textMuted,
        textAlign: 'center',
    },
    optionTextSelected: {
        color: colors.text,
        fontWeight: '600',
    },
});
