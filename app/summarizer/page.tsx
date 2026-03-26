'use client';

import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { MeetingSummary, ApiResponse } from '@/lib/types';
import { 
  FileText, 
  Users, 
  CheckCircle, 
  Calendar,
  AlertCircle,
  Copy,
  Download
} from 'lucide-react';

export default function SummarizerPage() {
  const [meetingNotes, setMeetingNotes] = useState('');
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!meetingNotes.trim()) {
      setError('Please enter meeting notes to summarize');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meetingNotes }),
      });

      const result: ApiResponse<MeetingSummary> = await response.json();

      if (result.success && result.data) {
        setSummary(result.data);
      } else {
        setError(result.error || 'Failed to summarize meeting notes');
      }
    } catch (err) {
      setError('An error occurred while summarizing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadSummary = () => {
    if (!summary) return;

    const content = `Meeting Summary: ${summary.title}\nDate: ${summary.date}\n\nAttendees:\n${summary.attendees.join(', ')}\n\nKey Points:\n${summary.keyPoints.join('\n')}\n\nAction Items:\n${summary.actionItems.map(item => `- ${item.description} (Owner: ${item.owner}, Priority: ${item.priority})`).join('\n')}\n\nDecisions:\n${summary.decisions.map(dec => `- ${dec.title}: ${dec.description}`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${summary.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-800';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-800';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Meeting Notes Summarizer</h1>
        <p className="text-gray-300">
          Transform raw meeting notes into structured action items, decisions, and key points with AI-powered analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="meetingNotes" className="block text-sm font-medium text-gray-300 mb-2">
              Meeting Notes
            </label>
            <textarea
              id="meetingNotes"
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              placeholder="Paste your raw meeting notes here. Include discussions, decisions, and action items mentioned during the meeting..."
              className="w-full h-96 p-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSummarize}
            disabled={isLoading || !meetingNotes.trim()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Summarizing...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Summarize Meeting Notes
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {summary && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Meeting Summary</h2>
                <button
                  onClick={downloadSummary}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{summary.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {summary.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {summary.attendees.length} attendees
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    Attendees
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {summary.attendees.map((attendee, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                      >
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">Key Points</h4>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Action Items
                  </h4>
                  <div className="space-y-3">
                    {summary.actionItems.map((item) => (
                      <div key={item.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-gray-100 font-medium">{item.description}</p>
                          <button
                            onClick={() => copyToClipboard(item.description)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-400">Owner: {item.owner}</span>
                          {item.deadline && (
                            <span className="text-gray-400">Due: {item.deadline}</span>
                          )}
                          <span className={`px-2 py-1 rounded-full border text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">Decisions</h4>
                  <div className="space-y-3">
                    {summary.decisions.map((decision) => (
                      <div key={decision.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="text-gray-100 font-medium">{decision.title}</h5>
                          <button
                            onClick={() => copyToClipboard(decision.description)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{decision.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>By: {decision.madeBy}</span>
                          <span>Impact: {decision.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!summary && !isLoading && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Enter your meeting notes and click "Summarize" to see AI-powered insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
