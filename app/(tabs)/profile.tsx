import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
import { Card } from '../../components/common/Card';
import { Colors, Spacing } from '../../constants/theme';
import { AuthService } from '../../services/auth';
import { Reflection, StorageService, Verse } from '../../services/storage';

export default function ProfileScreen() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [streak, setStreak] = useState(0);
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savedVerses, setSavedVerses] = useState<Verse[]>([]);
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [activeTab, setActiveTab] = useState<'saved' | 'reflections'>('saved');

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const init = async () => {
            try {
                const { data } = await AuthService.getSession();
                setSession(data?.session || null);

                const listener = AuthService.onAuthStateChange((_event, session) => {
                    setSession(session);
                });
                unsubscribe = () => listener.data?.subscription?.unsubscribe();

                const [currentStreak, premium, verses, refs] = await Promise.all([
                    StorageService.getStreak(),
                    StorageService.isPremium(),
                    StorageService.getSavedVerses(),
                    StorageService.getReflections(),
                ]);

                setStreak(currentStreak);
                setIsPremium(premium);
                setSavedVerses(verses);
                setReflections(refs);
            } catch (error) {
                console.error('Profile init error:', error);
            } finally {
                setLoading(false);
            }
        };

        init();
        return () => { if (unsubscribe) unsubscribe(); };
    }, []);

    const handleUpgrade = async () => {
        await StorageService.setPremium(true);
        setIsPremium(true);
        alert('Welcome to Faith App Premium! ✨');
    };

    const handleSignOut = async () => {
        try {
            await AuthService.signOut();
            setSession(null);
        } catch (err) {
            alert('Error signing out.');
        }
    };

    if (loading) {
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
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={32} color={Colors.primary} />
                    </View>
                    <View style={styles.profileInfo}>
                        <View style={styles.nameRow}>
                            <AppText variant="h2">
                                {session?.user?.email?.split('@')[0] || 'Guest User'}
                            </AppText>
                            {isPremium && (
                                <View style={styles.premiumBadge}>
                                    <Ionicons name="star" size={12} color="#FFF" />
                                    <AppText variant="caption" color="#FFF" style={{ marginLeft: 4 }}>PRO</AppText>
                                </View>
                            )}
                        </View>
                        <AppText variant="caption" color={Colors.textSecondary}>
                            {session?.user?.email || 'Sign in to sync your progress'}
                        </AppText>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Ionicons name="flame" size={24} color={Colors.accent} />
                        <AppText variant="h1" style={styles.statNumber}>{streak}</AppText>
                        <AppText variant="caption" color={Colors.textSecondary}>Day Streak</AppText>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="bookmark" size={24} color={Colors.primary} />
                        <AppText variant="h1" style={styles.statNumber}>{savedVerses.length}</AppText>
                        <AppText variant="caption" color={Colors.textSecondary}>Saved Verses</AppText>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="create" size={24} color="#8B9D83" />
                        <AppText variant="h1" style={styles.statNumber}>{reflections.length}</AppText>
                        <AppText variant="caption" color={Colors.textSecondary}>Reflections</AppText>
                    </View>
                </View>

                {/* Premium Upsell */}
                {!isPremium && (
                    <TouchableOpacity style={styles.upgradeCard} onPress={handleUpgrade}>
                        <View style={styles.upgradeContent}>
                            <View>
                                <AppText variant="h2" color="#FFF">Unlock Premium</AppText>
                                <AppText variant="body" color="#FFF" style={styles.upgradeText}>
                                    Get AI insights, study plans & more
                                </AppText>
                            </View>
                            <View style={styles.upgradeButton}>
                                <AppText variant="caption" color={Colors.primary}>Try Free</AppText>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Content Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
                        onPress={() => setActiveTab('saved')}
                    >
                        <AppText
                            variant="body"
                            color={activeTab === 'saved' ? Colors.primary : Colors.textSecondary}
                        >
                            Saved Verses
                        </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'reflections' && styles.tabActive]}
                        onPress={() => setActiveTab('reflections')}
                    >
                        <AppText
                            variant="body"
                            color={activeTab === 'reflections' ? Colors.primary : Colors.textSecondary}
                        >
                            My Reflections
                        </AppText>
                    </TouchableOpacity>
                </View>

                {/* Content List */}
                {activeTab === 'saved' ? (
                    savedVerses.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="bookmark-outline" size={48} color={Colors.textSecondary} />
                            <AppText variant="body" color={Colors.textSecondary} align="center" style={{ marginTop: Spacing.md }}>
                                No saved verses yet.{'\n'}Tap the bookmark icon on any verse to save it.
                            </AppText>
                        </View>
                    ) : (
                        savedVerses.map((verse, index) => (
                            <Card key={verse.id} padding="lg" style={styles.contentCard}>
                                <AppText variant="caption" color={Colors.primary}>{verse.reference}</AppText>
                                <AppText variant="body" style={styles.verseText} numberOfLines={3}>
                                    {verse.text}
                                </AppText>
                            </Card>
                        ))
                    )
                ) : (
                    reflections.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="create-outline" size={48} color={Colors.textSecondary} />
                            <AppText variant="body" color={Colors.textSecondary} align="center" style={{ marginTop: Spacing.md }}>
                                No reflections yet.{'\n'}Write your thoughts after reading each verse.
                            </AppText>
                        </View>
                    ) : (
                        reflections.slice().reverse().map((ref, index) => (
                            <Card key={index} padding="lg" style={styles.contentCard}>
                                <AppText variant="caption" color={Colors.textSecondary}>
                                    {new Date(ref.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </AppText>
                                <AppText variant="body" style={styles.reflectionText}>
                                    {ref.content}
                                </AppText>
                            </Card>
                        ))
                    )
                )}

                {/* Account Actions */}
                <View style={styles.accountSection}>
                    {session ? (
                        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                            <AppText variant="body" color={Colors.error} style={{ marginLeft: 8 }}>Sign Out</AppText>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.signInButton}
                            onPress={() => router.push('/(auth)/landing')}
                        >
                            <Ionicons name="log-in-outline" size={20} color={Colors.primary} />
                            <AppText variant="body" color={Colors.primary} style={{ marginLeft: 8 }}>
                                Sign In to Sync Progress
                            </AppText>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
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
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.md,
        marginBottom: Spacing.xl,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E8F0E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        marginLeft: Spacing.md,
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.accent,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: Spacing.md,
        alignItems: 'center',
    },
    statNumber: {
        marginVertical: 4,
    },
    upgradeCard: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: Spacing.lg,
        marginBottom: Spacing.xl,
    },
    upgradeContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    upgradeText: {
        opacity: 0.9,
        marginTop: 4,
    },
    upgradeButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        marginBottom: Spacing.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl,
    },
    contentCard: {
        marginBottom: Spacing.md,
    },
    verseText: {
        marginTop: Spacing.sm,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    reflectionText: {
        marginTop: Spacing.sm,
        lineHeight: 22,
    },
    accountSection: {
        marginTop: Spacing.xl,
        alignItems: 'center',
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
    },
    signInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F0E8',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: 30,
    },
});
