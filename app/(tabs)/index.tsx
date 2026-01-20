import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../components/common/AppText';
import { Card } from '../../components/common/Card';
import { Colors, Spacing } from '../../constants/theme';
import { StorageService, Verse } from '../../services/storage';

const DAILY_VERSE: Verse = {
  id: 'psalm-46-10',
  reference: 'Psalm 46:10',
  text: '"Be still, and know that I am God."',
  explanation: 'This verse means that even when life feels chaotic or overwhelming, God is still in control...',
  date: new Date().toISOString(),
};

export default function HomeScreen() {
  const [streak, setStreak] = React.useState(0);
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      const currentStreak = await StorageService.updateStreak();
      setStreak(currentStreak);

      const saved = await StorageService.getSavedVerses();
      setIsSaved(!!saved.find(v => v.id === DAILY_VERSE.id));
    };
    init();
  }, []);

  const toggleSave = async () => {
    if (isSaved) {
      await StorageService.removeVerse(DAILY_VERSE.id);
    } else {
      await StorageService.saveVerse(DAILY_VERSE);
    }
    setIsSaved(!isSaved);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <AppText variant="h2">Daily Scripture</AppText>
          <View style={styles.streakBadge}>
            <AppText variant="caption" color={Colors.streak}>🌿 {streak} Day Streak</AppText>
          </View>
        </View>

        <Card style={styles.verseCard}>
          <TouchableOpacity onPress={toggleSave} style={styles.saveIcon}>
            <Ionicons
              name={isSaved ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isSaved ? Colors.primary : Colors.textSecondary}
            />
          </TouchableOpacity>
          <AppText variant="h1" align="center" style={styles.verseText}>
            {DAILY_VERSE.text}
          </AppText>
          <AppText variant="body" align="center" color={Colors.textSecondary}>
            — {DAILY_VERSE.reference}
          </AppText>
        </Card>

        <View style={styles.actions}>
          <Link href="/two" asChild>
            <TouchableOpacity>
              <Card padding="md" style={styles.button}>
                <AppText align="center" color="#FFF">Read Explanation</AppText>
              </Card>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  streakBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EFEAE2',
  },
  verseCard: {
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    minHeight: 300,
    justifyContent: 'center',
    position: 'relative',
  },
  saveIcon: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1,
  },
  verseText: {
    marginBottom: Spacing.lg,
    lineHeight: 42,
  },
  actions: {
    marginTop: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: Spacing.md,
  },
});
