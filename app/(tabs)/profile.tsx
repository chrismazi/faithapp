import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
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
    const [activeTab, setActiveTab] = useState<'saved' | 'journal'>('saved');

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
    };

    const handleSignOut = async () => {
        await AuthService.signOut();
        setSession(null);
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
                    <View style={styles.avatar}>
                        <AppText variant="h1" color={Colors.primary}>
                            {(session?.user?.email?.[0] || 'G').toUpperCase()}
                        </AppText>
                    </View>
                    <View style={styles.profileInfo}>
                        <View style={styles.nameRow}>
                            <AppText variant="h2">
                                {session?.user?.email?.split('@')[0] || 'Guest'}
                            </AppText>
                            {isPremium && (
                                <View style={styles.proBadge}>
                                    <AppText variant="caption" color="#FFF" style={{ fontSize: 10 }}>PRO</AppText>
                                </View>
                            )}
                        </View>
                        <AppText variant="caption" color={Colors.textSecondary}>
                            {session ? session.user?.email : 'Sign in to sync'}
                        </AppText>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <AppText variant="h1" style={styles.statNum}>{streak}</AppText>
                        <AppText variant="caption" color={Colors.textSecondary}>Day Streak</AppText>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <AppText variant="h1" style={styles.statNum}>{savedVerses.length}</AppText>
                        <AppText variant="caption" color={Colors.textSecondary}>Saved</AppText>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <AppText variant="h1" style={styles.statNum}>{reflections.length}</AppText>
                        <AppText variant="caption" color={Colors.textSecondary}>Reflections</AppText>
                    </View>
                </View>

                {/* Premium CTA */}
                {!isPremium && (
                    <TouchableOpacity style={styles.premiumCard} onPress={handleUpgrade} activeOpacity={0.9}>
                        <View style={styles.premiumContent}>
                            <Ionicons name="sparkles" size={20} color="#FFF" />
                            <View style={styles.premiumText}>
                                <AppText variant="body" color="#FFF" style={{ fontWeight: '600' }}>
                                    Upgrade to Premium
                                </AppText>
                                <AppText variant="caption" color="#FFF" style={{ opacity: 0.85 }}>
                                    AI insights, study plans & more
                                </AppText>
                            </View>
                        </View>
                        <View style={styles.premiumBtn}>
                            <AppText variant="caption" color={Colors.primary} style={{ fontWeight: '600' }}>
                                Try Free
                            </AppText>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
                        onPress={() => setActiveTab('saved')}
                    >
                        <Ionicons
                            name="bookmark-outline"
                            size={16}
                            color={activeTab === 'saved' ? Colors.primary : Colors.textSecondary}
                        />
                        <AppText
                            variant="caption"
                            color={activeTab === 'saved' ? Colors.primary : Colors.textSecondary}
                            style={{ marginLeft: 6 }}
                        >
                            Saved
                        </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'journal' && styles.tabActive]}
                        onPress={() => setActiveTab('journal')}
                    >
                        <Ionicons
                            name="create-outline"
                            size={16}
                            color={activeTab === 'journal' ? Colors.primary : Colors.textSecondary}
                        />
                        <AppText
                            variant="caption"
                            color={activeTab === 'journal' ? Colors.primary : Colors.textSecondary}
                            style={{ marginLeft: 6 }}
                        >
                            Journal
                        </AppText>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                {activeTab === 'saved' ? (
                    savedVerses.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="bookmark-outline" size={36} color={Colors.textSecondary} />
                            <AppText variant="body" color={Colors.textSecondary} align="center" style={{ marginTop: 12 }}>
                                No saved verses yet
                            </AppText>
                        </View>
                    ) : (
                        savedVerses.map((verse) => (
                            <View key={verse.id} style={styles.listItem}>
                                <AppText variant="caption" color={Colors.primary}>{verse.reference}</AppText>
                                <AppText variant="body" numberOfLines={2} style={{ marginTop: 4 }}>
                                    {verse.text}
                                </AppText>
                            </View>
                        ))
                    )
                ) : (
                    reflections.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="create-outline" size={36} color={Colors.textSecondary} />
                            <AppText variant="body" color={Colors.textSecondary} align="center" style={{ marginTop: 12 }}>
                                No reflections yet
                            </AppText>
                        </View>
                    ) : (
                        reflections.slice().reverse().map((ref, i) => (
                            <View key={i} style={styles.listItem}>
                                <AppText variant="caption" color={Colors.textSecondary}>
                                    {new Date(ref.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </AppText>
                                <AppText variant="body" style={{ marginTop: 4 }}>
                                    {ref.content}
                                </AppText>
                            </View>
                        ))
                    )
                )}

                {/* Account */}
                <View style={styles.accountSection}>
                    {session ? (
                        <TouchableOpacity style={styles.accountBtn} onPress={handleSignOut}>
                            <Ionicons name="log-out-outline" size={18} color={Colors.error} />
                            <AppText variant="body" color={Colors.error} style={{ marginLeft: 8 }}>Sign Out</AppText>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.accountBtn, styles.signInBtn]}
                            onPress={() => router.push('/(auth)/landing')}
                        >
                            <Ionicons name="log-in-outline" size={18} color={Colors.primary} />
                            <AppText variant="body" color={Colors.primary} style={{ marginLeft: 8 }}>
                                Sign In
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
        marginBottom: Spacing.lg,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
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
        gap: 8,
    },
    proBadge: {
        backgroundColor: Colors.accent,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: '#F0EDE8',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNum: {
        marginBottom: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#E8E5E0',
    },
    premiumCard: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    premiumContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    premiumText: {
        marginLeft: Spacing.sm,
    },
    premiumBtn: {
        backgroundColor: '#FFF',
        paddingHorizontal: Spacing.md,
        paddingVertical: 8,
        borderRadius: 16,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.sm,
        borderRadius: 12,
        backgroundColor: Colors.surface,
    },
    tabActive: {
        backgroundColor: '#E8F0E8',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    listItem: {
        backgroundColor: Colors.surface,
        borderRadius: 14,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: '#F0EDE8',
    },
    accountSection: {
        marginTop: Spacing.xl,
        alignItems: 'center',
    },
    accountBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    signInBtn: {
        backgroundColor: '#E8F0E8',
        paddingHorizontal: Spacing.lg,
        borderRadius: 20,
    },
});
