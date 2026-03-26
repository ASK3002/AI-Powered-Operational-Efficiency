import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/gemini';
import { EmailDraftRequest, EmailDraft, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { topic, tone, audience, keyPoints, context }: EmailDraftRequest = await request.json();

    if (!topic || !tone || !audience) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Topic, tone, and audience are required' },
        { status: 400 }
      );
    }

    const prompt = `
You are a professional corporate communications expert. Write an internal email/memo based on the following requirements:

Topic: ${topic}
Tone: ${tone}
Audience: ${audience}
${keyPoints ? `Key Points to Include:\n${keyPoints.join('\n')}` : ''}
${context ? `Additional Context:\n${context}` : ''}

Requirements:
- Write a professional, clear, and concise email
- Include an appropriate subject line
- Structure the email with proper greeting, body, and closing
- Match the specified tone (${tone}) for the ${audience} audience
- Incorporate all key points naturally
- Keep it professional and suitable for internal corporate communication

Return the response in this exact JSON structure:
{
  "subject": "Email subject line",
  "body": "Full email body with proper formatting including greeting and closing",
  "tone": "${tone}",
  "audience": "${audience}",
  "suggestedRecipients": ["recipient1@company.com", "recipient2@company.com"]
}
`;

    const draft = await generateJSON<EmailDraft>(prompt);

    return NextResponse.json<ApiResponse<EmailDraft>>({
      success: true,
      data: draft
    });

  } catch (error) {
    console.error('Draft API Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to generate email draft' },
      { status: 500 }
    );
  }
}
