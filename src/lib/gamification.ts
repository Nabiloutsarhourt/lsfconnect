import { createClient } from "@/lib/supabase/client";

export const GAMIFICATION_RULES = {
    LESSON_COMPLETE: 50,
    QUIZ_PASS: 100,
    QUIZ_PERFECT: 200,
    CASE_STUDY_SUBMIT: 150,
    FORUM_POST: 20,
};

export type AchievementTrigger = keyof typeof GAMIFICATION_RULES;

/**
 * Common Gamification engine to handle XP and Badge logic
 */
export async function awardPoints(userId: string, trigger: AchievementTrigger) {
    const supabase = createClient();
    const pointsToAdd = GAMIFICATION_RULES[trigger];

    // 1. Update Profile Points
    const { data: profile } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', userId)
        .single();

    const currentPoints = profile?.points || 0;
    const newPoints = currentPoints + pointsToAdd;

    await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', userId);

    // 2. Check for automatic badges (Logic can be expanded)
    // For simplicity, we trigger a check for basic badges
    await checkAndAwardBadges(userId, trigger, newPoints);

    return { pointsAdded: pointsToAdd, totalPoints: newPoints };
}

async function checkAndAwardBadges(userId: string, trigger: AchievementTrigger, totalPoints: number) {
    const supabase = createClient();

    // Map triggers to badge criteria_type
    const criteriaMap: Record<string, string> = {
        'LESSON_COMPLETE': 'course_completed',
        'QUIZ_PERFECT': 'quiz_perfect',
        'CASE_STUDY_SUBMIT': 'case_study_completed'
    };

    const criteriaType = criteriaMap[trigger];
    if (!criteriaType) return;

    // Find badge for this criteria
    const { data: badge } = await supabase
        .from('badges')
        .select('id')
        .eq('criteria_type', criteriaType)
        .single();

    if (badge) {
        // Attempt to award (Unique constraint will prevent duplicates if already earned)
        await supabase
            .from('user_badges')
            .insert({
                user_id: userId,
                badge_id: badge.id
            });
    }
}
