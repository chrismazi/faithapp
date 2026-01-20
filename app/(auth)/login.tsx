
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
import { Card } from '../../components/common/Card';
import { Colors, Spacing } from '../../constants/theme';
import { AuthService } from '../../services/auth';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }
        setLoading(true);
        try {
            const { error } = await AuthService.signIn(email, password);
            if (error) {
                alert(error.message);
            } else {
                router.replace('/(tabs)');
            }
        } catch (err) {
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>

                    <AppText variant="h1" style={styles.title}>Welcome Back</AppText>
                    <AppText variant="body" color={Colors.textSecondary} style={styles.subtitle}>
                        Sign in to continue your journey.
                    </AppText>

                    <Card padding="lg" style={styles.card}>
                        <View style={styles.inputContainer}>
                            <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>Email Address</AppText>
                            <TextInput
                                style={styles.input}
                                placeholder="email@example.com"
                                placeholderTextColor={Colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>Password</AppText>
                            <TextInput
                                style={styles.input}
                                placeholder="********"
                                placeholderTextColor={Colors.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <AppText variant="caption" color={Colors.primary}>Forgot Password?</AppText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: Colors.primary }, loading && { opacity: 0.6 }]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <AppText color="#FFF" align="center">{loading ? 'Signing In...' : 'Sign In'}</AppText>
                        </TouchableOpacity>
                    </Card>

                    <View style={styles.footer}>
                        <AppText variant="body" color={Colors.textSecondary}>Don't have an account? </AppText>
                        <TouchableOpacity onPress={() => router.push('/signup')}>
                            <AppText variant="body" color={Colors.primary} style={{ fontWeight: 'bold' }}>Sign Up</AppText>
                        </TouchableOpacity>
                    </View>
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
    scrollContent: {
        padding: Spacing.xl,
    },
    backButton: {
        marginBottom: Spacing.xl,
        padding: Spacing.xs,
    },
    title: {
        marginBottom: Spacing.xs,
    },
    subtitle: {
        marginBottom: Spacing.xxl,
    },
    card: {
        gap: Spacing.lg,
    },
    inputContainer: {
        gap: Spacing.xs,
    },
    label: {
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F3F4F1',
        borderRadius: 12,
        padding: Spacing.md,
        fontSize: 16,
        color: Colors.text,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
    },
    button: {
        paddingVertical: Spacing.md,
        borderRadius: 30,
        marginTop: Spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.xxl,
    },
});
