import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    Animated,
    Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ExpoLinearGradient from 'expo-linear-gradient';
const LinearGradient = (ExpoLinearGradient as any).LinearGradient || (ExpoLinearGradient as any).default || ExpoLinearGradient;
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../src/store/useAppStore';
import { PresetCard } from '../src/components/PresetCard';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { useToast } from '../src/components/Toast';
import { colors, spacing } from '../src/constants/theme';

const { width } = Dimensions.get('window');

/**
 * Premium Home Screen
 * Displays saved presets and entry point for new recordings.
 */
export default function HomeScreen() {
    const router = useRouter();
    const { presets, deletePreset, loadPreset, isPlaying } = useAppStore();

    // Delete confirmation dialog state
    const [deleteDialog, setDeleteDialog] = useState<{ visible: boolean; id: string; name: string }>({
        visible: false,
        id: '',
        name: '',
    });

    const handleNewRecording = () => {
        router.push('/record');
    };

    const handlePresetPress = (preset: typeof presets[0]) => {
        loadPreset(preset);
        router.push('/player');
    };

    const handleDeletePreset = (id: string, name: string) => {
        setDeleteDialog({ visible: true, id, name });
    };

    const { showSuccess } = useToast();

    const confirmDelete = () => {
        const name = deleteDialog.name;
        deletePreset(deleteDialog.id);
        setDeleteDialog({ visible: false, id: '', name: '' });
        showSuccess('Deleted', `"${name}" has been removed`);
    };

    const cancelDelete = () => {
        setDeleteDialog({ visible: false, id: '', name: '' });
    };

    // Animated sound wave bars
    const wave1 = useRef(new Animated.Value(0)).current;
    const wave2 = useRef(new Animated.Value(0)).current;
    const wave3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateWave = (value: Animated.Value, delay: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(value, {
                        toValue: 1,
                        duration: 600,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(value, {
                        toValue: 0,
                        duration: 600,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        animateWave(wave1, 0);
        animateWave(wave2, 200);
        animateWave(wave3, 400);
    }, []);

    return (
        <View style={styles.container}>
            {/* Deep Space Background */}
            <LinearGradient colors={['#02040a', '#050a1b', '#02040a']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Brand Header */}
                    <View style={styles.header}>
                        <View style={styles.branding}>
                            <Image
                                source={require('../assets/logo.png')}
                                style={styles.brandLogo}
                                resizeMode="contain"
                            />
                            <Text style={styles.brandName}>SLEEP SOUNDS</Text>
                        </View>
                        <Text style={styles.tagline}>Create a peaceful space for your little one</Text>
                    </View>

                    {/* Recording CTA Card - Redesigned */}
                    <TouchableOpacity
                        style={styles.ctaCard}
                        onPress={handleNewRecording}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={['rgba(138, 43, 226, 0.15)', 'rgba(52, 152, 219, 0.1)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.ctaGradient}
                        >
                            {/* Sound Wave Visual Left */}
                            <View style={styles.waveGroup}>
                                <Animated.View style={[
                                    styles.ctaWave,
                                    styles.ctaWave1,
                                    { transform: [{ scaleY: wave1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) }] }
                                ]} />
                                <Animated.View style={[
                                    styles.ctaWave,
                                    styles.ctaWave2,
                                    { transform: [{ scaleY: wave2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }] }
                                ]} />
                                <Animated.View style={[
                                    styles.ctaWave,
                                    styles.ctaWave3,
                                    { transform: [{ scaleY: wave3.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }] }
                                ]} />
                            </View>

                            {/* Center Mic Button */}
                            <View style={styles.ctaMicContainer}>
                                <View style={styles.ctaMicOuter}>
                                    <View style={styles.ctaMicInner}>
                                        <Ionicons name="mic" size={32} color="#fff" />
                                    </View>
                                </View>
                                <Text style={styles.ctaLabel}>RECORD A LULLABY</Text>
                            </View>

                            {/* Sound Wave Visual Right */}
                            <View style={styles.waveGroup}>
                                <Animated.View style={[
                                    styles.ctaWave,
                                    styles.ctaWave3,
                                    { transform: [{ scaleY: wave3.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }] }
                                ]} />
                                <Animated.View style={[
                                    styles.ctaWave,
                                    styles.ctaWave2,
                                    { transform: [{ scaleY: wave2.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }] }
                                ]} />
                                <Animated.View style={[
                                    styles.ctaWave,
                                    styles.ctaWave1,
                                    { transform: [{ scaleY: wave1.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) }] }
                                ]} />
                            </View>
                        </LinearGradient>

                        {/* Bottom Action */}
                        <View style={styles.ctaBottom}>
                            <Text style={styles.ctaTitle}>CREATE YOUR LULLABY</Text>
                            <View style={styles.ctaArrow}>
                                <Ionicons name="arrow-forward" size={16} color={colors.accent} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Presets Grid */}
                    <View style={styles.presetsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>MY SAVED MIXES</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{presets.length}</Text>
                            </View>
                        </View>

                        {presets.length === 0 ? (
                            <View style={styles.emptyCard}>
                                <Ionicons name="musical-notes-outline" size={48} color="rgba(255,255,255,0.1)" />
                                <Text style={styles.emptyTitle}>NO MIXES YET</Text>
                                <Text style={styles.emptySub}>Your saved sleep atmospheres will appear here</Text>
                                <TouchableOpacity style={styles.emptyAction} onPress={handleNewRecording}>
                                    <Text style={styles.emptyActionText}>GET STARTED</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.presetsList}>
                                {[...presets].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).map((preset) => (
                                    <PresetCard
                                        key={preset.id}
                                        preset={preset}
                                        onPress={() => handlePresetPress(preset)}
                                        onDelete={() => handleDeletePreset(preset.id, preset.name)}
                                        isPlaying={isPlaying}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Innovative Footer Credit */}
            <View style={styles.footerBranding}>
                <Text style={styles.footerCredit}>
                    CRAFTED WITH ❤️ BY AAKASH BIST
                </Text>
            </View>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                visible={deleteDialog.visible}
                title="Remove Preset"
                message={`Delete "${deleteDialog.name}" from your collection?`}
                confirmText="DELETE"
                cancelText="KEEP"
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                destructive
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#02040a',
    },
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        marginVertical: spacing.xxl,
    },
    branding: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: spacing.md,
    },
    brandLogo: {
        width: 32,
        height: 32,
    },
    brandName: {
        fontSize: 14,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 6,
    },
    tagline: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    ctaCard: {
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
        marginBottom: spacing.xxl,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.lg,
    },
    waveGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ctaWave: {
        width: 4,
        backgroundColor: colors.accent,
        borderRadius: 2,
    },
    ctaWave1: {
        height: 20,
        opacity: 0.4,
    },
    ctaWave2: {
        height: 32,
        opacity: 0.6,
    },
    ctaWave3: {
        height: 44,
        opacity: 0.8,
    },
    ctaMicContainer: {
        alignItems: 'center',
        marginHorizontal: spacing.xl,
    },
    ctaMicOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(138, 43, 226, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    ctaMicInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.accent,
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    ctaLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 2,
    },
    ctaBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
        gap: spacing.sm,
    },
    ctaTitle: {
        fontSize: 11,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
    },
    ctaArrow: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaIconBox: {
        width: 56,
        height: 56,
        borderRadius: 20,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.lg,
    },
    ctaTextContent: {
        flex: 1,
    },
    ctaSub: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
    },
    presetsSection: {
        flex: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.lg,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 3,
    },
    countBadge: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    countText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: 'bold',
    },
    presetsList: {
        gap: spacing.md,
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: spacing.xxl * 1.5,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        borderStyle: 'dashed',
    },
    emptyTitle: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
        fontWeight: '900',
        letterSpacing: 2,
        marginTop: spacing.xl,
        marginBottom: 8,
    },
    emptySub: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.2)',
        textAlign: 'center',
        paddingHorizontal: spacing.xxl,
        lineHeight: 18,
    },
    emptyAction: {
        marginTop: spacing.xl,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    emptyActionText: {
        fontSize: 10,
        fontWeight: '900',
        color: colors.accent,
        letterSpacing: 1,
    },
    footerBranding: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingVertical: spacing.xs,
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: '#02040a',
    },
    footerCredit: {
        fontSize: 8,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 2,
        textAlign: 'center',
    },
});
