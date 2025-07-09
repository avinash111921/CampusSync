import { useAuthContext } from '../context/AuthContexts';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ProfileContent = () => {
    const { student, changePassword } = useAuthContext();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
        toast.error("Both fields are required");
        return;
    }
    const result = await changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword
    });
    if (result.success) {
        setCurrentPassword('');
        setNewPassword('');
    }
};


  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">Profile Settings</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={student?.fullName || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scholar ID</label>
            <input
              type="text"
              value={student?.scholarId || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
            <input
              type="text"
              value={student?.branch || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Semester</label>
            <input
              type="text"
              value={student?.semester || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
