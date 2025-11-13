import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Calendar, 
  FileText, 
  Package, 
  Users,
  LogOut
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Sidebar = () => {
  const { user, logout } = useAuthStore();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/machines', icon: Settings, label: 'Machines' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/spare-parts', icon: Package, label: 'Spare Parts' },
  ];

  // Add Users link only for Admin
  if (user?.role === 'Admin') {
    navItems.push({ path: '/users', icon: Users, label: 'Users' });
  }

  return (
    <div className="w-64 bg-dark-900 border-r border-dark-700 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <h1 className="text-2xl font-tech font-bold text-primary-400">
          SMART FACTORY
        </h1>
        <p className="text-xs text-gray-500 mt-1">Maintenance Tracker</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/50'
                  : 'text-gray-400 hover:bg-dark-800 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info & Logout */}
      <div className="p-4 border-t border-dark-700">
        <div className="mb-3 px-4">
          <p className="text-sm font-medium text-white">{user?.username}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;