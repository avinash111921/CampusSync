import { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/AuthContexts';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { changePassword, isloading } = useAuthContext();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New Password do not match with confirm password');
      return;
    }

    const credential = {
      oldPassword,
      newPassword,
    };

    const changePass = await changePassword(credential);
    if (changePass.success) {
      toast.success('Password changed successfully');
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } else {
      toast.error(changePass.error || 'Failed to change password');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
            <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your new password
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          {[
            { id: 'oldPassword', label: 'Current Password', value: oldPassword, setter: setOldPassword },
            { id: 'newPassword', label: 'New Password', value: newPassword, setter: setNewPassword },
            { id: 'confirmPassword', label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword }
          ].map(({ id, label, value, setter }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id={id}
                  type="password"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  required
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={isloading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isloading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;