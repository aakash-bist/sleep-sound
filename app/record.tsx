import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ExpoLinearGradient from 'expo-linear-gradient';
const LinearGradient = (ExpoLinearGradient as any).LinearGradient || (ExpoLinearGradient as any).default || ExpoLinearGradient;
import { Ionicons } from '@expo/vector-icons';
import { useAudioRecorder } from '../src/hooks/useAudioRecorder';
import { useAppStore } from '../src/store/useAppStore';
import { RecordButton } from '../src/components/RecordButton';
import { colors, spacing } from '../src/constants/theme';

const { width } = Dimensions.get('window');

/**
 * Premium Record Screen
 * Minimalist interface for capturing voice lullabies.
 */
export default function RecordScreen() {
    const router = useRouter();
    const { setVoiceUri } = useAppStore();
    const {
        startRecording,
        stopRecording,
        deleteRecording,
        status,
        permissionGranted,
        formatDuration,
    } = useAudioRecorder();

    const [recordingUri, setRecordingUri] = useState<string | null>(null);

    const handleRecordPress = async () => {
        try {
            if (status.isRecording) {
                const uri = await stopRecording();
                if (uri) {
                    setRecordingUri(uri);
                }
            } else {
                if (recordingUri) {
                    await deleteRecording(recordingUri);
                    setRecordingUri(null);
                }
                await startRecording();
            }
        } catch (error) {
            Alert.alert('Microphone Error', 'We couldn\'t start the recording. Please check your permissions.');
        }
    };

    const handleReRecord = async () => {
        if (recordingUri) {
            await deleteRecording(recordingUri);
            setRecordingUri(null);
        }
    };

    const handleNext = () => {
        if (recordingUri) {
            setVoiceUri(recordingUri);
            router.push('/mixer');
        }
    };

    if (permissionGranted === false) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['#02040a', '#050a1b', '#02040a']} style={StyleSheet.absoluteFill} />
                <SafeAreaView style={styles.permissionContainer}>
                    <Ionicons name="mic-off-outline" size={80} color="rgba(255,255,255,0.1)" />
                    <Text style={styles.permissionTitle}>VOICE ACCESS REQUIRED</Text>
                    <Text style={styles.permissionText}>
                        To record your lullabies, we need permission to use the microphone. Please enable it in Settings.
                    </Text>
                    <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
                        <Text style={styles.primaryBtnText}>GO BACK</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#02040a', '#050a1b', '#02040a']} style={StyleSheet.absoluteFill} />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.roundBtn}>
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerLabel}>VOICE CAPTURE</Text>
                    <View style={{ width: 44 }} />
                </View>

                <View style={styles.content}>
                    {/* Instructions */}
                    <View style={styles.instructionWrap}>
                        <Text style={styles.mainTitle}>
                            {recordingUri ? 'RECORDING SAVED' : status.isRecording ? 'LIVE RECORDING' : 'CAPTURE A LULLABY'}
                        </Text>
                        <Text style={styles.subtext}>
                            {recordingUri
                                ? 'Your voice is ready to be mixed with soothing ambient sounds.'
                                : status.isRecording
                                    ? 'Speak softly, the microphone is active and capturing...'
                                    : 'Record a story, a song, or just a calming message for bedtime.'}
                        </Text>
                    </View>

                    {/* Recorder Section */}
                    <View style={styles.recordFocus}>
                        {!recordingUri ? (
                            <RecordButton
                                isRecording={status.isRecording}
                                onPress={handleRecordPress}
                                durationMs={status.durationMs}
                            />
                        ) : (
                            <View style={styles.completedBox}>
                                <View style={styles.checkCircle}>
                                    <Ionicons name="checkmark" size={60} color="#fff" />
                                </View>
                                <View style={styles.timeBadge}>
                                    <Text style={styles.timeText}>{formatDuration(status.durationMs)}</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        {recordingUri ? (
                            <View style={styles.actionRow}>
                                <TouchableOpacity style={styles.secondaryBtn} onPress={handleReRecord}>
                                    <Text style={styles.secondaryBtnText}>RE-RECORD</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
                                    <Text style={styles.primaryBtnText}>CONTINUE</Text>
                                    <Ionicons name="arrow-forward" size={18} color="#000" style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                            </View>
                        ) : !status.isRecording ? (
                            <TouchableOpacity style={styles.skipBtn} onPress={() => router.push('/mixer')}>
                                <Text style={styles.skipBtnText}>SKIP TO AMBIENT SOUNDS</Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={styles.recordingHint}>TAP TO FINISH RECORDING</Text>
                        )}
                    </View>
                </View>
            </SafeAreaView>
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
        height: 70,
    },
    roundBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerLabel: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        justifyContent: 'space-between',
    },
    instructionWrap: {
        alignItems: 'center',
        marginTop: spacing.xxl,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
        marginBottom: spacing.md,
    },
    subtext: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: spacing.xl,
        fontWeight: '500',
    },
    recordFocus: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completedBox: {
        alignItems: 'center',
    },
    checkCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: colors.success,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.success,
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: spacing.xl,
    },
    timeBadge: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    timeText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    footer: {
        paddingBottom: spacing.xxl,
    },
    actionRow: {
        flexDirection: 'row',
        gap: spacing.md,
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
    skipBtn: {
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    skipBtnText: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
        textDecorationLine: 'underline',
    },
    recordingHint: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 3,
        textAlign: 'center',
    },
    permissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xxl,
    },
    permissionTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 4,
        marginTop: spacing.xl,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    permissionText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: spacing.xxl,
    },
});
