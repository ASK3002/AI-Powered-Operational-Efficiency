import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/gemini';
import { MeetingSummary, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { meetingNotes } = await request.json();

    if (!meetingNotes) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Meeting notes are required' },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert meeting analyst. Analyze the following meeting notes and extract key information in a structured format.

Meeting Notes:
${meetingNotes}

Please extract and organize the following information:
1. Meeting title (if not obvious, create a descriptive one)
2. Date (extract from notes or use today's date if not mentioned)
3. Attendees (list all people mentioned)
4. Action items with owners, deadlines, and priority levels
5. Decisions made with descriptions and impact
6. Key points discussed

Return the response in this exact JSON structure:
{
  "title": "Meeting title",
  "date": "YYYY-MM-DD",
  "attendees": ["Person 1", "Person 2"],
  "actionItems": [
    {
      "id": "unique-id-1",
      "description": "Clear action description",
      "owner": "Person responsible",
      "deadline": "YYYY-MM-DD",
      "priority": "high|medium|low"
    }
  ],
  "decisions": [
    {
      "id": "unique-id-2",
      "title": "Decision title",
      "description": "Detailed decision description",
      "madeBy": "Person who made the decision",
      "impact": "Impact description"
    }
  ],
  "keyPoints": ["Key point 1", "Key point 2"]
}
`;

    const summary = await generateJSON<MeetingSummary>(prompt);

    return NextResponse.json<ApiResponse<MeetingSummary>>({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Summarize API Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to summarize meeting notes' },
      { status: 500 }
    );
  }
}
