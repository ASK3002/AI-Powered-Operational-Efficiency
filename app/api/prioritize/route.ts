import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/gemini';
import { Task, TaskAnalysis, ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { tasks }: { tasks: Task[] } = await request.json();

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Tasks array is required' },
        { status: 400 }
      );
    }

    const tasksText = tasks.map((task, index) => 
      `${index + 1}. ${task.title}\n   Description: ${task.description}\n   Deadline: ${task.deadline}\n   Impact: ${task.impact}\n   Urgency: ${task.urgency}${task.estimatedHours ? `\n   Estimated Hours: ${task.estimatedHours}` : ''}${task.assignee ? `\n   Assignee: ${task.assignee}` : ''}${task.dependencies ? `\n   Dependencies: ${task.dependencies.join(', ')}` : ''}`
    ).join('\n\n');

    const prompt = `
You are an expert project manager and productivity consultant. Analyze the following tasks and prioritize them based on urgency, impact, dependencies, and strategic importance.

Tasks to analyze:
${tasksText}

Please:
1. Re-order the tasks by priority (highest priority first)
2. Assign a priority score (1-10) to each task
3. Provide detailed reasoning for the prioritization
4. Give actionable recommendations for task management

Consider these factors:
- Deadline proximity and importance
- Business impact and strategic alignment
- Dependencies between tasks
- Resource requirements and availability
- Risk of not completing on time

Return the response in this exact JSON structure:
{
  "originalTasks": [/* keep original tasks unchanged */],
  "prioritizedTasks": [
    {
      "id": "task-id",
      "title": "Task title",
      "description": "Task description",
      "deadline": "YYYY-MM-DD",
      "estimatedHours": 8,
      "dependencies": ["dependency1"],
      "assignee": "Person name",
      "impact": "high|medium|low",
      "urgency": "high|medium|low"
    }
  ],
  "reasoning": "Detailed explanation of why tasks were prioritized this way, including methodology and key factors considered",
  "recommendations": [
    "Recommendation 1 for task management",
    "Recommendation 2 for resource allocation",
    "Recommendation 3 for risk mitigation"
  ]
}
`;

    const analysis = await generateJSON<TaskAnalysis>(prompt);

    return NextResponse.json<ApiResponse<TaskAnalysis>>({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Prioritize API Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to analyze task priorities' },
      { status: 500 }
    );
  }
}
