import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors, fontSize, spacing } from '../constants/theme';

interface VolumeSliderProps {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    icon?: string;
}

const THUMB_SIZE = 24;

export function VolumeSlider({ label, value, onValueChange, icon }: VolumeSliderProps) {
    const [sliderWidth, setSliderWidth] = useState(0);
    const containerRef = useRef<View>(null);

    const handleTouch = (evt: any) => {
        if (sliderWidth <= 0) return;

        // Use locationX which is relative to the target element (the sliderArea)
        const x = evt.nativeEvent.locationX;
        const newValue = Math.max(0, Math.min(1, x / sliderWidth));
        onValueChange(newValue);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.labelContainer}>
                    {icon && <Text style={styles.icon}>{icon}</Text>}
                    <Text style={styles.label}>{label}</Text>
                </View>
                <Text style={styles.value}>{Math.round(value * 100)}%</Text>
            </View>

            <View
                style={styles.sliderArea}
                onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={handleTouch}
                onResponderMove={handleTouch}
                onResponderTerminationRequest={() => false}
            >
                {/* Track Background */}
                <View style={styles.track} pointerEvents="none">
                    <View style={[styles.fill, { width: `${value * 100}%` }]} />
                </View>

                {/* Thumb Visual */}
                <View
                    pointerEvents="none"
                    style={[
                        styles.thumb,
                        { left: value * (sliderWidth - THUMB_SIZE) },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    icon: {
        fontSize: fontSize.md,
        opacity: 0.8,
    },
    label: {
        fontSize: fontSize.sm,
        color: colors.text,
        fontWeight: '600',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '900',
        minWidth: 40,
        textAlign: 'right',
        letterSpacing: 1,
    },
    sliderArea: {
        height: 48,
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: 'transparent',
    },
    track: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: 3,
    },
    thumb: {
        position: 'absolute',
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: '#FFFFFF',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});
