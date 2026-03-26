'use client';

import { useState } from 'react';
import FeatureCard from '@/components/FeatureCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  FileText, 
  Mail, 
  ListTodo, 
  MessageSquare,
  Brain,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      title: 'Meeting Notes Summarizer',
      description: 'Transform raw meeting notes into structured action items, decisions, and key points with AI-powered analysis.',
      icon: <FileText className="w-6 h-6 text-blue-400" />,
      href: '/summarizer'
    },
    {
      title: 'Email/Memo Drafting',
      description: 'Generate professional internal communications with the perfect tone for your audience and topic.',
      icon: <Mail className="w-6 h-6 text-green-400" />,
      href: '/drafting'
    },
    {
      title: 'Task Priority Analyzer',
      description: 'AI-powered task ranking based on urgency, impact, and strategic importance with detailed reasoning.',
      icon: <ListTodo className="w-6 h-6 text-purple-400" />,
      href: '/prioritizer'
    },
    {
      title: 'Document Q&A',
      description: 'Ask questions about any internal document and get accurate answers based solely on the provided context.',
      icon: <MessageSquare className="w-6 h-6 text-orange-400" />,
      href: '/qa'
    }
  ];

  const stats = [
    { label: 'AI Features', value: '4', icon: <Brain className="w-5 h-5" /> },
    { label: 'Efficiency Boost', value: '85%', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Team Members', value: '50+', icon: <Users className="w-5 h-5" /> },
    { label: 'Hours Saved', value: '24h', icon: <Clock className="w-5 h-5" /> }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to OpsAI
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          AI-powered operational efficiency tools for your organization
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-400">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Available Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              href={feature.href}
            />
          ))}
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Getting Started</h3>
        <div className="space-y-4 text-gray-300">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">1</div>
            <div>
              <h4 className="font-medium text-white mb-1">Choose a Tool</h4>
              <p className="text-sm">Select from our AI-powered features based on your current needs.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">2</div>
            <div>
              <h4 className="font-medium text-white mb-1">Input Your Data</h4>
              <p className="text-sm">Provide meeting notes, task details, documents, or communication requirements.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">3</div>
            <div>
              <h4 className="font-medium text-white mb-1">Get AI Results</h4>
              <p className="text-sm">Receive structured, actionable insights powered by Google Gemini AI.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
