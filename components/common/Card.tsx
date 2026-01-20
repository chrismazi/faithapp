import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Shadows, Spacing } from '../../constants/theme';

interface CardProps {
    children: React.ReactNode;
    padding?: 'sm' | 'md' | 'lg';
    style?: ViewStyle;
    elevated?: boolean;
}

export function Card({ children, padding = 'md', style, elevated = true }: CardProps) {
    const paddingValue = {
        sm: Spacing.sm,
        md: Spacing.md,
        lg: Spacing.lg,
    }[padding];

    return (
        <View style={[
            styles.card,
            { padding: paddingValue },
            elevated && Shadows.soft,
            style
        ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F0EDE8',
    },
});
