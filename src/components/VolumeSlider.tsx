import React, { useRef, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fontSize, spacing } from '../constants/theme';

// Fallback icon if provided icon is invalid
const FALLBACK_ICON = 'music-note';

interface VolumeSliderProps {
    label: string;
    value: number;
    onValueChange: (value: number) => void;
    icon?: string;
}

const THUMB_SIZE = 24;

export function VolumeSlider({ label, value, onValueChange, icon }: VolumeSliderProps) {
    const containerRef = useRef<View>(null);
    const sliderLayoutRef = useRef({ x: 0, width: 0 });
    const [sliderWidth, setSliderWidth] = useState(0);

    // Use refs to avoid stale closures in PanResponder
    const onValueChangeRef = useRef(onValueChange);

    useEffect(() => {
        onValueChangeRef.current = onValueChange;
    }, [onValueChange]);

    const measureSlider = useCallback(() => {
        containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
            sliderLayoutRef.current = { x: pageX, width };
        });
    }, []);

    const calculateValueFromPageX = useCallback((pageX: number): number => {
        const { x, width } = sliderLayoutRef.current;
        if (width <= 0) return 0;

        const relativeX = pageX - x;
        const clampedX = Math.max(0, Math.min(width, relativeX));
        return clampedX / width;
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                // Measure the slider position at the start of each gesture
                containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
                    sliderLayoutRef.current = { x: pageX, width };
                    const newValue = calculateValueFromPageX(evt.nativeEvent.pageX);
                    onValueChangeRef.current(newValue);
                });
            },
            onPanResponderMove: (evt) => {
                const newValue = calculateValueFromPageX(evt.nativeEvent.pageX);
                onValueChangeRef.current(newValue);
            },
            onPanResponderTerminationRequest: () => false,
        })
    ).current;

    const handleLayout = useCallback((e: any) => {
        const width = e.nativeEvent.layout.width;
        setSliderWidth(width);
        sliderLayoutRef.current.width = width;
        // Delay measure to ensure layout is complete
        setTimeout(measureSlider, 50);
    }, [measureSlider]);

    // Calculate positions directly from value prop
    const thumbLeft = sliderWidth > 0 ? value * (sliderWidth - THUMB_SIZE) : 0;
    const fillPercent = value * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.labelContainer}>
                    {icon && (
                        <MaterialCommunityIcons
                            name={(icon || FALLBACK_ICON) as keyof typeof MaterialCommunityIcons.glyphMap}
                            size={18}
                            color="rgba(255,255,255,0.6)"
                        />
                    )}
                    <Text style={styles.label}>{label}</Text>
                </View>
                <Text style={styles.value}>{Math.round(value * 100)}%</Text>
            </View>

            <View
                ref={containerRef}
                style={styles.sliderArea}
                onLayout={handleLayout}
                {...panResponder.panHandlers}
            >
                {/* Track Background */}
                <View style={styles.track} pointerEvents="none">
                    <View style={[styles.fill, { width: `${fillPercent}%` }]} />
                </View>

                {/* Thumb Visual */}
                {sliderWidth > 0 && (
                    <View
                        pointerEvents="none"
                        style={[styles.thumb, { left: thumbLeft }]}
                    />
                )}
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
        top: (48 - THUMB_SIZE) / 2,
    },
});
