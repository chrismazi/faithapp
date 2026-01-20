
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
import { Card } from '../../components/common/Card';
import { Colors, Spacing } from '../../constants/theme';
import { AuthService } from '../../services/auth';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
        if (!email || !password || !name) {
            alert('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            const { error } = await AuthService.signUp(email, password);
            if (error) {
                alert(error.message);
            } else {
                alert('Account created! Please check your email for verification.');
                router.replace('/login');
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

                    <AppText variant="h1" style={styles.title}>Create Account</AppText>
                    <AppText variant="body" color={Colors.textSecondary} style={styles.subtitle}>
                        Start your daily Bible journey today.
                    </AppText>

                    <Card padding="lg" style={styles.card}>
                        <View style={styles.inputContainer}>
                            <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>Full Name</AppText>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor={Colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

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
                                placeholder="min. 6 characters"
                                placeholderTextColor={Colors.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: Colors.primary }, loading && { opacity: 0.6 }]}
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            <AppText color="#FFF" align="center">{loading ? 'Creating Account...' : 'Create Account'}</AppText>
                        </TouchableOpacity>
                    </Card>

                    <View style={styles.footer}>
                        <AppText variant="body" color={Colors.textSecondary}>Already joined? </AppText>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <AppText variant="body" color={Colors.primary} style={{ fontWeight: 'bold' }}>Sign In</AppText>
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
