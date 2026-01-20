
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
import { Card } from '../../components/common/Card';
import { Colors, Spacing } from '../../constants/theme';
import { StorageService } from '../../services/storage';

const DAILY_VERSE_ID = 'psalm-46-10';

export default function ReflectionScreen() {
    const [reflection, setReflection] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        StorageService.isPremium().then(setIsPremium);
    }, []);

    const handleSave = async () => {
        if (!reflection.trim()) return;

        setIsSaving(true);
        try {
            await StorageService.saveReflection({
                verseId: DAILY_VERSE_ID,
                content: reflection,
                date: new Date().toISOString(),
            });
            alert('Reflection saved! 🙏');
            setReflection('');
        } catch (error) {
            alert('Failed to save reflection.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <AppText variant="h2">Reflection</AppText>
                </View>

                <Card style={styles.contentCard} padding="lg">
                    <View style={styles.illustrationPlaceholder}>
                        {/* This would be a beautiful illustration in the real app */}
                        <View style={styles.mockIllustration} />
                    </View>

                    <AppText variant="h2" style={styles.title}>Plain English Explanation</AppText>
                    <AppText variant="body" style={styles.explanation}>
                        This verse means that even when life feels chaotic or overwhelming, God is still in control. We are invited to let go of our anxiety and trust in His power and presence.
                    </AppText>

                    {isPremium ? (
                        <View style={styles.aiSection}>
                            <View style={styles.aiHeader}>
                                <Ionicons name="sparkles" size={20} color={Colors.accent} />
                                <AppText variant="h2" color={Colors.accent} style={{ marginLeft: 8 }}>AI Insight</AppText>
                            </View>
                            <AppText variant="body" style={styles.aiContent}>
                                In the original Hebrew context, the phrase 'be still' (raphah) actually means to 'let go' or 'release.' It's a call to drop your weapons and stop fighting a battle that God has already won.
                            </AppText>
                        </View>
                    ) : (
                        <View style={styles.lockedSection}>
                            <Ionicons name="lock-closed" size={24} color={Colors.textSecondary} />
                            <AppText variant="body" color={Colors.textSecondary} style={{ marginTop: 8 }}>
                                Unlock AI Insights with Premium
                            </AppText>
                        </View>
                    )}

                    <View style={styles.divider} />

                    <AppText variant="h2" style={styles.title}>Your Thought</AppText>
                    <AppText variant="body" color={Colors.textSecondary} style={styles.question}>
                        What is one thing today that you need to 'be still' about and hand over to God?
                    </AppText>

                    <TextInput
                        style={styles.input}
                        placeholder="Write your thoughts..."
                        placeholderTextColor={Colors.textSecondary}
                        multiline
                        value={reflection}
                        onChangeText={setReflection}
                    />
                </Card>

                <TouchableOpacity
                    style={[styles.saveButton, isSaving && { opacity: 0.5 }]}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    <AppText variant="body" color="#FFF" align="center">
                        {isSaving ? 'Saving...' : 'Save Reflection'}
                    </AppText>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: Spacing.lg,
    },
    header: {
        marginBottom: Spacing.lg,
        marginTop: Spacing.md,
    },
    contentCard: {
        paddingBottom: Spacing.xl,
    },
    illustrationPlaceholder: {
        height: 180,
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        marginBottom: Spacing.xl,
        overflow: 'hidden',
    },
    mockIllustration: {
        flex: 1,
        backgroundColor: '#A8B6A9', // Slightly darker sage for the 'illustration'
    },
    title: {
        marginBottom: Spacing.md,
    },
    explanation: {
        lineHeight: 24,
        marginBottom: Spacing.xl,
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: Spacing.xl,
    },
    question: {
        fontStyle: 'italic',
        marginBottom: Spacing.lg,
    },
    input: {
        backgroundColor: '#F3F4F1',
        borderRadius: 12,
        padding: Spacing.md,
        minHeight: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        color: Colors.text,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        borderRadius: 30,
        paddingVertical: Spacing.md,
        marginTop: Spacing.xl,
        marginBottom: Spacing.xxl,
    },
    aiSection: {
        backgroundColor: '#FAF5EE',
        padding: Spacing.md,
        borderRadius: 12,
        marginTop: Spacing.md,
        borderWidth: 1,
        borderColor: '#F3E5D5',
    },
    aiHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    aiContent: {
        fontStyle: 'italic',
        lineHeight: 22,
    },
    lockedSection: {
        alignItems: 'center',
        padding: Spacing.lg,
        backgroundColor: '#F3F4F1',
        borderRadius: 12,
        marginTop: Spacing.md,
    },
});
