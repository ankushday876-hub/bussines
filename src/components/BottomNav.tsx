import { Link, useLocation } from 'react-router-dom';
import { Calculator, History, Settings, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';

export function BottomNav() {
  const location = useLocation();
  const { isPremium } = useApp();

  const navItems = [
    { icon: Calculator, label: 'Calc', path: '/' },
    { icon: History, label: 'History', path: '/history' },
    { icon: ShieldCheck, label: 'Admin', path: '/admin' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      {!isPremium && (
        <div className="bg-gray-100 py-1 text-center text-xs text-gray-500 border-b border-gray-200">
          <span className="font-semibold">Ad Space</span> • Upgrade to Premium to remove
        </div>
      )}
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1',
                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-6 h-6', isActive && 'fill-current/10')} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
