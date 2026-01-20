
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Colors, Shadow, Spacing } from '../../constants/theme';

interface CardProps extends ViewProps {
    padding?: keyof typeof Spacing;
}

export const Card: React.FC<CardProps> = ({
    padding = 'md',
    style,
    children,
    ...props
}) => {
    return (
        <View style={[styles.card, { padding: Spacing[padding] }, style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        ...Shadow.soft,
    },
});
