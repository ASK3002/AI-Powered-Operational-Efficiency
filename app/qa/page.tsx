'use client';

import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { DocumentQARequest, DocumentQAResponse, ApiResponse } from '@/lib/types';
import { 
  MessageSquare, 
  FileText,
  Send,
  Copy,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export default function QAPage() {
  const [document, setDocument] = useState('');
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [qaHistory, setQaHistory] = useState<Array<{
    question: string;
    response: DocumentQAResponse;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskQuestion = async () => {
    if (!document.trim()) {
      setError('Please provide a document to analyze');
      return;
    }

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request: DocumentQARequest = {
        document: document.trim(),
        question: question.trim(),
        context: context.trim() || undefined
      };

      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result: ApiResponse<DocumentQAResponse> = await response.json();

      if (result.success && result.data) {
        setQaHistory(prev => [...prev, { question: question.trim(), response: result.data! }]);
        setQuestion('');
      } else {
        setError(result.error || 'Failed to process question');
      }
    } catch (err) {
      setError('An error occurred while processing your question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400 bg-green-900/20 border-green-800';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      case 'low': return 'text-red-400 bg-red-900/20 border-red-800';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'low': return <AlertCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const clearHistory = () => {
    setQaHistory([]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Document Q&A</h1>
        <p className="text-gray-300">
          Ask questions about any internal document and get accurate answers based solely on the provided context.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Document & Question</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="document" className="block text-sm font-medium text-gray-300 mb-2">
                  Document Text *
                </label>
                <textarea
                  id="document"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  placeholder="Paste your document, policy, or any text content here..."
                  rows={8}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label htmlFor="context" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Any additional context that might help answer questions about this document..."
                  rows={3}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Question *
                </label>
                <div className="flex gap-2">
                  <input
                    id="question"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                    placeholder="What would you like to know about this document?"
                    className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={isLoading || !document.trim() || !question.trim()}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {qaHistory.length > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Q&A History</h3>
                <button
                  onClick={clearHistory}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear History
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {qaHistory.map((item, index) => (
                  <div key={index} className="text-sm">
                    <div className="text-gray-400 mb-1">Q: {item.question}</div>
                    <div className="text-gray-300 truncate">A: {item.response.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {qaHistory.length > 0 && (
            <div className="space-y-6">
              {qaHistory.map((item, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      Question
                    </h3>
                    <p className="text-gray-300">{item.question}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        Answer
                      </h4>
                      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <p className="text-gray-300 leading-relaxed">{item.response.answer}</p>
                          <button
                            onClick={() => copyToClipboard(item.response.answer)}
                            className="p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-3"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">Confidence:</span>
                        <span className={`px-2 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getConfidenceColor(item.response.confidence)}`}>
                          {getConfidenceIcon(item.response.confidence)}
                          {item.response.confidence}
                        </span>
                      </div>
                    </div>

                    {item.response.relevantExcerpts.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-400" />
                          Relevant Excerpts
                        </h4>
                        <div className="space-y-2">
                          {item.response.relevantExcerpts.map((excerpt, excerptIndex) => (
                            <div key={excerptIndex} className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                              <div className="flex items-start justify-between">
                                <p className="text-gray-400 text-sm italic">"{excerpt}"</p>
                                <button
                                  onClick={() => copyToClipboard(excerpt)}
                                  className="p-1 text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-2"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.response.followUpQuestions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-400" />
                          Follow-up Questions
                        </h4>
                        <div className="space-y-2">
                          {item.response.followUpQuestions.map((followUp, followUpIndex) => (
                            <button
                              key={followUpIndex}
                              onClick={() => setQuestion(followUp)}
                              className="w-full text-left bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-gray-300 text-sm hover:bg-gray-900 hover:border-gray-600 transition-colors"
                            >
                              {followUp}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {qaHistory.length === 0 && !isLoading && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Provide a document and ask a question to get AI-powered answers based solely on the provided context.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
