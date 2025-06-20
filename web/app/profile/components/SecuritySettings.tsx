'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SecuritySettingsProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onDeleteAccount: (password: string) => Promise<void>;
}

export default function SecuritySettings({ onChangePassword, onDeleteAccount }: SecuritySettingsProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPasswordError('');
      setIsUpdatingPassword(true);

      if (newPassword !== confirmNewPassword) {
        setPasswordError('New passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters long');
        return;
      }

      await onChangePassword(currentPassword, newPassword);

      // Reset form and show success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowPasswordForm(false);
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsDeleting(true);
      setDeleteError('');
      
      await onDeleteAccount(deletePassword);
      
      // The parent component should handle the redirect after successful deletion
    } catch (error: any) {
      setDeleteError(error.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Password Change Section */}
      <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-gray-900/50 via-purple-900/10 to-gray-900/50 backdrop-blur-md border border-purple-500/20 shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">Security</h3>
        <div className="space-y-4">
          {!showPasswordForm ? (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPasswordForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/20 flex items-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Change Password
            </motion.button>
          ) : (
            <motion.form
              onSubmit={handlePasswordUpdate}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter current password"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Confirm new password"
                />
              </div>

              {passwordError && (
                <div className="p-3 bg-red-500/20 border border-red-500/20 rounded text-red-300 text-sm">
                  {passwordError}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordError('');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmNewPassword}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdatingPassword ? (
                    <>
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : 'Update Password'}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-xl bg-red-900/20 backdrop-blur-md border border-red-500/20">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-400 bg-clip-text text-transparent mb-4">Danger Zone</h3>
        <p className="text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition duration-300"
        >
          Delete Account
        </motion.button>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 p-6 rounded-xl border border-purple-500/20 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-white mb-4">Delete Account</h3>
              <p className="text-gray-400 mb-4">This action cannot be undone. Please enter your password to confirm.</p>
              
              {deleteError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/20 rounded text-red-300 text-sm">
                  {deleteError}
                </div>
              )}
              
              <form onSubmit={handleDeleteAccount}>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                />
                
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletePassword('');
                      setDeleteError('');
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!deletePassword || isDeleting}
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-red-300 rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : 'Delete Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}