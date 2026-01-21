import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
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
                console.error('Error loading:', error);
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
            setTimeout(() => setShowSuccess(false), 2500);
        } catch (error) {
            alert('Failed to save.');
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
                        <AppText variant="caption" color={Colors.primary}>{todayVerse.reference}</AppText>
                        <AppText variant="h1">Study & Reflect</AppText>
                    </View>

                    {/* Scripture Quote */}
                    <View style={styles.quoteCard}>
                        <View style={styles.quoteMark}>
                            <AppText style={{ fontSize: 28, color: Colors.primary, opacity: 0.3 }}>"</AppText>
                        </View>
                        <AppText variant="body" style={styles.quoteText}>
                            {todayVerse.text}
                        </AppText>
                    </View>

                    {/* Explanation Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <Ionicons name="book-outline" size={16} color={Colors.primary} />
                            </View>
                            <AppText variant="body" style={styles.sectionTitle}>Plain English</AppText>
                        </View>
                        <AppText variant="body" style={styles.bodyText}>
                            {todayVerse.plainExplanation}
                        </AppText>
                    </View>

                    {/* AI Insight */}
                    {isPremium ? (
                        <View style={styles.aiCard}>
                            <View style={styles.aiHeader}>
                                <Ionicons name="sparkles" size={14} color={Colors.accent} />
                                <AppText variant="caption" color={Colors.accent} style={{ marginLeft: 6, fontWeight: '600' }}>
                                    Deeper Insight
                                </AppText>
                            </View>
                            <AppText variant="body" style={styles.aiText}>
                                {todayVerse.aiInsight}
                            </AppText>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.lockedCard} activeOpacity={0.8}>
                            <Ionicons name="lock-closed" size={18} color={Colors.textSecondary} />
                            <View style={styles.lockedText}>
                                <AppText variant="body" style={{ fontWeight: '600' }}>Unlock Deeper Insights</AppText>
                                <AppText variant="caption" color={Colors.textSecondary}>
                                    Historical context & original language
                                </AppText>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
                        </TouchableOpacity>
                    )}

                    {/* Reflection Question */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIcon, { backgroundColor: '#F5EDE8' }]}>
                                <Ionicons name="help-circle-outline" size={16} color={Colors.accent} />
                            </View>
                            <AppText variant="body" style={styles.sectionTitle}>Reflect</AppText>
                        </View>
                        <AppText variant="body" style={styles.questionText}>
                            {todayVerse.reflectionQuestion}
                        </AppText>
                    </View>

                    {/* Input */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Write your thoughts..."
                            placeholderTextColor={Colors.textSecondary}
                            multiline
                            value={reflection}
                            onChangeText={setReflection}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Success */}
                    {showSuccess && (
                        <View style={styles.successMsg}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <AppText variant="caption" color="#4CAF50" style={{ marginLeft: 6 }}>Saved!</AppText>
                        </View>
                    )}

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveBtn, (!reflection.trim() || isSaving) && styles.saveBtnDisabled]}
                        onPress={handleSave}
                        disabled={!reflection.trim() || isSaving}
                        activeOpacity={0.8}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <AppText variant="body" color="#FFF" style={{ fontWeight: '600' }}>Save Reflection</AppText>
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
    },
    quoteCard: {
        backgroundColor: '#F8F6F3',
        borderRadius: 16,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        position: 'relative',
    },
    quoteMark: {
        position: 'absolute',
        top: 8,
        left: 12,
    },
    quoteText: {
        fontStyle: 'italic',
        lineHeight: 22,
        paddingTop: 16,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    sectionIcon: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#E8F0E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    sectionTitle: {
        fontWeight: '600',
    },
    bodyText: {
        lineHeight: 22,
        color: Colors.text,
    },
    aiCard: {
        backgroundColor: '#FDF8F3',
        borderRadius: 14,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: '#F0E5D8',
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    aiText: {
        lineHeight: 20,
        fontStyle: 'italic',
        fontSize: 13,
    },
    lockedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F3',
        borderRadius: 14,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
    },
    lockedText: {
        flex: 1,
        marginLeft: Spacing.sm,
    },
    questionText: {
        lineHeight: 22,
        fontWeight: '500',
    },
    inputWrapper: {
        marginBottom: Spacing.md,
    },
    input: {
        backgroundColor: '#F8F8F6',
        borderRadius: 14,
        padding: Spacing.md,
        minHeight: 100,
        fontSize: 14,
        lineHeight: 20,
        color: Colors.text,
        borderWidth: 1,
        borderColor: '#EAEAE8',
    },
    successMsg: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        borderRadius: 24,
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    saveBtnDisabled: {
        opacity: 0.5,
    },
});
