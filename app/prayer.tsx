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
    duration: number; // seconds
}

export default function PrayerScreen() {
    const router = useRouter();
    const [todayVerse, setTodayVerse] = useState<DailyContent | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const prayerSteps: PrayerStep[] = todayVerse ? [
        {
            title: 'Center Yourself',
            content: 'Take a deep breath. Close your eyes if you\'d like. Let go of distractions and become present with God.',
            duration: 10,
        },
        {
            title: 'Scripture Focus',
            content: todayVerse.text,
            duration: 15,
        },
        {
            title: 'Guided Prayer',
            content: todayVerse.prayerPrompt,
            duration: 20,
        },
        {
            title: 'Listen',
            content: 'Sit quietly for a moment. Is there anything God might be saying to you through this verse today?',
            duration: 15,
        },
        {
            title: 'Respond',
            content: 'Speak to God in your own words. Share what\'s on your heart. He\'s listening.',
            duration: 20,
        },
    ] : [];

    useEffect(() => {
        const verse = getTodayVerse();
        setTodayVerse(verse);
    }, []);

    useEffect(() => {
        if (prayerSteps.length === 0) return;

        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Progress animation
        const currentDuration = prayerSteps[currentStep]?.duration || 10;
        progressAnim.setValue(0);
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: currentDuration * 1000,
            useNativeDriver: false,
        }).start();

    }, [currentStep, prayerSteps.length]);

    const handleNext = () => {
        if (currentStep < prayerSteps.length - 1) {
            fadeAnim.setValue(0);
            setCurrentStep(currentStep + 1);
        } else {
            setIsComplete(true);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            fadeAnim.setValue(0);
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
                        <Ionicons name="checkmark-circle" size={80} color={Colors.primary} />
                    </View>
                    <AppText variant="h1" align="center" style={styles.completeTitle}>
                        Prayer Complete
                    </AppText>
                    <AppText variant="body" align="center" color={Colors.textSecondary} style={styles.completeText}>
                        You've taken time to connect with God today. That matters more than you know.
                    </AppText>
                    <TouchableOpacity
                        style={styles.doneButton}
                        onPress={() => router.back()}
                    >
                        <AppText variant="body" color="#FFF">Return Home</AppText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const currentPrayer = prayerSteps[currentStep];

    return (
        <SafeAreaView style={styles.container}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                <Ionicons name="close" size={28} color={Colors.text} />
            </TouchableOpacity>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                {prayerSteps.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.progressDot,
                            index === currentStep && styles.progressDotActive,
                            index < currentStep && styles.progressDotComplete,
                        ]}
                    />
                ))}
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Animated.View style={[styles.prayerContent, { opacity: fadeAnim }]}>
                    <AppText variant="caption" color={Colors.primary} style={styles.stepLabel}>
                        Step {currentStep + 1} of {prayerSteps.length}
                    </AppText>
                    <AppText variant="h1" align="center" style={styles.prayerTitle}>
                        {currentPrayer.title}
                    </AppText>
                    <AppText variant="body" align="center" style={styles.prayerText}>
                        {currentPrayer.content}
                    </AppText>
                </Animated.View>
            </View>

            {/* Timer Bar */}
            <View style={styles.timerContainer}>
                <Animated.View
                    style={[
                        styles.timerBar,
                        {
                            width: progressAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                            }),
                        }
                    ]}
                />
            </View>

            {/* Navigation */}
            <View style={styles.navigation}>
                <TouchableOpacity
                    style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
                    onPress={handlePrevious}
                    disabled={currentStep === 0}
                >
                    <Ionicons name="chevron-back" size={24} color={currentStep === 0 ? Colors.textSecondary : Colors.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <AppText variant="body" color="#FFF">
                        {currentStep === prayerSteps.length - 1 ? 'Finish' : 'Continue'}
                    </AppText>
                    <Ionicons name="chevron-forward" size={20} color="#FFF" style={{ marginLeft: 4 }} />
                </TouchableOpacity>

                <View style={styles.navButton} />
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
    closeButton: {
        position: 'absolute',
        top: Spacing.xl + 20,
        right: Spacing.lg,
        zIndex: 10,
        padding: Spacing.sm,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: Spacing.xl + 20,
        gap: Spacing.sm,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
    },
    progressDotActive: {
        backgroundColor: Colors.primary,
        width: 24,
    },
    progressDotComplete: {
        backgroundColor: Colors.primary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    prayerContent: {
        alignItems: 'center',
    },
    stepLabel: {
        marginBottom: Spacing.md,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    prayerTitle: {
        marginBottom: Spacing.xl,
        color: Colors.text,
    },
    prayerText: {
        lineHeight: 28,
        fontSize: 18,
        color: Colors.text,
        paddingHorizontal: Spacing.md,
    },
    timerContainer: {
        height: 4,
        backgroundColor: '#E8E8E8',
        marginHorizontal: Spacing.xl,
        borderRadius: 2,
        overflow: 'hidden',
    },
    timerBar: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.xl,
        paddingBottom: Spacing.xxl,
    },
    navButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    nextButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: 30,
    },
    completeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    completeIcon: {
        marginBottom: Spacing.xl,
    },
    completeTitle: {
        marginBottom: Spacing.md,
    },
    completeText: {
        lineHeight: 24,
        marginBottom: Spacing.xxl,
        paddingHorizontal: Spacing.lg,
    },
    doneButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.md,
        borderRadius: 30,
    },
});
