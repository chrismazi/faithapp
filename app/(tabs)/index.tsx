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
        // Get today's verse
        const verse = getTodayVerse();
        setTodayVerse(verse);

        // Update streak
        const currentStreak = await StorageService.updateStreak();
        setStreak(currentStreak);

        // Check if saved
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
          <AppText variant="body" color={Colors.textSecondary} style={{ marginTop: 16 }}>
            Loading today's scripture...
          </AppText>
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
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </AppText>
            <AppText variant="h2">Today's Scripture</AppText>
          </View>
          <TouchableOpacity style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color={Colors.accent} />
            <AppText variant="caption" color={Colors.accent} style={{ marginLeft: 4 }}>
              {streak} {streak === 1 ? 'day' : 'days'}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Main Verse Card */}
        <Card style={styles.verseCard}>
          <TouchableOpacity onPress={toggleSave} style={styles.saveIcon}>
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isSaved ? Colors.primary : Colors.textSecondary}
            />
          </TouchableOpacity>

          <View style={styles.topicBadge}>
            <AppText variant="caption" color={Colors.primary}>
              {todayVerse.topic.charAt(0).toUpperCase() + todayVerse.topic.slice(1)}
            </AppText>
          </View>

          <AppText variant="h1" align="center" style={styles.verseText}>
            {todayVerse.text}
          </AppText>
          <AppText variant="body" align="center" color={Colors.textSecondary}>
            — {todayVerse.reference}
          </AppText>
        </Card>

        {/* Action Cards */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/two')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E8F0E8' }]}>
              <Ionicons name="book-outline" size={24} color={Colors.primary} />
            </View>
            <AppText variant="body" style={styles.actionLabel}>Understand</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>Plain English explanation</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/prayer')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F0EBE8' }]}>
              <Ionicons name="heart-outline" size={24} color={Colors.accent} />
            </View>
            <AppText variant="body" style={styles.actionLabel}>Pray</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>Guided prayer</AppText>
          </TouchableOpacity>
        </View>

        {/* Quick Insight Preview */}
        <Card padding="lg" style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="bulb-outline" size={20} color={Colors.accent} />
            <AppText variant="body" color={Colors.accent} style={{ marginLeft: 8, fontWeight: '600' }}>
              Today's Insight
            </AppText>
          </View>
          <AppText variant="body" style={styles.insightText} numberOfLines={3}>
            {todayVerse.plainExplanation.substring(0, 150)}...
          </AppText>
          <TouchableOpacity onPress={() => router.push('/two')}>
            <AppText variant="caption" color={Colors.primary} style={{ marginTop: 12 }}>
              Read full explanation →
            </AppText>
          </TouchableOpacity>
        </Card>
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
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0E8E0',
  },
  verseCard: {
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    minHeight: 280,
    justifyContent: 'center',
    position: 'relative',
  },
  saveIcon: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1,
    padding: Spacing.xs,
  },
  topicBadge: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: '#E8F0E8',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  verseText: {
    marginBottom: Spacing.lg,
    lineHeight: 38,
    fontSize: 24,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  insightCard: {
    marginTop: Spacing.xl,
    backgroundColor: '#FDFCFA',
    borderWidth: 1,
    borderColor: '#F0EBE8',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  insightText: {
    lineHeight: 22,
    color: Colors.text,
  },
});
