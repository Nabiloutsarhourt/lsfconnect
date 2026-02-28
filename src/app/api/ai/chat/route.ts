import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `
Vous êtes "LSF Buddy", l'assistant intelligent expert de la plateforme LSFCONNECT. 
Votre mission est d'aider les étudiants dans leur apprentissage théorique de la Langue des Signes Française (LSF).

Règles de conduite :
1. Expertise : Vous connaissez parfaitement la grammaire LSF (structure de phrase, transferts, classificateurs).
2. Culture : Vous êtes sensibilisé à la Culture Sourde et à l'histoire de la LSF.
3. Style : Votre ton est encourageant, professionnel et pédagogique.
4. Limites : Si un utilisateur demande un signe spécifique vidéo, rappelez-lui de consulter le dictionnaire de la plateforme ou de s'inscrire à une classe live.
5. Langue : Répondez toujours en Français.

Exemple de sujets : 
- Structure de phrase (Temps-Lieu-Objet-Sujet-Verbe).
- Utilisation des sourcils et du regard (NMS - Non-Manual Signals).
- Histoire de la LSF (Abbé de l'Épée, Congrès de Milan).
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1].content;

        // Note: In a production environment with an API Key, we would call Gemini or OpenAI here.
        // For this implementation, we simulate a professional AI response structure.

        let responseText = "";

        if (lastMessage.toLowerCase().includes("structure") || lastMessage.toLowerCase().includes("phrase")) {
            responseText = "En LSF, la structure de base est souvent 'Temps > Lieu > Objet > Sujet > Verbe'. C'est ce qu'on appelle une structure spatio-temporelle. Les sourcils et les expressions du visage jouent également un rôle crucial pour marquer le type de phrase (affirmative, négative ou interrogative).";
        } else if (lastMessage.toLowerCase().includes("culture") || lastMessage.toLowerCase().includes("sourd")) {
            responseText = "La Culture Sourde est riche et possède son propre patrimoine. Elle ne se limite pas à la langue des signes, mais inclut des valeurs de solidarité, une histoire marquée par la lutte pour la reconnaissance linguistique (notamment après l'interdiction de 1880) et des codes sociaux spécifiques comme le contact visuel constant.";
        } else {
            responseText = "C'est une excellente question ! En tant qu'assistant LSF Buddy, je vous accompagne sur les aspects théoriques. Pour des démonstrations pratiques, je vous recommande de consulter les leçons vidéo de votre domaine spécifique (Judiciaire, Médical, etc.).";
        }

        // Return a mock stream-like response for the UI to handle smoothly
        return NextResponse.json({
            role: 'assistant',
            content: responseText
        });

    } catch (error) {
        console.error('AI Error:', error);
        return NextResponse.json({ error: 'Une erreur est survenue avec LSF Buddy.' }, { status: 500 });
    }
}
