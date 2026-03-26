import React from 'react';

// Meeting Notes Types
export interface ActionItem {
  id: string;
  description: string;
  owner: string;
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  madeBy: string;
  impact: string;
}

export interface MeetingSummary {
  title: string;
  date: string;
  attendees: string[];
  actionItems: ActionItem[];
  decisions: Decision[];
  keyPoints: string[];
}

// Email/Memo Drafting Types
export interface EmailDraftRequest {
  topic: string;
  tone: 'formal' | 'casual' | 'urgent' | 'informative';
  audience: 'team' | 'management' | 'clients' | 'all-staff';
  keyPoints?: string[];
  context?: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
  tone: string;
  audience: string;
  suggestedRecipients?: string[];
}

// Task Priority Types
export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  estimatedHours?: number;
  dependencies?: string[];
  assignee?: string;
  impact: 'high' | 'medium' | 'low';
  urgency: 'high' | 'medium' | 'low';
}

export interface TaskAnalysis {
  originalTasks: Task[];
  prioritizedTasks: Task[];
  reasoning: string;
  recommendations: string[];
}

// Document Q&A Types
export interface DocumentQARequest {
  document: string;
  question: string;
  context?: string;
}

export interface DocumentQAResponse {
  answer: string;
  confidence: 'high' | 'medium' | 'low';
  relevantExcerpts: string[];
  followUpQuestions: string[];
}

// Common API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// UI Component Types
export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  isActive?: boolean;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface SidebarItem {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
}

// Form Types
export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

// Utility Types
export type Priority = 'high' | 'medium' | 'low';
export type Tone = 'formal' | 'casual' | 'urgent' | 'informative';
export type Audience = 'team' | 'management' | 'clients' | 'all-staff';
