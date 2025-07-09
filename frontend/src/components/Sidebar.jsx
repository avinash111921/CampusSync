import { Link, useLocation } from 'react-router-dom';
import { User, Home, BookOpen, Award, Settings } from 'lucide-react';
import { useAuthContext } from '../context/AuthContexts';

const Sidebar = () => {
  const { student } = useAuthContext();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/courses', label: 'My Courses', icon: BookOpen },
    { path: '/grades', label: 'Grades', icon: Award },
    { path: '/profile', label: 'Profile', icon: Settings }
  ];

  return (
    <div className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-4">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <User className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="font-medium">{student?.fullName}</p>
            <p className="text-sm text-gray-600">{student?.scholarId}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;