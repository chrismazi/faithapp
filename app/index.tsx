
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { AppText } from '../components/common/AppText';
import { Colors } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();
    const logoScale = new Animated.Value(0);
    const logoOpacity = new Animated.Value(0);
    const textOpacity = new Animated.Value(0);

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 10,
                    friction: 2,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setTimeout(() => {
                router.replace('/onboarding');
            }, 1500);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.logoContainer,
                { transform: [{ scale: logoScale }], opacity: logoOpacity }
            ]}>
                <Ionicons name="leaf" size={100} color={Colors.primary} />
            </Animated.View>
            <Animated.View style={{ opacity: textOpacity }}>
                <AppText variant="h1" color={Colors.primary} style={styles.title}>Faith App</AppText>
                <AppText variant="body" color={Colors.textSecondary} align="center">Understand. Apply. Grow.</AppText>
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
        marginBottom: 20,
    },
    title: {
        fontSize: 40,
        letterSpacing: 2,
        marginBottom: 8,
    },
});
