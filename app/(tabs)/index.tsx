import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
import { Card } from '../../components/common/Card';
import { Colors, Spacing } from '../../constants/theme';
import { DailyContent, getTodayVerse } from '../../services/content';
import { StorageService, Verse } from '../../services/storage';

export default function HomeScreen() {
  const [streak, setStreak] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todayVerse, setTodayVerse] = useState<DailyContent | null>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const verse = getTodayVerse();
        setTodayVerse(verse);
        const currentStreak = await StorageService.updateStreak();
        setStreak(currentStreak);
        const saved = await StorageService.getSavedVerses();
        setIsSaved(!!saved.find(v => v.id === verse.id));
      } catch (error) {
        console.error('Error initializing home:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const toggleSave = async () => {
    if (!todayVerse) return;
    const verse: Verse = {
      id: todayVerse.id,
      reference: todayVerse.reference,
      text: todayVerse.text,
      explanation: todayVerse.plainExplanation,
      date: new Date().toISOString(),
    };
    if (isSaved) {
      await StorageService.removeVerse(verse.id);
    } else {
      await StorageService.saveVerse(verse);
    }
    setIsSaved(!isSaved);
  };

  if (loading || !todayVerse) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <AppText variant="caption" color={Colors.textSecondary}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </AppText>
            <AppText variant="h1" style={{ marginTop: 2 }}>Today's Word</AppText>
          </View>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={14} color={Colors.accent} />
            <AppText variant="caption" color={Colors.accent} style={{ marginLeft: 4 }}>
              {streak}
            </AppText>
          </View>
        </View>

        {/* Main Verse Card */}
        <Card style={styles.verseCard}>
          <TouchableOpacity onPress={toggleSave} style={styles.saveIcon}>
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={20}
              color={isSaved ? Colors.primary : Colors.textSecondary}
            />
          </TouchableOpacity>

          <View style={styles.topicBadge}>
            <AppText variant="caption" color={Colors.primary} style={{ fontSize: 10 }}>
              {todayVerse.topic.toUpperCase()}
            </AppText>
          </View>

          <AppText variant="h1" align="center" style={styles.verseText}>
            {todayVerse.text}
          </AppText>
          <AppText variant="caption" align="center" color={Colors.textSecondary}>
            — {todayVerse.reference}
          </AppText>
        </Card>

        {/* Quick Actions */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/two')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E8F0E8' }]}>
              <Ionicons name="book-outline" size={20} color={Colors.primary} />
            </View>
            <AppText variant="body" style={styles.actionLabel}>Understand</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>Read explanation</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/prayer')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F5EDE8' }]}>
              <Ionicons name="heart-outline" size={20} color={Colors.accent} />
            </View>
            <AppText variant="body" style={styles.actionLabel}>Pray</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>Guided prayer</AppText>
          </TouchableOpacity>
        </View>

        {/* Insight Preview */}
        <TouchableOpacity
          style={styles.insightCard}
          onPress={() => router.push('/two')}
          activeOpacity={0.8}
        >
          <View style={styles.insightHeader}>
            <Ionicons name="bulb-outline" size={16} color={Colors.accent} />
            <AppText variant="caption" color={Colors.accent} style={{ marginLeft: 6, fontWeight: '600' }}>
              Quick Insight
            </AppText>
          </View>
          <AppText variant="body" style={styles.insightText} numberOfLines={2}>
            {todayVerse.plainExplanation.substring(0, 100)}...
          </AppText>
          <AppText variant="caption" color={Colors.primary} style={{ marginTop: 8 }}>
            Tap to read more →
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF5F0',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verseCard: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    minHeight: 220,
    justifyContent: 'center',
    position: 'relative',
  },
  saveIcon: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 1,
    padding: 4,
  },
  topicBadge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    backgroundColor: '#E8F0E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verseText: {
    marginBottom: Spacing.md,
    lineHeight: 30,
    fontSize: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EDE8',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontWeight: '600',
    marginBottom: 2,
  },
  insightCard: {
    marginTop: Spacing.lg,
    backgroundColor: '#FFFBF8',
    borderRadius: 16,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#F5EDE8',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightText: {
    lineHeight: 20,
    color: Colors.text,
  },
});
