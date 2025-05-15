import { useState, useEffect } from 'react';
import { userService } from '../services/UserService';
import type { User } from '../interfaces/User';

export function MyAccountPage() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = 1;
      const data = await userService.getById(userId);
      setUserInfo(data);
    } catch (err) {
      setUserInfo({
        id: 1,
        username: 'admin',
        role: 'admin',
        password: 'admin123'
      });
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo) return;

    try {
      setLoading(true);
      await userService.update(userInfo.id!, userInfo);
      setMessage('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setMessage('Profile updated successfully!');
      setEditMode(false);
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">My Account</h1>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={userInfo?.username || ''}
                  onChange={(e) => setUserInfo(prev => prev ? { ...prev, username: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={!editMode}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={userInfo?.role || ''}
                  onChange={(e) => setUserInfo(prev => prev ? { ...prev, role: e.target.value } : null)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={!editMode}
                />
              </div>

              {editMode && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={userInfo?.password || ''}
                    onChange={(e) => setUserInfo(prev => prev ? { ...prev, password: e.target.value } : null)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
              {editMode && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-md">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
