import Link from 'next/link';
import { FeatureCardProps } from '@/lib/types';

export default function FeatureCard({ title, description, icon, href, isActive = false }: FeatureCardProps) {
  return (
    <Link 
      href={href}
      className={`
        block p-6 rounded-xl border transition-all duration-200 hover:shadow-lg
        ${isActive 
          ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700' 
          : 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-750 hover:border-gray-600'
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`
          p-3 rounded-lg
          ${isActive ? 'bg-blue-700' : 'bg-gray-700'}
        `}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className={isActive ? 'text-blue-100' : 'text-gray-400'}>
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
