import { useState, useEffect } from 'react';
import { userService } from '../services/UserService';
import type { User } from '../interfaces/User';
import DOMPurify from 'dompurify';

export function MyAccountPage() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const validateInput = (field: string, value: string): boolean => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'username':
        if (!value || value.length < 3) {
          newErrors.username = 'Username must be at least 3 characters long';
          setErrors(newErrors);
          return false;
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          newErrors.username = 'Username can only contain letters, numbers, underscores and hyphens';
          setErrors(newErrors);
          return false;
        }
        break;
      case 'password':
        if (value && value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters long';
          setErrors(newErrors);
          return false;
        }
        if (value && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(value)) {
          newErrors.password = 'Password must contain at least one letter and one number';
          setErrors(newErrors);
          return false;
        }
        break;
    }
    
    delete newErrors[field];
    setErrors(newErrors);
    return true;
  };

  const sanitizeInput = (value: string): string => {
    return DOMPurify.sanitize(value.trim());
  };

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

    const isUsernameValid = validateInput('username', userInfo.username);
    const isPasswordValid = userInfo.password ? validateInput('password', userInfo.password) : true;

    if (!isUsernameValid || !isPasswordValid) {
      return;
    }

    try {
      setLoading(true);
      const sanitizedUserInfo = {
        ...userInfo,
        username: sanitizeInput(userInfo.username),
        password: userInfo.password ? sanitizeInput(userInfo.password) : userInfo.password
      };
      
      await userService.update(userInfo.id!, sanitizedUserInfo);
      setMessage('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setMessage('Error updating profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (validateInput(field, value)) {
      setUserInfo(prev => prev ? { ...prev, [field]: value } : null);
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
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.username ? 'border-red-500' : ''
                  }`}
                  disabled={!editMode}
                  maxLength={50}
                  pattern="[a-zA-Z0-9_-]+"
                  title="Username can only contain letters, numbers, underscores and hyphens"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  value={userInfo?.role || ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled={true}
                  readOnly
                />
              </div>

              {editMode && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    value={userInfo?.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    minLength={8}
                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$"
                    title="Password must be at least 8 characters long and contain at least one letter and one number"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
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
                  disabled={loading || Object.keys(errors).length > 0}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-md">
              {DOMPurify.sanitize(message)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
