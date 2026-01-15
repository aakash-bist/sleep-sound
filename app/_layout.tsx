import { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import * as ExpoLinearGradient from 'expo-linear-gradient';
const LinearGradient = (ExpoLinearGradient as any).LinearGradient || (ExpoLinearGradient as any).default || ExpoLinearGradient;
import { colors, fontSize, spacing } from '../src/constants/theme';

// Prevent auto-hide of splash
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [showSplash, setShowSplash] = useState(true);
    const fadeAnim = useState(new Animated.Value(1))[0];

    useEffect(() => {
        // Hide the native splash screen
        SplashScreen.hideAsync();

        // Show our custom splash for 2.5 seconds
        const timer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setShowSplash(false);
            });
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return (
            <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
                <StatusBar style="light" />
                <LinearGradient colors={['#02040a', '#050a1b', '#02040a']} style={StyleSheet.absoluteFill} />
                <View style={styles.splashContent}>
                    <Image
                        source={require('../assets/icon.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.splashTitle}>SLEEP SOUNDS</Text>
                    <Text style={styles.splashSubtitle}>RESTORATIVE AUDIO FOR CHILDREN</Text>
                </View>
                <View style={styles.splashFooter}>
                    <Text style={styles.splashCredits}>
                        CRAFTED with ❤️ BY AAKASH BIST
                    </Text>
                </View>
            </Animated.View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: '#02040a',
                    },
                    animation: 'fade',
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="record" />
                <Stack.Screen name="mixer" />
                <Stack.Screen name="player" />
            </Stack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#02040a',
    },
    splashContainer: {
        flex: 1,
        backgroundColor: '#02040a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    splashContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 180,
        height: 180,
        marginBottom: spacing.xxl,
    },
    splashTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 8,
        marginBottom: spacing.md,
    },
    splashSubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 2,
    },
    splashFooter: {
        paddingBottom: 60,
    },
    splashCredits: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 2,
    },
});
