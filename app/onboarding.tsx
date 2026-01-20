
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
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const SLIDES: SlideItem[] = [
    {
        id: '1',
        title: 'Understand the Bible',
        description: 'We translate complex scripture into simple, plain English that anyone can understand.',
        icon: 'book-outline',
    },
    {
        id: '2',
        title: 'Apply Daily',
        description: 'Get practical reflection questions and AI insights to help you live out the Word.',
        icon: 'bulb-outline',
    },
    {
        id: '3',
        title: 'Grow Together',
        description: 'Join a community of young adults dedicated to consistent spiritual growth.',
        icon: 'people-outline',
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

    const scrollTo = () => {
        if (currentIndex < SLIDES.length - 1 && slidesRef.current) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.push('/(auth)/landing');
        }
    };

    const Slide = ({ item }: { item: SlideItem }) => (
        <View style={styles.slide}>
            <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={120} color={Colors.primary} />
            </View>
            <View style={styles.textContainer}>
                <AppText variant="h1" align="center" style={styles.title}>{item.title}</AppText>
                <AppText variant="body" align="center" color={Colors.textSecondary} style={styles.description}>
                    {item.description}
                </AppText>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 3 }}>
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

            <View style={styles.footer}>
                <View style={styles.indicatorContainer}>
                    {SLIDES.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [10, 20, 10],
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

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Colors.primary }]}
                    onPress={scrollTo}
                >
                    <AppText color="#FFF" align="center">
                        {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipButton} onPress={() => router.replace('/(tabs)')}>
                    <AppText align="center" color={Colors.textSecondary}>Skip</AppText>
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
    slide: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    iconContainer: {
        flex: 0.7,
        justifyContent: 'center',
    },
    textContainer: {
        flex: 0.3,
    },
    title: {
        marginBottom: Spacing.md,
        color: Colors.primary,
    },
    description: {
        lineHeight: 24,
    },
    footer: {
        height: height * 0.2,
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.lg,
    },
    indicatorContainer: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
        marginHorizontal: 8,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: 30,
    },
    skipButton: {
        paddingVertical: Spacing.sm,
    },
});
