import { useState } from 'react';
import { Mail, ArrowLeft, Key } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/AuthContexts.jsx';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { resetPassword, isloading } = useAuthContext();

  const handleSendReset = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const result = await resetPassword(email);

    if (result.success) {
      toast.success('Password reset instructions have been sent to your email.');
      navigate('/reset-password');
    } else {
      toast.error(result.error || 'Failed to send reset instructions');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
            <Key className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Forgot Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSendReset} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isloading}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isloading ? 'Sending...' : 'Send Reset Instructions'}
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

export default ForgotPassword;