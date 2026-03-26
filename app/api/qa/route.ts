import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/gemini';
import { DocumentQARequest, DocumentQAResponse, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { document, question, context }: DocumentQARequest = await request.json();

    if (!document || !question) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Document and question are required' },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert document analyst. Answer questions based ONLY on the provided document context. Do not use any external knowledge or make assumptions beyond what is stated in the document.

Document:
${document}

${context ? `Additional Context: ${context}` : ''}

Question: ${question}

Instructions:
1. Answer the question using ONLY information from the provided document
2. If the answer is not found in the document, clearly state that
3. Include relevant excerpts that support your answer
4. Assess your confidence level based on how clearly the document addresses the question
5. Suggest follow-up questions that might be helpful

Return the response in this exact JSON structure:
{
  "answer": "Your answer based strictly on the document content",
  "confidence": "high|medium|low",
  "relevantExcerpts": [
    "Direct quote from document that supports the answer",
    "Another relevant excerpt if applicable"
  ],
  "followUpQuestions": [
    "Suggested follow-up question 1",
    "Suggested follow-up question 2",
    "Suggested follow-up question 3"
  ]
}
`;

    const response = await generateJSON<DocumentQAResponse>(prompt);

    return NextResponse.json<ApiResponse<DocumentQAResponse>>({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('QA API Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to process document Q&A' },
      { status: 500 }
    );
  }
}
