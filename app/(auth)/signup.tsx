import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
import { Colors, Spacing } from '../../constants/theme';
import { AuthService } from '../../services/auth';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
        if (!name || !email || !password) {
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
                alert('Account created! Check your email to verify.');
                router.replace('/login');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
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
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={22} color={Colors.text} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <AppText variant="h1">Create account</AppText>
                        <AppText variant="body" color={Colors.textSecondary} style={{ marginTop: 4 }}>
                            Start your faith journey today
                        </AppText>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <AppText variant="caption" color={Colors.textSecondary}>Name</AppText>
                            <TextInput
                                style={styles.input}
                                placeholder="Your name"
                                placeholderTextColor="#AAA"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <AppText variant="caption" color={Colors.textSecondary}>Email</AppText>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#AAA"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <AppText variant="caption" color={Colors.textSecondary}>Password</AppText>
                            <TextInput
                                style={styles.input}
                                placeholder="Min 6 characters"
                                placeholderTextColor="#AAA"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitBtn, loading && { opacity: 0.6 }]}
                            onPress={handleSignUp}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <AppText variant="body" color="#FFF" style={{ fontWeight: '600' }}>Create Account</AppText>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <AppText variant="caption" color={Colors.textSecondary}>Already have an account? </AppText>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <AppText variant="caption" color={Colors.primary} style={{ fontWeight: '600' }}>Sign In</AppText>
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
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    backBtn: {
        marginBottom: Spacing.lg,
        padding: 4,
        alignSelf: 'flex-start',
    },
    header: {
        marginBottom: Spacing.xl,
    },
    form: {
        gap: Spacing.md,
    },
    inputGroup: {
        gap: 6,
    },
    input: {
        backgroundColor: '#F5F5F3',
        borderRadius: 12,
        padding: Spacing.md,
        fontSize: 14,
        color: Colors.text,
    },
    submitBtn: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: 24,
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.xl,
    },
});
