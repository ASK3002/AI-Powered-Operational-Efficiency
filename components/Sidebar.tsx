'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Mail, 
  ListTodo, 
  MessageSquare,
  Home
} from 'lucide-react';
import { SidebarItem } from '@/lib/types';

const sidebarItems: SidebarItem[] = [
  {
    id: 'home',
    title: 'Home',
    href: '/',
    icon: <Home className="w-5 h-5" />
  },
  {
    id: 'summarizer',
    title: 'Meeting Summarizer',
    href: '/summarizer',
    icon: <FileText className="w-5 h-5" />
  },
  {
    id: 'drafting',
    title: 'Email Drafting',
    href: '/drafting',
    icon: <Mail className="w-5 h-5" />
  },
  {
    id: 'prioritizer',
    title: 'Task Priority',
    href: '/prioritizer',
    icon: <ListTodo className="w-5 h-5" />
  },
  {
    id: 'qa',
    title: 'Document Q&A',
    href: '/qa',
    icon: <MessageSquare className="w-5 h-5" />
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          OpsAI
        </h1>
        <p className="text-gray-400 text-sm mt-2">AI-Powered Operational Efficiency</p>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
          >
            {item.icon}
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-400">
            Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}
