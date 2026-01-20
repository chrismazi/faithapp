import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
import { Card } from '../../components/common/Card';
import { Colors, Spacing } from '../../constants/theme';
import { DailyContent, getTodayVerse } from '../../services/content';
import { StorageService } from '../../services/storage';

export default function ReflectionScreen() {
    const [reflection, setReflection] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);
    const [todayVerse, setTodayVerse] = useState<DailyContent | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const verse = getTodayVerse();
                setTodayVerse(verse);
                const premium = await StorageService.isPremium();
                setIsPremium(premium);
            } catch (error) {
                console.error('Error loading reflection:', error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleSave = async () => {
        if (!reflection.trim() || !todayVerse) return;

        setIsSaving(true);
        try {
            await StorageService.saveReflection({
                verseId: todayVerse.id,
                content: reflection,
                date: new Date().toISOString(),
            });
            setShowSuccess(true);
            setReflection('');
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            alert('Failed to save reflection. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !todayVerse) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <AppText variant="caption" color={Colors.textSecondary}>{todayVerse.reference}</AppText>
                        <AppText variant="h2">Understanding Today's Verse</AppText>
                    </View>

                    {/* Scripture Reminder */}
                    <Card padding="lg" style={styles.verseReminder}>
                        <AppText variant="body" style={styles.verseText} align="center">
                            {todayVerse.text}
                        </AppText>
                    </Card>

                    {/* Plain English Explanation */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="book-outline" size={20} color={Colors.primary} />
                            <AppText variant="h2" style={styles.sectionTitle}>In Plain English</AppText>
                        </View>
                        <AppText variant="body" style={styles.explanationText}>
                            {todayVerse.plainExplanation}
                        </AppText>
                    </View>

                    {/* AI Insight (Premium) */}
                    {isPremium ? (
                        <Card padding="lg" style={styles.aiCard}>
                            <View style={styles.aiHeader}>
                                <Ionicons name="sparkles" size={20} color={Colors.accent} />
                                <AppText variant="body" color={Colors.accent} style={styles.aiTitle}>
                                    Deeper Insight
                                </AppText>
                            </View>
                            <AppText variant="body" style={styles.aiText}>
                                {todayVerse.aiInsight}
                            </AppText>
                        </Card>
                    ) : (
                        <TouchableOpacity style={styles.lockedCard}>
                            <View style={styles.lockedContent}>
                                <Ionicons name="lock-closed" size={24} color={Colors.textSecondary} />
                                <View style={{ marginLeft: Spacing.md, flex: 1 }}>
                                    <AppText variant="body" style={{ fontWeight: '600' }}>Deeper Insight</AppText>
                                    <AppText variant="caption" color={Colors.textSecondary}>
                                        Unlock historical context and original language insights with Premium
                                    </AppText>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Reflection Question */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="help-circle-outline" size={20} color={Colors.primary} />
                            <AppText variant="h2" style={styles.sectionTitle}>Reflect</AppText>
                        </View>
                        <AppText variant="body" style={styles.questionText}>
                            {todayVerse.reflectionQuestion}
                        </AppText>
                    </View>

                    {/* Reflection Input */}
                    <View style={styles.inputSection}>
                        <AppText variant="caption" color={Colors.textSecondary} style={{ marginBottom: Spacing.sm }}>
                            Your thoughts (private)
                        </AppText>
                        <TextInput
                            style={styles.input}
                            placeholder="Write what's on your heart..."
                            placeholderTextColor={Colors.textSecondary}
                            multiline
                            value={reflection}
                            onChangeText={setReflection}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Success Message */}
                    {showSuccess && (
                        <View style={styles.successMessage}>
                            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                            <AppText variant="body" color="#4CAF50" style={{ marginLeft: 8 }}>
                                Reflection saved!
                            </AppText>
                        </View>
                    )}

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, (!reflection.trim() || isSaving) && styles.buttonDisabled]}
                        onPress={handleSave}
                        disabled={!reflection.trim() || isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name="bookmark-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                <AppText variant="body" color="#FFF">Save Reflection</AppText>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl * 2,
    },
    header: {
        marginBottom: Spacing.lg,
        marginTop: Spacing.md,
    },
    verseReminder: {
        backgroundColor: '#F8F6F3',
        marginBottom: Spacing.xl,
    },
    verseText: {
        fontStyle: 'italic',
        lineHeight: 24,
        color: Colors.text,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        marginLeft: Spacing.sm,
        fontSize: 18,
    },
    explanationText: {
        lineHeight: 26,
        color: Colors.text,
    },
    aiCard: {
        backgroundColor: '#FDF8F3',
        borderWidth: 1,
        borderColor: '#F0E5D8',
        marginBottom: Spacing.xl,
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    aiTitle: {
        marginLeft: 8,
        fontWeight: '600',
    },
    aiText: {
        lineHeight: 24,
        fontStyle: 'italic',
    },
    lockedCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    lockedContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    questionText: {
        lineHeight: 26,
        fontWeight: '500',
        color: Colors.text,
    },
    inputSection: {
        marginBottom: Spacing.lg,
    },
    input: {
        backgroundColor: '#F8F8F6',
        borderRadius: 16,
        padding: Spacing.lg,
        minHeight: 140,
        fontSize: 16,
        lineHeight: 24,
        color: Colors.text,
        borderWidth: 1,
        borderColor: '#E8E8E6',
    },
    successMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        borderRadius: 30,
        paddingVertical: Spacing.md,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
});
