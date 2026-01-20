
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
import { Card } from '../../components/common/Card';
import { Colors, Spacing } from '../../constants/theme';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage';

export default function ProfileScreen() {
    const [session, setSession] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [streak, setStreak] = useState(0);
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(false);

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

                const currentStreak = await StorageService.getStreak();
                setStreak(currentStreak);

                const premium = await StorageService.isPremium();
                setIsPremium(premium);
            } catch (error) {
                console.error('Profile init error:', error);
            }
        };

        init();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const handleUpgrade = async () => {
        await StorageService.setPremium(true);
        setIsPremium(true);
        alert('Welcome to Faith App Premium! ✨');
    };

    const handleAuth = async (type: 'signIn' | 'signUp') => {
        if (!email || !password) {
            alert('Please enter email and password.');
            return;
        }
        setLoading(true);
        try {
            const { error } = await AuthService[type](email, password);
            if (error) alert(error.message);
        } catch (err) {
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            const { error } = await AuthService.signOut();
            if (error) alert(error.message);
            else setSession(null);
        } catch (err) {
            alert('Error signing out.');
        }
    };

    if (session) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <AppText variant="h2" style={styles.title}>Your Profile</AppText>
                    <Card padding="lg" style={styles.profileCard}>
                        <View style={styles.profileHeader}>
                            <AppText variant="body" color={Colors.textSecondary}>Email</AppText>
                            {isPremium && (
                                <View style={styles.premiumBadge}>
                                    <AppText variant="caption" color="#FFF">PREMIUM</AppText>
                                </View>
                            )}
                        </View>
                        <AppText variant="h2">{session.user?.email || 'User'}</AppText>
                        <View style={styles.divider} />
                        <AppText variant="body" color={Colors.textSecondary}>Current Streak</AppText>
                        <AppText variant="h1" color={Colors.primary}>{streak} Days</AppText>
                    </Card>

                    {!isPremium && (
                        <Card padding="lg" style={styles.upgradeCard}>
                            <AppText variant="h2" color="#FFF">Faith App Premium</AppText>
                            <AppText variant="body" color="#FFF" style={styles.upgradeText}>
                                Unlock AI-powered explanations, full study plans, and unlimited history.
                            </AppText>
                            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                                <AppText variant="body" color={Colors.accent} align="center">Upgrade for $4.99/mo</AppText>
                            </TouchableOpacity>
                        </Card>
                    )}

                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <AppText variant="body" color={Colors.error} align="center">Sign Out</AppText>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <AppText variant="h2" style={styles.title}>Join Faith App</AppText>
                <AppText variant="body" style={styles.subtitle}>
                    Sign in to sync your streaks and notes across devices.
                </AppText>

                <Card padding="lg" style={styles.authCard}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={Colors.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={Colors.textSecondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: Colors.primary }, loading && { opacity: 0.6 }]}
                        onPress={() => handleAuth('signIn')}
                        disabled={loading}
                    >
                        <AppText color="#FFF" align="center">{loading ? 'Please wait...' : 'Sign In'}</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => handleAuth('signUp')}
                        disabled={loading}
                    >
                        <AppText align="center">Create Account</AppText>
                    </TouchableOpacity>
                </Card>
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
    title: {
        marginBottom: Spacing.md,
        marginTop: Spacing.md,
    },
    subtitle: {
        marginBottom: Spacing.xl,
        color: Colors.textSecondary,
    },
    authCard: {
        gap: Spacing.md,
    },
    profileCard: {
        gap: Spacing.sm,
    },
    input: {
        backgroundColor: '#F3F4F1',
        borderRadius: 12,
        padding: Spacing.md,
        fontSize: 16,
        color: Colors.text,
    },
    button: {
        borderRadius: 30,
        paddingVertical: Spacing.md,
        marginTop: Spacing.sm,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: Colors.border,
    },
    signOutButton: {
        marginTop: Spacing.xxl,
        paddingVertical: Spacing.md,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.md,
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    premiumBadge: {
        backgroundColor: Colors.accent,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: 4,
    },
    upgradeCard: {
        backgroundColor: Colors.primary,
        marginTop: Spacing.xl,
        gap: Spacing.md,
    },
    upgradeText: {
        opacity: 0.9,
        lineHeight: 24,
    },
    upgradeButton: {
        backgroundColor: Colors.surface,
        paddingVertical: Spacing.md,
        borderRadius: 30,
        marginTop: Spacing.sm,
    },
});
