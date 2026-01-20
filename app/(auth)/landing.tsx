
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
                <View style={styles.logoContainer}>
                    <Ionicons name="leaf" size={80} color={Colors.primary} />
                    <AppText variant="h1" color={Colors.primary} style={styles.logoText}>Faith App</AppText>
                </View>

                <View style={styles.bottomSection}>
                    <AppText variant="h2" align="center" style={styles.welcomeText}>
                        Ready to deepen your faith?
                    </AppText>
                    <AppText variant="body" align="center" color={Colors.textSecondary} style={styles.subtitle}>
                        Join thousands of young adults growing in the Word.
                    </AppText>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: Colors.primary }]}
                        onPress={() => router.push('/(auth)/signup')}
                    >
                        <AppText color="#FFF" align="center">Create Account</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <AppText align="center">Sign In</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.guestButton} onPress={() => router.replace('/(tabs)')}>
                        <AppText variant="caption" color={Colors.textSecondary} align="center">
                            Continue as Guest
                        </AppText>
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
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 32,
        marginTop: 10,
        letterSpacing: 1,
    },
    bottomSection: {
        marginBottom: Spacing.xl,
    },
    welcomeText: {
        marginBottom: Spacing.sm,
    },
    subtitle: {
        marginBottom: Spacing.xxl,
        lineHeight: 22,
    },
    button: {
        paddingVertical: Spacing.md,
        borderRadius: 30,
        marginBottom: Spacing.md,
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: Colors.border,
    },
    guestButton: {
        marginTop: Spacing.sm,
    },
});
