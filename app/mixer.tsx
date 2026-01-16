import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ExpoLinearGradient from 'expo-linear-gradient';
const LinearGradient = (ExpoLinearGradient as any).LinearGradient || (ExpoLinearGradient as any).default || ExpoLinearGradient;
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../src/store/useAppStore';
import { VolumeSlider } from '../src/components/VolumeSlider';
import { SoundSelector } from '../src/components/SoundSelector';
import { colors, fontSize, spacing, borderRadius } from '../src/constants/theme';
import { useToast } from '../src/components/Toast';

const { width } = Dimensions.get('window');

/**
 * Premium Mixer Screen
 * Allows parents to combine voice and background sounds
 * with independent volume controls and preset saving.
 */
export default function MixerScreen() {
    const router = useRouter();
    const {
        voiceUri,
        backgroundSound,
        voiceVolume,
        backgroundVolume,
        setBackgroundSound,
        setVoiceVolume,
        setBackgroundVolume,
        savePreset,
    } = useAppStore();

    const [saveModalVisible, setSaveModalVisible] = useState(false);
    const [presetName, setPresetName] = useState('');
    const { showSuccess, showWarning } = useToast();

    const handlePlay = () => {
        router.push('/player');
    };

    const handleSavePreset = () => {
        if (!presetName.trim()) {
            showWarning('Incomplete', 'Please give your sound a name');
            return;
        }

        savePreset(presetName.trim());
        setSaveModalVisible(false);
        setPresetName('');
        showSuccess('Mix Saved', 'Your unique sleep sound is ready!');
        // Navigate home after a brief delay to let user see the toast
        setTimeout(() => router.push('/'), 1500);
    };

    const canPlay = voiceUri || backgroundSound;

    return (
        <View style={styles.container}>
            {/* Deep Space Background */}
            <LinearGradient colors={['#02040a', '#050a1b', '#02040a']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>CRAFT MIX</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Voice Card */}
                    <View style={styles.glassCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.titleRow}>
                                <Ionicons name="mic-outline" size={20} color={colors.accent} />
                                <Text style={styles.cardTitle}>VOICE OVER</Text>
                            </View>
                            <View style={[styles.statusBadge, voiceUri ? styles.statusActive : styles.statusEmpty]}>
                                <Text style={styles.statusText}>{voiceUri ? 'READY' : 'NONE'}</Text>
                            </View>
                        </View>

                        {voiceUri ? (
                            <View style={styles.cardBody}>
                                <VolumeSlider
                                    label="VOICE PURITY"
                                    value={voiceVolume}
                                    onValueChange={setVoiceVolume}
                                    icon="🎤"
                                />
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.addVoiceBtn} onPress={() => router.push('/record')}>
                                <Text style={styles.addVoiceText}>+ START RECORDING</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Ambient Selection */}
                    <View style={styles.ambientSection}>
                        <SoundSelector
                            selectedSound={backgroundSound}
                            onSelectSound={setBackgroundSound}
                        />

                        {backgroundSound && (
                            <View style={[styles.glassCard, { marginTop: spacing.md }]}>
                                <VolumeSlider
                                    label="AMBIENT VIBE"
                                    value={backgroundVolume}
                                    onValueChange={setBackgroundVolume}
                                    icon="🌊"
                                />
                            </View>
                        )}
                    </View>

                    {!canPlay && (
                        <View style={styles.hintContainer}>
                            <Text style={styles.hintText}>SELECT A SOUND OR VOICE TO START</Text>
                        </View>
                    )}
                </ScrollView>

                {/* Footer Controls */}
                <View style={[styles.bottomActions, !canPlay && { opacity: 0.5 }]}>
                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => setSaveModalVisible(true)}
                        disabled={!canPlay}
                    >
                        <Text style={styles.secondaryBtnText}>SAVE MIX</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.primaryBtn, !canPlay && styles.btnDisabled]}
                        onPress={handlePlay}
                        disabled={!canPlay}
                    >
                        <Text style={styles.primaryBtnText}>PREVIEW</Text>
                        <Ionicons name="play" size={18} color="#000" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Premium Save Modal */}
            <Modal
                visible={saveModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSaveModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setSaveModalVisible(false)}
                >
                    <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
                        <Text style={styles.modalLabel}>SAVE PRESET</Text>
                        <Text style={styles.modalSub}>Name your unique sleep atmosphere</Text>

                        <TextInput
                            style={styles.modalInput}
                            value={presetName}
                            onChangeText={setPresetName}
                            placeholder="e.g. Moonlight Rain"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            autoFocus
                        />

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.modalCancel}
                                onPress={() => setSaveModalVisible(false)}
                            >
                                <Text style={styles.modalCancelText}>CANCEL</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalSave}
                                onPress={handleSavePreset}
                            >
                                <Text style={styles.modalSaveText}>SAVE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        height: 80,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
    },
    glassCard: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 32,
        marginHorizontal: spacing.lg,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: spacing.xl,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardTitle: {
        fontSize: 10,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 2,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusActive: {
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
    },
    statusEmpty: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    statusText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: colors.success,
        letterSpacing: 1,
    },
    cardBody: {
        marginTop: spacing.sm,
    },
    addVoiceBtn: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        paddingVertical: spacing.md,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderStyle: 'dashed',
    },
    addVoiceText: {
        color: colors.accent,
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    ambientSection: {
        marginBottom: spacing.xl,
    },
    hintContainer: {
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    hintText: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    bottomActions: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        gap: spacing.md,
    },
    secondaryBtn: {
        flex: 1,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    secondaryBtnText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
    },
    primaryBtn: {
        flex: 1.5,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#fff',
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    primaryBtnText: {
        color: '#000',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
    },
    btnDisabled: {
        opacity: 0.3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        width: width * 0.85,
        backgroundColor: '#0c1425',
        borderRadius: 40,
        padding: spacing.xxl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 30,
    },
    modalLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 3,
        textAlign: 'center',
        marginBottom: 8,
    },
    modalSub: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '300',
        textAlign: 'center',
        marginBottom: spacing.xxl,
    },
    modalInput: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        paddingHorizontal: spacing.lg,
        height: 60,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: spacing.xxl,
    },
    modalFooter: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    modalCancel: {
        flex: 1,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCancelText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    modalSave: {
        flex: 2,
        height: 54,
        borderRadius: 27,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalSaveText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
});
