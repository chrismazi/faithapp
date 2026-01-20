import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

const KEYS = {
    SAVED_VERSES: 'faith_app_saved_verses',
    STREAK: 'faith_app_streak',
    REFLECTIONS: 'faith_app_reflections',
    IS_PREMIUM: 'faith_app_is_premium',
};

export interface Verse {
    id: string;
    reference: string;
    text: string;
    explanation: string;
    date: string;
}

export interface Streak {
    count: number;
    lastVisit: string; // ISO string
}

export interface Reflection {
    verseId: string;
    content: string;
    date: string;
}

export const StorageService = {
    // --- Verses ---
    async saveVerse(verse: Verse) {
        const saved = await this.getSavedVerses();
        if (!saved.find(v => v.id === verse.id)) {
            await AsyncStorage.setItem(KEYS.SAVED_VERSES, JSON.stringify([...saved, verse]));
        }
    },

    async removeVerse(verseId: string) {
        const saved = await this.getSavedVerses();
        const filtered = saved.filter(v => v.id !== verseId);
        await AsyncStorage.setItem(KEYS.SAVED_VERSES, JSON.stringify(filtered));
    },

    async getSavedVerses(): Promise<Verse[]> {
        const data = await AsyncStorage.getItem(KEYS.SAVED_VERSES);
        return data ? JSON.parse(data) : [];
    },

    // --- Streaks ---
    async updateStreak(): Promise<number> {
        const data = await AsyncStorage.getItem(KEYS.STREAK);
        const streak: Streak = data ? JSON.parse(data) : { count: 0, lastVisit: '' };

        const today = new Date();
        const todayISO = format(today, 'yyyy-MM-dd');

        if (streak.lastVisit === todayISO) {
            return streak.count;
        }

        let newCount = streak.count;
        if (streak.lastVisit === '' || isYesterday(parseISO(streak.lastVisit))) {
            newCount += 1;
        } else if (!isToday(parseISO(streak.lastVisit))) {
            newCount = 1;
        }

        const newStreak: Streak = { count: newCount, lastVisit: todayISO };
        await AsyncStorage.setItem(KEYS.STREAK, JSON.stringify(newStreak));
        return newCount;
    },

    async getStreak(): Promise<number> {
        const data = await AsyncStorage.getItem(KEYS.STREAK);
        return data ? JSON.parse(data).count : 0;
    },

    // --- Reflections ---
    async saveReflection(reflection: Reflection) {
        const reflections = await this.getReflections();
        await AsyncStorage.setItem(KEYS.REFLECTIONS, JSON.stringify([...reflections, reflection]));
    },

    async getReflections(): Promise<Reflection[]> {
        const data = await AsyncStorage.getItem(KEYS.REFLECTIONS);
        return data ? JSON.parse(data) : [];
    },

    // --- Premium ---
    async isPremium(): Promise<boolean> {
        const data = await AsyncStorage.getItem(KEYS.IS_PREMIUM);
        return data ? JSON.parse(data) : false;
    },

    async setPremium(status: boolean) {
        await AsyncStorage.setItem(KEYS.IS_PREMIUM, JSON.stringify(status));
    }
};
