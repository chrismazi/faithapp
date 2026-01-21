import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { AppText } from '../components/common/AppText';
import { Colors } from '../constants/theme';

export default function SplashScreen() {
    const router = useRouter();
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 20,
                    friction: 4,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setTimeout(() => {
                router.replace('/onboarding');
            }, 800);
        });
    }, [router, logoScale, logoOpacity, textOpacity]);

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.logoContainer,
                { transform: [{ scale: logoScale }], opacity: logoOpacity }
            ]}>
                <View style={styles.logoCircle}>
                    <Ionicons name="leaf" size={48} color={Colors.primary} />
                </View>
            </Animated.View>
            <Animated.View style={{ opacity: textOpacity }}>
                <AppText variant="h1" color={Colors.primary} style={styles.title}>Faith</AppText>
                <AppText variant="caption" color={Colors.textSecondary} align="center">
                    Understand. Apply. Grow.
                </AppText>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 16,
    },
    logoCircle: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#E8F0E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        letterSpacing: 1,
        marginBottom: 4,
        textAlign: 'center',
    },
});
