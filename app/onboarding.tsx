import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View, ViewToken } from 'react-native';
import { AppText } from '../components/common/AppText';
import { Colors, Spacing } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface SlideItem {
    id: string;
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const SLIDES: SlideItem[] = [
    {
        id: '1',
        title: 'Understand',
        subtitle: 'Scripture in plain English that makes sense.',
        icon: 'book-outline',
    },
    {
        id: '2',
        title: 'Apply',
        subtitle: 'Daily reflection questions for real life.',
        icon: 'bulb-outline',
    },
    {
        id: '3',
        title: 'Grow',
        subtitle: 'Build consistency with gentle streaks.',
        icon: 'trending-up-outline',
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef<FlatList<SlideItem>>(null);
    const router = useRouter();

    const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems && viewableItems.length > 0 && viewableItems[0].index !== null) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1 && slidesRef.current) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.push('/(auth)/landing');
        }
    };

    const Slide = ({ item }: { item: SlideItem }) => (
        <View style={styles.slide}>
            <View style={styles.iconCircle}>
                <Ionicons name={item.icon} size={48} color={Colors.primary} />
            </View>
            <AppText variant="h1" align="center" style={styles.slideTitle}>{item.title}</AppText>
            <AppText variant="body" align="center" color={Colors.textSecondary}>
                {item.subtitle}
            </AppText>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.slideContainer}>
                <FlatList
                    data={SLIDES}
                    renderItem={({ item }) => <Slide item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>

            {/* Dots */}
            <View style={styles.dotsRow}>
                {SLIDES.map((_, i) => {
                    const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [8, 20, 8],
                        extrapolate: 'clamp',
                    });
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp',
                    });
                    return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} key={i.toString()} />;
                })}
            </View>

            {/* Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
                    <AppText variant="body" color="#FFF" style={{ fontWeight: '600' }}>
                        {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/(tabs)')}>
                    <AppText variant="caption" color={Colors.textSecondary}>Skip</AppText>
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
    slideContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E8F0E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    slideTitle: {
        marginBottom: 8,
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginHorizontal: 4,
    },
    footer: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xxl,
    },
    nextBtn: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    skipBtn: {
        alignItems: 'center',
        paddingVertical: 8,
    },
});
