import { GraduationCap, LogOut } from 'lucide-react';
import { useAuthContext } from '../context/AuthContexts';

const Navbar = () => {
    const { logout } = useAuthContext();
    return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <GraduationCap className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">Student Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-5 h-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;