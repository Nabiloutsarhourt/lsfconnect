/**
 * LSFCONNECT Email Service
 * Responsabilité : Gérer les communications automatisées vers les utilisateurs.
 * Note : Utilise un logger en développement, prêt pour Resend/SMTP en production.
 */

interface EmailPayload {
    to: string;
    subject: string;
    template: 'welcome' | 'certificate' | 'subscription_active';
    data: Record<string, any>;
}

export const emailService = {
    async sendEmail({ to, subject, template, data }: EmailPayload) {
        console.log(`[EMAIL SERVICE] Sending ${template} to ${to} with subject: ${subject}`);

        // Simulation de délai réseau
        await new Promise(resolve => setTimeout(resolve, 500));

        // Logique de rendu de template (MOCK)
        const html = this.renderTemplate(template, data);

        // En production, décommentez l'intégration Resend
        /*
        const { data: resendData, error } = await resend.emails.send({
            from: 'LSFCONNECT <no-reply@lsfconnect.fr>',
            to,
            subject,
            html,
        });
        */

        return { success: true, messageId: `msg_${Math.random().toString(36).substr(2, 9)}` };
    },

    renderTemplate(template: string, data: any) {
        switch (template) {
            case 'welcome':
                return `<h1>Bienvenue sur LSFCONNECT, ${data.name} !</h1><p>Préparez-vous à maîtriser la LSF dans le domaine ${data.domain}.</p>`;
            case 'certificate':
                return `<h1>Félicitations !</h1><p>Vous avez obtenu votre certificat pour le cours ${data.courseName}.</p>`;
            default:
                return `<p>Message LSFCONNECT</p>`;
        }
    }
};
