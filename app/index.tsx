import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Dimensions,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ExpoLinearGradient from 'expo-linear-gradient';
const LinearGradient = (ExpoLinearGradient as any).LinearGradient || (ExpoLinearGradient as any).default || ExpoLinearGradient;
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../src/store/useAppStore';
import { PresetCard } from '../src/components/PresetCard';
import { colors, spacing } from '../src/constants/theme';

const { width } = Dimensions.get('window');

/**
 * Premium Home Screen
 * Displays saved presets and entry point for new recordings.
 */
export default function HomeScreen() {
    const router = useRouter();
    const { presets, deletePreset, loadPreset, isPlaying } = useAppStore();

    const handleNewRecording = () => {
        router.push('/record');
    };

    const handlePresetPress = (preset: typeof presets[0]) => {
        loadPreset(preset);
        router.push('/player');
    };

    const handleDeletePreset = (id: string, name: string) => {
        Alert.alert(
            'Remove Preset',
            `Delete "${name}" from your collection?`,
            [
                { text: 'KEEP', style: 'cancel' },
                {
                    text: 'DELETE',
                    style: 'destructive',
                    onPress: () => deletePreset(id),
                },
            ]
        );
    };

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
                                source={require('../assets/icon.png')}
                                style={styles.brandLogo}
                                resizeMode="contain"
                            />
                            <Text style={styles.brandName}>SLEEP SOUNDS</Text>
                        </View>
                        <Text style={styles.tagline}>Create a peaceful space for your little one</Text>
                    </View>

                    {/* Quick Start Card */}
                    <TouchableOpacity
                        style={styles.ctaCard}
                        onPress={handleNewRecording}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                            style={styles.ctaGradient}
                        >
                            <View style={styles.ctaIconBox}>
                                <Ionicons name="mic" size={28} color="#fff" />
                            </View>
                            <View style={styles.ctaTextContent}>
                                <Text style={styles.ctaTitle}>NEW RECORDING</Text>
                                <Text style={styles.ctaSub}>Capture a lullaby or bedtime story</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
                        </LinearGradient>
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
                                {presets.map((preset) => (
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
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: spacing.xxl,
    },
    ctaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.xl,
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
    ctaTitle: {
        fontSize: 12,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
        marginBottom: 4,
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
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    footerCredit: {
        fontSize: 8,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: 4,
        textAlign: 'center',
    },
});
