'use client';

import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EmailDraft, EmailDraftRequest, ApiResponse } from '@/lib/types';
import { 
  Mail, 
  Copy, 
  Send,
  User,
  MessageSquare,
  Briefcase,
  Building
} from 'lucide-react';

export default function DraftingPage() {
  const [formData, setFormData] = useState<EmailDraftRequest>({
    topic: '',
    tone: 'formal',
    audience: 'team',
    keyPoints: [],
    context: ''
  });
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyPointInput, setKeyPointInput] = useState('');

  const handleGenerateDraft = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic for the email');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<EmailDraft> = await response.json();

      if (result.success && result.data) {
        setDraft(result.data);
      } else {
        setError(result.error || 'Failed to generate email draft');
      }
    } catch (err) {
      setError('An error occurred while generating the draft. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addKeyPoint = () => {
    if (keyPointInput.trim()) {
      setFormData(prev => ({
        ...prev,
        keyPoints: [...(prev.keyPoints ?? []), keyPointInput.trim()]
      }));
      setKeyPointInput('');
    }
  };

  const removeKeyPoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyPoints: (prev.keyPoints ?? []).filter((_, i) => i !== index)
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'formal': return 'text-blue-400 bg-blue-900/20 border-blue-800';
      case 'casual': return 'text-green-400 bg-green-900/20 border-green-800';
      case 'urgent': return 'text-red-400 bg-red-900/20 border-red-800';
      case 'informative': return 'text-purple-400 bg-purple-900/20 border-purple-800';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800';
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'team': return <User className="w-4 h-4" />;
      case 'management': return <Briefcase className="w-4 h-4" />;
      case 'clients': return <Building className="w-4 h-4" />;
      case 'all-staff': return <MessageSquare className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Email/Memo Drafting</h1>
        <p className="text-gray-300">
          Generate professional internal communications with the perfect tone for your audience and topic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Email Details</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">
                  Topic *
                </label>
                <input
                  id="topic"
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g., Q4 Team Meeting, Project Update, Policy Change..."
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-gray-300 mb-2">
                    Tone
                  </label>
                  <select
                    id="tone"
                    value={formData.tone}
                    onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value as any }))}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="urgent">Urgent</option>
                    <option value="informative">Informative</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="audience" className="block text-sm font-medium text-gray-300 mb-2">
                    Audience
                  </label>
                  <select
                    id="audience"
                    value={formData.audience}
                    onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value as any }))}
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="team">Team</option>
                    <option value="management">Management</option>
                    <option value="clients">Clients</option>
                    <option value="all-staff">All Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="context" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  id="context"
                  value={formData.context}
                  onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                  placeholder="Any additional background information or context that should be included..."
                  rows={3}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Points (Optional)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={keyPointInput}
                    onChange={(e) => setKeyPointInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyPoint()}
                    placeholder="Add a key point..."
                    className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={addKeyPoint}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {(formData.keyPoints ?? []).length > 0 && (
                  <div className="space-y-2">
                    {(formData.keyPoints ?? []).map((point, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                        <span className="text-gray-300">{point}</span>
                        <button
                          onClick={() => removeKeyPoint(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerateDraft}
            disabled={isLoading || !formData.topic.trim()}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Generating Draft...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Generate Email Draft
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {draft && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Generated Draft</h2>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getToneColor(draft.tone)}`}>
                    {draft.tone}
                  </span>
                  <span className="px-3 py-1 rounded-full border text-xs font-medium text-gray-400 bg-gray-900/20 border-gray-700 flex items-center gap-1">
                    {getAudienceIcon(draft.audience)}
                    {draft.audience}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Subject</h3>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-100 font-medium">{draft.subject}</p>
                      <button
                        onClick={() => copyToClipboard(draft.subject)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Body</h3>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {draft.body}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(draft.body)}
                        className="p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-3"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {draft.suggestedRecipients && draft.suggestedRecipients.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Suggested Recipients</h3>
                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                      <div className="flex flex-wrap gap-2">
                        {draft.suggestedRecipients.map((recipient, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                          >
                            {recipient}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => copyToClipboard(`Subject: ${draft.subject}\n\n${draft.body}`)}
                    className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Full Email
                  </button>
                  <button className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send in Email Client
                  </button>
                </div>
              </div>
            </div>
          )}

          {!draft && !isLoading && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Fill in the email details and click "Generate Email Draft" to create a professional communication.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
