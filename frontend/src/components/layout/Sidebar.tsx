import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  FolderOpen, 
  Shield, 
  UserCheck, 
  Building2, 
  Bot, 
  FileText, 
  Settings 
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Cases', href: '/cases', icon: FolderOpen },
  { name: 'AML Monitor', href: '/aml-monitor', icon: Shield },
  { name: 'KYC Review', href: '/kyc-review', icon: UserCheck },
  { name: 'Basel Monitor', href: '/basel-monitor', icon: Building2 },
  { name: 'AI Analyst', href: '/ai-analyst', icon: Bot },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 bg-dark-800 border-r border-dark-700 h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-dark-700">
        <Shield className="w-8 h-8 text-primary-500" />
        <span className="ml-3 text-xl font-bold text-white">
          ComplianceGuard
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              clsx(
                'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-300 hover:bg-dark-700 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center justify-between px-3 py-2 bg-dark-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-dark-300">System Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

// Made with Bob
