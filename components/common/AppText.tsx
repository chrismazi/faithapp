
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { Typography } from '../../constants/theme';

interface AppTextProps extends TextProps {
    variant?: 'h1' | 'h2' | 'body' | 'caption';
    color?: string;
    align?: 'left' | 'center' | 'right';
}

export const AppText: React.FC<AppTextProps> = ({
    variant = 'body',
    color,
    align = 'left',
    style,
    children,
    ...props
}) => {
    const variantStyle = styles[variant];
    const customStyle = {
        color: color || variantStyle.color,
        textAlign: align,
    };

    return (
        <Text style={[variantStyle, customStyle, style]} {...props}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    h1: {
        ...Typography.h1,
    },
    h2: {
        ...Typography.h2,
    },
    body: {
        ...Typography.body,
    },
    caption: {
        ...Typography.caption,
    },
});
