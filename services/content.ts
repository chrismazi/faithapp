// Real Bible content for Faith App
// This provides actual scripture with plain-English explanations

export interface DailyContent {
    id: string;
    reference: string;
    text: string;
    plainExplanation: string;
    reflectionQuestion: string;
    prayerPrompt: string;
    aiInsight?: string;
    topic: string;
}

// A week's worth of real daily content
export const DAILY_VERSES: DailyContent[] = [
    {
        id: 'day-1',
        reference: 'Psalm 46:10',
        text: '"Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth."',
        plainExplanation: 'This verse is an invitation to pause. When life gets chaotic and overwhelming, God asks us to stop striving and remember who He is. "Be still" means to let go of your need to control everything. It\'s like God saying, "Relax. I\'ve got this. You don\'t have to figure it all out."',
        reflectionQuestion: 'What situation in your life right now do you need to "be still" about and trust God with?',
        prayerPrompt: 'Lord, help me to release my worries and remember that You are in control of what I cannot handle.',
        aiInsight: 'In Hebrew, "be still" is "raphah" - meaning to let go, release, or drop your weapons. This was written during a time of war, so it\'s literally saying: stop fighting battles that aren\'t yours to fight.',
        topic: 'peace',
    },
    {
        id: 'day-2',
        reference: 'Jeremiah 29:11',
        text: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
        plainExplanation: 'God isn\'t making things up as He goes. He has a specific plan for your life, and it\'s a good one. Even when things seem uncertain or painful right now, this verse promises that God\'s ultimate intention for you is hope and a good future—not punishment or abandonment.',
        reflectionQuestion: 'Where do you feel uncertain about your future? How might trusting God\'s plan change your perspective?',
        prayerPrompt: 'Father, when I can\'t see where I\'m going, help me trust that You already know the path and that it leads somewhere good.',
        aiInsight: 'This was written to Israelites in exile in Babylon—their world had collapsed. Yet God promised restoration after 70 years. Sometimes God\'s "good plans" unfold over longer timelines than we\'d prefer.',
        topic: 'hope',
    },
    {
        id: 'day-3',
        reference: 'Philippians 4:6-7',
        text: '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and minds in Christ Jesus."',
        plainExplanation: 'Anxiety is real, but it doesn\'t have to control you. This verse offers a practical solution: instead of worrying, talk to God about it. Tell Him what\'s on your mind, thank Him for what He\'s already done, and then let Him give you a peace that doesn\'t even make logical sense—a calm in the middle of the storm.',
        reflectionQuestion: 'What anxiety are you carrying that you haven\'t fully given to God in prayer?',
        prayerPrompt: 'God, I bring my worries to You right now. Thank You for hearing me. I choose to trust You and receive Your peace.',
        aiInsight: 'Paul wrote this from prison, facing possible execution. His peace wasn\'t from good circumstances—it was from relationship with God. The Greek word for "guard" is a military term: God\'s peace stands sentry over your mind.',
        topic: 'anxiety',
    },
    {
        id: 'day-4',
        reference: 'Proverbs 3:5-6',
        text: '"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."',
        plainExplanation: 'Your brain is powerful, but it doesn\'t know everything. This verse encourages you to trust God even when life doesn\'t make sense. "Lean not on your own understanding" means don\'t rely solely on what you can figure out. When you include God in every decision, He promises to guide you clearly.',
        reflectionQuestion: 'In what area of your life are you relying too heavily on your own understanding instead of seeking God\'s guidance?',
        prayerPrompt: 'Lord, I admit I don\'t have all the answers. Help me to trust Your wisdom over my own logic.',
        aiInsight: '"Heart" in Hebrew (leb) meant the entire inner person—mind, will, and emotions. This isn\'t just emotional trust; it\'s a complete intellectual and volitional commitment to God\'s wisdom.',
        topic: 'trust',
    },
    {
        id: 'day-5',
        reference: 'Isaiah 41:10',
        text: '"So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand."',
        plainExplanation: 'Fear is natural, but it doesn\'t have the final word. God makes four promises here: He\'s with you, He\'s your God, He\'ll give you strength, and He\'ll hold you up. You\'re not facing your challenges alone—God Himself is standing right beside you, ready to catch you if you fall.',
        reflectionQuestion: 'What fear has been holding you back? How does knowing God is with you change things?',
        prayerPrompt: 'Father, I feel afraid sometimes. Remind me that You are right here with me, holding me up.',
        aiInsight: 'The "righteous right hand" was the hand of power and honor in ancient culture. God isn\'t offering a weak, tentative support—He\'s extending His full strength and authority on your behalf.',
        topic: 'fear',
    },
    {
        id: 'day-6',
        reference: 'Romans 8:28',
        text: '"And we know that in all things God works for the good of those who love him, who have been called according to his purpose."',
        plainExplanation: 'This doesn\'t mean everything that happens is good—painful things are still painful. But it does mean God is a master at taking broken pieces and creating something beautiful. Even your mistakes, failures, and hardships can be transformed into something meaningful in God\'s hands.',
        reflectionQuestion: 'Looking back, can you see a difficult time that God eventually used for good in your life?',
        prayerPrompt: 'God, even when I don\'t understand what\'s happening, help me trust that You\'re working all things together for my good.',
        aiInsight: 'The Greek word for "works together" (synergei) gives us our word "synergy." God isn\'t just using individual events—He\'s weaving everything together into a greater purpose.',
        topic: 'purpose',
    },
    {
        id: 'day-7',
        reference: 'Matthew 11:28-30',
        text: '"Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light."',
        plainExplanation: 'Jesus isn\'t asking you to try harder or do more. He\'s inviting you to come as you are—tired, stressed, overwhelmed—and find rest. A "yoke" was a farming tool that connected two animals. Jesus is saying: walk with me, learn my pace, and you\'ll find that life with me is lighter than life without me.',
        reflectionQuestion: 'What heavy burden are you carrying that Jesus is inviting you to share with Him?',
        prayerPrompt: 'Jesus, I\'m tired. I come to You just as I am. Teach me to walk at Your pace and find true rest.',
        aiInsight: 'In Jewish culture, taking on a rabbi\'s "yoke" meant accepting their teaching and way of life. Jesus\' invitation is revolutionary: His way of living brings rest, not exhaustion.',
        topic: 'rest',
    },
];

// Topics for the library/explore section
export const TOPICS = [
    { id: 'anxiety', label: 'Anxiety & Worry', icon: 'cloud-outline', color: '#7BA3A8' },
    { id: 'peace', label: 'Peace & Stillness', icon: 'leaf-outline', color: '#8B9D83' },
    { id: 'hope', label: 'Hope & Future', icon: 'sunny-outline', color: '#D4A574' },
    { id: 'trust', label: 'Trust & Faith', icon: 'heart-outline', color: '#B88B8B' },
    { id: 'fear', label: 'Overcoming Fear', icon: 'shield-outline', color: '#9B8BB8' },
    { id: 'purpose', label: 'Purpose & Calling', icon: 'compass-outline', color: '#8BB8A8' },
    { id: 'rest', label: 'Rest & Renewal', icon: 'moon-outline', color: '#A8B8C8' },
    { id: 'strength', label: 'Strength & Courage', icon: 'fitness-outline', color: '#C8A888' },
];

// Get today's verse based on the date
export function getTodayVerse(): DailyContent {
    const dayOfWeek = new Date().getDay(); // 0-6
    return DAILY_VERSES[dayOfWeek] || DAILY_VERSES[0];
}

// Get verses by topic
export function getVersesByTopic(topicId: string): DailyContent[] {
    return DAILY_VERSES.filter(v => v.topic === topicId);
}
