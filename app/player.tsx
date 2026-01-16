import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    StatusBar as RNStatusBar,
    Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ExpoLinearGradient from 'expo-linear-gradient';
const LinearGradient = (ExpoLinearGradient as any).LinearGradient || (ExpoLinearGradient as any).default || ExpoLinearGradient;
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../src/store/useAppStore';
import { useAudioPlayer } from '../src/hooks/useAudioPlayer';
import { SleepTimer } from '../src/components/SleepTimer';
import { VolumeSlider } from '../src/components/VolumeSlider';
import { colors, fontSize, spacing, borderRadius } from '../src/constants/theme';
import { getSoundSource, backgroundSounds } from '../src/constants/sounds';
import { useToast } from '../src/components/Toast';

const { width, height } = Dimensions.get('window');

// Star component for the background
const StarField = () => {
    const stars = useRef(Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        top: Math.random() * height,
        left: Math.random() * width,
        size: Math.random() * 2 + 1,
        opacity: new Animated.Value(Math.random() * 0.4 + 0.1),
    }))).current;

    useEffect(() => {
        stars.forEach(star => {
            const animate = () => {
                Animated.sequence([
                    Animated.timing(star.opacity, {
                        toValue: Math.random() * 0.7 + 0.3,
                        duration: Math.random() * 4000 + 3000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    Animated.timing(star.opacity, {
                        toValue: Math.random() * 0.2 + 0.1,
                        duration: Math.random() * 4000 + 3000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                ]).start(() => animate());
            };
            animate();
        });
    }, []);

    return (
        <View style={StyleSheet.absoluteFill}>
            {stars.map(star => (
                <Animated.View
                    key={star.id}
                    style={{
                        position: 'absolute',
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        borderRadius: star.size / 2,
                        backgroundColor: '#fff',
                        opacity: star.opacity,
                    }}
                />
            ))}
        </View>
    );
};

export default function PlayerScreen() {
    const router = useRouter();
    const {
        voiceUri,
        backgroundSound,
        voiceVolume,
        backgroundVolume,
        setVoiceVolume,
        setBackgroundVolume,
        sleepTimerMinutes,
        sleepTimerEndTime,
        setSleepTimer,
        setIsPlaying,
    } = useAppStore();

    const [showControls, setShowControls] = useState(true);
    const [childLock, setChildLock] = useState(false);

    // Core Animations
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const contentY = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Aurora Layers
    const aurora1 = useRef(new Animated.Value(0)).current;
    const aurora2 = useRef(new Animated.Value(0)).current;
    const aurora3 = useRef(new Animated.Value(0)).current;

    const selectedSoundInfo = backgroundSounds.find(s => s.id === backgroundSound);
    const { showError } = useToast();

    const {
        play,
        pause,
        resume,
        stop,
        togglePlayPause,
        playbackState,
        cleanup,
    } = useAudioPlayer({
        voiceUri: voiceUri || null,
        backgroundSoundUri: getSoundSource(backgroundSound),
        voiceVolume,
        backgroundVolume,
        loop: true,
        onPlaybackComplete: () => setIsPlaying(false),
        onError: (title, message) => showError(title, message),
    });

    useEffect(() => {
        if (voiceUri || backgroundSound) {
            play();
            setIsPlaying(true);
        }
        return () => {
            cleanup();
            setIsPlaying(false);
        };
    }, []);

    // Premium Animations Loop
    useEffect(() => {
        if (playbackState.isPlaying) {
            // Calm pulse
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.04, duration: 6000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 6000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
                ])
            ).start();

            // Aurora movement helper
            const loopAnim = (anim: Animated.Value, duration: number) => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(anim, { toValue: 1, duration, useNativeDriver: true, easing: Easing.inOut(Easing.linear) }),
                        Animated.timing(anim, { toValue: 0, duration, useNativeDriver: true, easing: Easing.inOut(Easing.linear) }),
                    ])
                ).start();
            };

            loopAnim(aurora1, 30000);
            loopAnim(aurora2, 35000);
            loopAnim(aurora3, 40000);
        } else {
            pulseAnim.stopAnimation();
            aurora1.stopAnimation();
            aurora2.stopAnimation();
            aurora3.stopAnimation();
        }
    }, [playbackState.isPlaying]);

    // Auto-hide controls
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        if (showControls && playbackState.isPlaying && !childLock) {
            timeout = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(fadeAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
                    Animated.timing(contentY, { toValue: 50, duration: 2000, useNativeDriver: true })
                ]).start(() => setShowControls(false));
            }, 10000);
        }
        return () => clearTimeout(timeout);
    }, [showControls, playbackState.isPlaying, childLock]);

    const showUI = () => {
        setShowControls(true);
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.back(1)) }),
            Animated.timing(contentY, { toValue: 0, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.back(1)) })
        ]).start();
    };

    const handleScreenPress = () => {
        if (childLock) return;
        if (!showControls) showUI();
    };

    const handleLongPress = () => {
        if (childLock) {
            setChildLock(false);
            showUI();
        }
    };

    // Aurora Interpolations
    const a1Rotate = aurora1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '60deg'] });
    const a2Scale = aurora2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });
    const a3X = aurora3.interpolate({ inputRange: [0, 1], outputRange: [-50, 50] });

    return (
        <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handleScreenPress} onLongPress={handleLongPress} delayLongPress={2000}>
            <RNStatusBar hidden />

            {/* Cinematic Background */}
            <LinearGradient colors={['#02040a', '#050a1b', '#02040a']} style={StyleSheet.absoluteFill} />

            <Animated.View style={[styles.aurora, { transform: [{ rotate: a1Rotate }], opacity: 0.12 }]}>
                <LinearGradient colors={['transparent', '#3498db', 'transparent']} style={styles.auroraGradient} />
            </Animated.View>

            <Animated.View style={[styles.aurora, { transform: [{ scale: a2Scale }], opacity: 0.08 }]}>
                <LinearGradient colors={['transparent', '#9b59b6', 'transparent']} style={styles.auroraGradient} />
            </Animated.View>

            <Animated.View style={[styles.aurora, { transform: [{ translateX: a3X }], opacity: 0.1 }]}>
                <LinearGradient colors={['transparent', '#16a085', 'transparent']} style={styles.auroraGradient} />
            </Animated.View>

            <StarField />

            <SafeAreaView style={styles.safeArea}>
                {/* Header Section */}
                <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: contentY }] }]}>
                    <TouchableOpacity onPress={() => { stop(); router.back(); }} style={styles.roundBtn}>
                        <Ionicons name="chevron-down" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.zenTitle}>{selectedSoundInfo?.name || 'Your Recording'}</Text>

                    <TouchableOpacity onPress={() => setChildLock(!childLock)} style={[styles.roundBtn, childLock && styles.activeBtn]}>
                        <Ionicons name={childLock ? "lock-closed" : "lock-open-outline"} size={18} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Focal Point */}
                <View style={styles.focusContainer}>
                    <Animated.View style={[styles.outerOrb, { transform: [{ scale: pulseAnim }] }]}>
                        <View style={styles.innerOrb}>
                            <Text style={styles.focusEmoji}>{selectedSoundInfo?.icon || '🌙'}</Text>
                        </View>

                        {/* Progress Ring Simulation */}
                        <View style={styles.ring} />
                    </Animated.View>

                    <View style={styles.metaContainer}>
                    </View>
                </View>

                {/* Interaction Layer */}
                <Animated.View style={[styles.footer, { opacity: fadeAnim, transform: [{ translateY: contentY }] }]}>
                    {childLock ? (
                        <View style={styles.lockOverlay}>
                            <Ionicons name="finger-print" size={40} color="rgba(255,255,255,0.2)" />
                            <Text style={styles.lockHint}>HOLD FOR 2s TO UNLOCK</Text>
                        </View>
                    ) : (
                        <View style={styles.controlsWrap}>
                            <TouchableOpacity style={styles.playFab} onPress={togglePlayPause}>
                                <Ionicons name={playbackState.isPlaying ? "pause" : "play"} size={40} color="#000" style={!playbackState.isPlaying && { marginLeft: 4 }} />
                            </TouchableOpacity>

                            <View style={styles.mixerCard}>
                                <VolumeSlider label="VOICE DEPTH" value={voiceVolume} onValueChange={setVoiceVolume} icon="🎤" />
                                <View style={styles.divider} />
                                <VolumeSlider label="AMBIENT LEVEL" value={backgroundVolume} onValueChange={setBackgroundVolume} icon={selectedSoundInfo?.icon || '🌊'} />
                            </View>

                            <View style={styles.timerWrap}>
                                <SleepTimer selectedMinutes={sleepTimerMinutes} endTime={sleepTimerEndTime} onSelectTimer={setSleepTimer} />
                            </View>
                        </View>
                    )}
                </Animated.View>
            </SafeAreaView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#02040a' },
    safeArea: { flex: 1 },
    aurora: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
    auroraGradient: { width: width * 2, height: height, borderRadius: width },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, height: 70 },
    roundBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    activeBtn: { backgroundColor: colors.accent, borderColor: 'rgba(255,255,255,0.4)' },
    zenTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '900', letterSpacing: 5, textTransform: 'uppercase' },
    focusContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    outerOrb: { width: 220, height: 220, borderRadius: 110, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    innerOrb: { width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', shadowColor: '#fff', shadowOpacity: 0.05, shadowRadius: 30 },
    focusEmoji: { fontSize: 80 },
    ring: { position: 'absolute', width: 240, height: 240, borderRadius: 120, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', borderStyle: 'dashed' },
    metaContainer: { alignItems: 'center', marginTop: spacing.xl },
    mainTitle: { fontSize: 32, fontWeight: '100', color: '#fff', letterSpacing: 2 },
    indicatorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)', marginRight: 8 },
    pulseDotActive: { backgroundColor: '#2ecc71', shadowColor: '#2ecc71', shadowOpacity: 1, shadowRadius: 5 },
    subtext: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
    footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
    controlsWrap: { alignItems: 'center' },
    playFab: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#fff', shadowOpacity: 0.2, shadowRadius: 15, elevation: 12, marginBottom: -30, zIndex: 10 },
    mixerCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 32, padding: 24, paddingTop: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.03)', marginVertical: 12 },
    timerWrap: { marginTop: 24 },
    lockOverlay: { alignItems: 'center', padding: 40 },
    lockHint: { color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 'bold', letterSpacing: 3, marginTop: 20 }
});
