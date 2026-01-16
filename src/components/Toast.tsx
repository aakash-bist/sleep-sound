import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../constants/theme';

const { width } = Dimensions.get('window');

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
    id: string;
    title: string;
    message?: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (title: string, message?: string, type?: ToastType, duration?: number) => void;
    showSuccess: (title: string, message?: string) => void;
    showError: (title: string, message?: string) => void;
    showInfo: (title: string, message?: string) => void;
    showWarning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

const getToastColors = (type: ToastType) => {
    switch (type) {
        case 'success':
            return { bg: '#0d2818', border: 'rgba(46, 204, 113, 0.4)', icon: '✓' };
        case 'error':
            return { bg: '#2d1215', border: 'rgba(231, 76, 60, 0.4)', icon: '✕' };
        case 'warning':
            return { bg: '#2d2510', border: 'rgba(241, 196, 15, 0.4)', icon: '⚠' };
        case 'info':
        default:
            return { bg: '#0d1a2d', border: 'rgba(52, 152, 219, 0.4)', icon: 'ℹ' };
    }
};

interface ToastItemProps {
    toast: ToastMessage;
    onHide: (id: string) => void;
}

function ToastItem({ toast, onHide }: ToastItemProps) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Slide in
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 80,
                friction: 10,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto hide
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -100,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => onHide(toast.id));
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
    }, []);

    const toastColors = getToastColors(toast.type);

    return (
        <Animated.View
            style={[
                styles.toast,
                {
                    backgroundColor: toastColors.bg,
                    borderColor: toastColors.border,
                    transform: [{ translateY }],
                    opacity,
                },
            ]}
        >
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{toastColors.icon}</Text>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{toast.title}</Text>
                {toast.message && <Text style={styles.message}>{toast.message}</Text>}
            </View>
        </Animated.View>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const insets = useSafeAreaInsets();

    const showToast = useCallback((title: string, message?: string, type: ToastType = 'info', duration?: number) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, title, message, type, duration }]);
    }, []);

    const showSuccess = useCallback((title: string, message?: string) => {
        showToast(title, message, 'success');
    }, [showToast]);

    const showError = useCallback((title: string, message?: string) => {
        showToast(title, message, 'error', 4000);
    }, [showToast]);

    const showInfo = useCallback((title: string, message?: string) => {
        showToast(title, message, 'info');
    }, [showToast]);

    const showWarning = useCallback((title: string, message?: string) => {
        showToast(title, message, 'warning', 4000);
    }, [showToast]);

    const hideToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo, showWarning }}>
            {children}
            <View style={[styles.container, { top: insets.top + 10 }]} pointerEvents="none">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} onHide={hideToast} />
                ))}
            </View>
        </ToastContext.Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: spacing.lg,
        right: spacing.lg,
        zIndex: 9999,
        alignItems: 'center',
    },
    toast: {
        flexDirection: 'row',
        width: width - spacing.lg * 2,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: spacing.sm,
        alignItems: 'center',
        // Glassmorphism effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    icon: {
        fontSize: 16,
        color: '#fff',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    message: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 2,
        lineHeight: 16,
    },
});
