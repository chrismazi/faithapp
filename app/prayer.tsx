import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../components/common/AppText';
import { Colors, Spacing } from '../constants/theme';
import { DailyContent, getTodayVerse } from '../services/content';

const { height } = Dimensions.get('window');

interface PrayerStep {
    title: string;
    content: string;
    icon: keyof typeof Ionicons.glyphMap;
}

export default function PrayerScreen() {
    const router = useRouter();
    const [todayVerse, setTodayVerse] = useState<DailyContent | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const prayerSteps: PrayerStep[] = todayVerse ? [
        {
            title: 'Breathe',
            content: 'Take a slow, deep breath. Let go of distractions. Become present.',
            icon: 'ellipse-outline',
        },
        {
            title: 'Read',
            content: todayVerse.text,
            icon: 'book-outline',
        },
        {
            title: 'Pray',
            content: todayVerse.prayerPrompt,
            icon: 'heart-outline',
        },
        {
            title: 'Listen',
            content: 'Sit quietly. Is God speaking anything to you through this verse?',
            icon: 'ear-outline',
        },
        {
            title: 'Respond',
            content: 'Speak to God in your own words. He\'s listening.',
            icon: 'chatbubble-outline',
        },
    ] : [];

    useEffect(() => {
        const verse = getTodayVerse();
        setTodayVerse(verse);
    }, []);

    useEffect(() => {
        if (prayerSteps.length === 0) return;
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, [currentStep, prayerSteps.length]);

    const handleNext = () => {
        if (currentStep < prayerSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (!todayVerse) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <AppText>Loading...</AppText>
                </View>
            </SafeAreaView>
        );
    }

    if (isComplete) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.completeContainer}>
                    <View style={styles.completeIcon}>
                        <Ionicons name="checkmark-circle" size={64} color={Colors.primary} />
                    </View>
                    <AppText variant="h1" align="center">Well Done</AppText>
                    <AppText variant="body" align="center" color={Colors.textSecondary} style={styles.completeText}>
                        You took time to connect with God today.
                    </AppText>
                    <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
                        <AppText variant="body" color="#FFF">Done</AppText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const current = prayerSteps[currentStep];

    return (
        <SafeAreaView style={styles.container}>
            {/* Close */}
            <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>

            {/* Progress */}
            <View style={styles.progressRow}>
                {prayerSteps.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.progressDot,
                            i === currentStep && styles.progressActive,
                            i < currentStep && styles.progressDone,
                        ]}
                    />
                ))}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Animated.View style={[styles.stepContent, { opacity: fadeAnim }]}>
                    <View style={styles.stepIcon}>
                        <Ionicons name={current.icon} size={32} color={Colors.primary} />
                    </View>
                    <AppText variant="caption" color={Colors.primary} style={styles.stepLabel}>
                        Step {currentStep + 1}
                    </AppText>
                    <AppText variant="h1" align="center" style={styles.stepTitle}>
                        {current.title}
                    </AppText>
                    <AppText variant="body" align="center" style={styles.stepText}>
                        {current.content}
                    </AppText>
                </Animated.View>
            </View>

            {/* Navigation */}
            <View style={styles.navRow}>
                <TouchableOpacity
                    style={[styles.navBtn, currentStep === 0 && styles.navDisabled]}
                    onPress={handlePrev}
                    disabled={currentStep === 0}
                >
                    <Ionicons name="chevron-back" size={20} color={currentStep === 0 ? '#CCC' : Colors.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                    <AppText variant="body" color="#FFF" style={{ fontWeight: '600' }}>
                        {currentStep === prayerSteps.length - 1 ? 'Finish' : 'Continue'}
                    </AppText>
                </TouchableOpacity>

                <View style={styles.navBtn} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        position: 'absolute',
        top: Spacing.xl + 16,
        right: Spacing.lg,
        zIndex: 10,
        padding: 8,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: Spacing.xl + 16,
        gap: 8,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
    },
    progressActive: {
        backgroundColor: Colors.primary,
        width: 20,
    },
    progressDone: {
        backgroundColor: Colors.primary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    stepContent: {
        alignItems: 'center',
    },
    stepIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#E8F0E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    stepLabel: {
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
    },
    stepTitle: {
        marginBottom: Spacing.md,
    },
    stepText: {
        lineHeight: 24,
        paddingHorizontal: Spacing.md,
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    navBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navDisabled: {
        opacity: 0.4,
    },
    nextBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: 24,
    },
    completeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    completeIcon: {
        marginBottom: Spacing.lg,
    },
    completeText: {
        marginTop: 8,
        marginBottom: Spacing.xl,
    },
    doneBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.md,
        borderRadius: 24,
    },
});
