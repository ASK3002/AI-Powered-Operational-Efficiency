'use client';

import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Task, TaskAnalysis, ApiResponse } from '@/lib/types';
import { 
  ListTodo, 
  Plus,
  Trash2,
  ArrowUpDown,
  TrendingUp,
  AlertCircle,
  Calendar,
  Clock,
  User,
  Copy,
  Download
} from 'lucide-react';

export default function PrioritizerPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '',
      description: '',
      deadline: '',
      estimatedHours: undefined,
      dependencies: [],
      assignee: '',
      impact: 'medium',
      urgency: 'medium'
    }
  ]);
  const [analysis, setAnalysis] = useState<TaskAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: '',
      description: '',
      deadline: '',
      estimatedHours: undefined,
      dependencies: [],
      assignee: '',
      impact: 'medium',
      urgency: 'medium'
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const updateTask = (id: string, field: keyof Task, value: any) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const handleAnalyze = async () => {
    const validTasks = tasks.filter(task => task.title.trim() && task.description.trim() && task.deadline);
    
    if (validTasks.length === 0) {
      setError('Please add at least one complete task with title, description, and deadline');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/prioritize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks: validTasks }),
      });

      const result: ApiResponse<TaskAnalysis> = await response.json();

      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        setError(result.error || 'Failed to analyze task priorities');
      }
    } catch (err) {
      setError('An error occurred while analyzing tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadAnalysis = () => {
    if (!analysis) return;

    const content = `Task Priority Analysis\n\n${analysis.reasoning}\n\nRecommendations:\n${analysis.recommendations.join('\n')}\n\nPrioritized Tasks:\n${analysis.prioritizedTasks.map((task, index) => `${index + 1}. ${task.title} - ${task.impact} impact, ${task.urgency} urgency`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-priority-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (impact: string, urgency: string) => {
    if (impact === 'high' && urgency === 'high') return 'text-red-400 bg-red-900/20 border-red-800';
    if (impact === 'high' || urgency === 'high') return 'text-orange-400 bg-orange-900/20 border-orange-800';
    if (impact === 'medium' && urgency === 'medium') return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
    return 'text-green-400 bg-green-900/20 border-green-800';
  };

  const getPriorityScore = (impact: string, urgency: string) => {
    const impactScore = impact === 'high' ? 3 : impact === 'medium' ? 2 : 1;
    const urgencyScore = urgency === 'high' ? 3 : urgency === 'medium' ? 2 : 1;
    return impactScore * urgencyScore;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Task Priority Analyzer</h1>
        <p className="text-gray-300">
          AI-powered task ranking based on urgency, impact, and strategic importance with detailed reasoning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Tasks</h2>
              <button
                onClick={addTask}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {tasks.map((task, index) => (
                <div key={task.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-white">Task {index + 1}</h3>
                    {tasks.length > 1 && (
                      <button
                        onClick={() => removeTask(task.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                      placeholder="Task title"
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    <textarea
                      value={task.description}
                      onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                      placeholder="Task description"
                      rows={2}
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={task.deadline}
                        onChange={(e) => updateTask(task.id, 'deadline', e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      <input
                        type="number"
                        value={task.estimatedHours || ''}
                        onChange={(e) => updateTask(task.id, 'estimatedHours', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="Est. hours"
                        min="1"
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={task.impact}
                        onChange={(e) => updateTask(task.id, 'impact', e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="high">High Impact</option>
                        <option value="medium">Medium Impact</option>
                        <option value="low">Low Impact</option>
                      </select>
                      
                      <select
                        value={task.urgency}
                        onChange={(e) => updateTask(task.id, 'urgency', e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="high">High Urgency</option>
                        <option value="medium">Medium Urgency</option>
                        <option value="low">Low Urgency</option>
                      </select>
                    </div>

                    <input
                      type="text"
                      value={task.assignee}
                      onChange={(e) => updateTask(task.id, 'assignee', e.target.value)}
                      placeholder="Assignee (optional)"
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Analyzing Tasks...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Analyze Task Priorities
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {analysis && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Priority Analysis</h2>
                <button
                  onClick={downloadAnalysis}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    Reasoning
                  </h3>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{analysis.reasoning}</p>
                    <button
                      onClick={() => copyToClipboard(analysis.reasoning)}
                      className="mt-2 p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-3">Recommendations</h3>
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <p className="text-gray-300 text-sm">{rec}</p>
                          <button
                            onClick={() => copyToClipboard(rec)}
                            className="p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-2"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-green-400" />
                    Prioritized Tasks
                  </h3>
                  <div className="space-y-3">
                    {analysis.prioritizedTasks.map((task, index) => (
                      <div key={task.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold text-blue-400">#{index + 1}</span>
                              <h4 className="font-medium text-white">{task.title}</h4>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {task.deadline}
                              </div>
                              {task.estimatedHours && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {task.estimatedHours}h
                                </div>
                              )}
                              {task.assignee && (
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {task.assignee}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getPriorityColor(task.impact, task.urgency)}`}>
                              Score: {getPriorityScore(task.impact, task.urgency)}
                            </span>
                            <div className="flex gap-1">
                              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                                {task.impact}
                              </span>
                              <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                                {task.urgency}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!analysis && !isLoading && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <ListTodo className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Add your tasks and click "Analyze Task Priorities" to get AI-powered prioritization with detailed reasoning.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
