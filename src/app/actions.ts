'use server';

import { generateExerciseSummary } from '@/ai/flows/generate-exercise-summary';

interface GenerateSummaryPayload {
    sessionData: string;
}

export async function generateSummaryAction(payload: GenerateSummaryPayload): Promise<string> {
    try {
        const result = await generateExerciseSummary({
            exerciseType: 'General Fitness Session',
            sessionData: payload.sessionData,
            userGoals: 'Improve overall form and consistency.',
        });
        return result.summary;
    } catch (e) {
        console.error('Error generating summary:', e);
        return 'Could not generate a summary for your session. Please try again later.';
    }
}
