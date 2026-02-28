import { createClient } from "@/lib/supabase/client";
import { emailService } from "./email";

/**
 * Checks if a user has completed all lessons in a course
 */
export async function checkCourseCompletion(userId: string, courseId: string) {
    const supabase = createClient();

    // 0. Fetch Course Info and User Profile for notifications
    const { data: courseData } = await supabase
        .from('courses')
        .select('title')
        .eq('id', courseId)
        .single();

    const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single();

    const userEmail = profile?.email;
    const fullName = profile?.full_name || 'Étudiant';

    // 1. Fetch all lessons belonging to this course
    const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select(`
            id,
            module:modules!inner(course_id)
        `)
        .eq('module.course_id', courseId);

    if (lessonsError || !lessons || lessons.length === 0) {
        console.error("Error fetching course lessons:", lessonsError);
        return { completed: false, newlyIssued: false };
    }

    const totalLessons = lessons.length;
    const lessonIds = lessons.map(l => l.id);

    // 2. Fetch user's completed progress for these lessons
    const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('is_completed', true)
        .in('lesson_id', lessonIds);

    if (progressError) {
        console.error("Error fetching user progress:", progressError);
        return { completed: false, newlyIssued: false };
    }

    const completedCount = progress?.length || 0;

    // 3. If everything is completed, check/issue certificate
    if (completedCount >= totalLessons) {
        // Double check if certificate exists to avoid duplicates
        const { data: existingCert } = await supabase
            .from('certificates')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', courseId)
            .maybeSingle();

        if (!existingCert) {
            const { error: certError } = await supabase
                .from('certificates')
                .insert({
                    user_id: userId,
                    course_id: courseId,
                    certificate_url: 'AUTO_GENERATED' // Placeholder, the certificate page handles rendering
                });

            if (certError) {
                console.error("Error issuing certificate:", certError);
                return { completed: true, newlyIssued: false };
            }

            // 4. Send Success Email
            if (userEmail) {
                await emailService.sendEmail({
                    to: userEmail,
                    subject: `Félicitations ! Votre certificat LSFCONNECT est prêt`,
                    template: 'certificate',
                    data: {
                        name: fullName,
                        courseName: courseData?.title || 'Expertise LSF'
                    }
                });
            }

            return { completed: true, newlyIssued: true };
        }
        return { completed: true, newlyIssued: false };
    }

    return { completed: false, newlyIssued: false };
}
