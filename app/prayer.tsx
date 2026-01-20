
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../components/common/AppText';
import { Colors, Spacing } from '../constants/theme';

export default function PrayerScreen() {
    const fadeAnim = new Animated.Value(0);

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="leaf-outline" size={64} color={Colors.primary} />
                </View>

                <Animated.View style={[styles.prayerContainer, { opacity: fadeAnim }]}>
                    <AppText variant="h2" align="center" style={styles.title}>
                        Simple Guided Prayer
                    </AppText>

                    <AppText variant="body" align="center" style={styles.prayerStep}>
                        "Lord, help me to find moments of stillness today. Remind me that You are with me in the noise and in the quiet. Give me the strength to trust You more."
                    </AppText>

                    <AppText variant="caption" align="center" color={Colors.textSecondary} style={styles.instruction}>
                        Take a deep breath. Stay in this moment for as long as you need.
                    </AppText>
                </Animated.View>

                <TouchableOpacity style={styles.doneButton}>
                    <AppText variant="body" color="#FFF" align="center">Amen</AppText>
                </TouchableOpacity>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: Spacing.xxl,
    },
    prayerContainer: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        marginBottom: Spacing.xl,
        color: Colors.primary,
    },
    prayerStep: {
        fontSize: 20,
        lineHeight: 32,
        fontStyle: 'italic',
        marginBottom: Spacing.xxl,
    },
    instruction: {
        marginBottom: Spacing.xxl,
    },
    doneButton: {
        backgroundColor: Colors.primary,
        borderRadius: 30,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        width: '100%',
        marginTop: Spacing.xxl,
    },
});
