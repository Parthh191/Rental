'use client';

import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { User } from '../types';

interface ProfileHeaderProps {
  user: User | null;
  isLoggingOut: boolean;
  onLogout: () => void;
}

export default function ProfileHeader({ user, isLoggingOut, onLogout }: ProfileHeaderProps) {
  return (
    <motion.div 
      className="mb-8 p-8 rounded-2xl bg-gray-900/50 backdrop-blur-md border border-purple-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile avatar with animated border */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border-2 border-white/10">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || (
              <UserCircleIcon className="h-20 w-20 text-gray-400" />
            )}
          </div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {user?.name || 'User'}
          </h1>
          <p className="text-gray-400 mb-2">{user?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20">
              Verified User
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">
              Premium Member
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-300 border border-green-500/20">
              5.0 Rating
            </span>
          </div>
        </div>

        <div className="ml-auto flex-shrink-0 hidden md:block">
          <motion.button
            onClick={onLogout}
            disabled={isLoggingOut}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition duration-300 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <div className="w-5 h-5 border-t-2 border-b-2 border-red-300 rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}