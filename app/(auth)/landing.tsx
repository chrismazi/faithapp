import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
import { Colors, Spacing } from '../../constants/theme';

export default function AuthLandingScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Logo */}
                <View style={styles.logoSection}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="leaf" size={40} color={Colors.primary} />
                    </View>
                    <AppText variant="h1" color={Colors.primary} style={styles.logoText}>Faith</AppText>
                </View>

                {/* CTA */}
                <View style={styles.ctaSection}>
                    <AppText variant="h2" align="center">Ready to begin?</AppText>
                    <AppText variant="body" align="center" color={Colors.textSecondary} style={styles.subtitle}>
                        Create an account to sync your progress.
                    </AppText>

                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => router.push('/signup')}
                        activeOpacity={0.8}
                    >
                        <AppText variant="body" color="#FFF" style={{ fontWeight: '600' }}>Create Account</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => router.push('/login')}
                        activeOpacity={0.8}
                    >
                        <AppText variant="body">Sign In</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.guestBtn} onPress={() => router.replace('/(tabs)')}>
                        <AppText variant="caption" color={Colors.textSecondary}>Continue as Guest</AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        padding: Spacing.xl,
        justifyContent: 'space-between',
    },
    logoSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8F0E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    logoText: {
        fontSize: 24,
        letterSpacing: 1,
    },
    ctaSection: {
        paddingBottom: Spacing.lg,
    },
    subtitle: {
        marginTop: 8,
        marginBottom: Spacing.xl,
    },
    primaryBtn: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    secondaryBtn: {
        borderWidth: 1,
        borderColor: Colors.border,
        paddingVertical: Spacing.md,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    guestBtn: {
        alignItems: 'center',
        paddingVertical: 8,
    },
});
