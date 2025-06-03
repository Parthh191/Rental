'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

// Import User interface from AuthContext
import type { User } from '../context/AuthContext';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardHoverAnimation = {
  y: -8,
  scale: 1.02,
  boxShadow: "0 20px 30px rgba(147, 51, 234, 0.2)",
  transition: { duration: 0.3, ease: "easeOut" }
};

const cardTapAnimation = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

export default function ProfilePage() {
  const { user, logout, fetchUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [formattedData, setFormattedData] = useState({
    stats: [] as { label: string; value: string | number; icon: any }[],
    recentActivity: [] as any[],
    listedItems: [] as any[]
  });

  useEffect(() => {
    // Load user data from the server using JWT token
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        const userData = await fetchUserProfile();
        if (userData) {
          setProfileData(userData);
          formatDataForDisplay(userData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserProfile();
  }, []); // Empty dependency array to ensure it only runs once

  // Format the user data for display in the UI
  const formatDataForDisplay = (userData: User) => {
    // Format stats
    const stats = [
      { 
        label: 'Items Listed', 
        value: userData.stats?.itemsListed || 0, 
        icon: PlusCircleIcon 
      },
      { 
        label: 'Items Rented', 
        value: userData.stats?.totalRentals || 0, 
        icon: ShoppingBagIcon 
      },
      { 
        label: 'Reviews', 
        value: userData.stats?.totalReviews || 0, 
        icon: StarIcon 
      },
      { 
        label: 'Rating', 
        value: userData.stats?.averageRating || '0.0', 
        icon: ChatBubbleLeftRightIcon 
      }
    ];

    // Format activity (combine rentals and reviews)
    const activity = [];
    
    // Add rentals to activity
    if (userData.rentals && userData.rentals.length > 0) {
      const rentalActivity = userData.rentals.map(rental => {
        // Format dates for display - converting Date strings to actual Date objects
        const startDate = new Date(rental.startDate);
        const endDate = new Date(rental.endDate);
        
        // Calculate how long ago (e.g., 2 days ago, 1 week ago)
        const daysSince = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        
        let timeAgo;
        if (daysSince === 0) timeAgo = 'Today';
        else if (daysSince === 1) timeAgo = 'Yesterday';
        else if (daysSince < 7) timeAgo = `${daysSince} days ago`;
        else if (daysSince < 30) timeAgo = `${Math.floor(daysSince / 7)} week${Math.floor(daysSince / 7) > 1 ? 's' : ''} ago`;
        else timeAgo = `${Math.floor(daysSince / 30)} month${Math.floor(daysSince / 30) > 1 ? 's' : ''} ago`;
        
        return {
          type: 'rental',
          item: rental.item.name, // Using name instead of title as per schema
          date: timeAgo,
          status: rental.status.toLowerCase(),
          id: rental.id
        };
      });
      
      activity.push(...rentalActivity);
    }
    
    // Add reviews to activity
    if (userData.reviews && userData.reviews.length > 0) {
      const reviewActivity = userData.reviews.map(review => {
        // Since Review doesn't have createdAt in our schema, we'll use a placeholder date
        const daysSince = Math.floor(Math.random() * 30); // Random date for display purposes
        
        let timeAgo;
        if (daysSince === 0) timeAgo = 'Today';
        else if (daysSince === 1) timeAgo = 'Yesterday';
        else if (daysSince < 7) timeAgo = `${daysSince} days ago`;
        else if (daysSince < 30) timeAgo = `${Math.floor(daysSince / 7)} week${Math.floor(daysSince / 7) > 1 ? 's' : ''} ago`;
        
        return {
          type: 'review',
          item: review.item.name, // Using name instead of title as per schema
          date: timeAgo,
          rating: review.rating,
          comment: review.comment,
          id: review.id
        };
      });
      
      activity.push(...reviewActivity);
    }
    
    // Sort all activity by date (most recent first)
    activity.sort((a, b) => {
      // Basic sort by the date strings - this might need refinement
      const dateA = a.date;
      const dateB = b.date;
      if (dateA === 'Today') return -1;
      if (dateB === 'Today') return 1;
      if (dateA === 'Yesterday') return -1;
      if (dateB === 'Yesterday') return 1;
      return 0; // Default - keep original order
    });
    
    // Format listings
    const listings = [];
    if (userData.items && userData.items.length > 0) {
      const formattedListings = userData.items.map(item => {
        return {
          id: item.id,
          name: item.name, // Using name instead of title as per schema
          category: item.category.name,
          price: `$${item.pricePerDay}/day`, // Using pricePerDay instead of price as per schema
          image: item.imageUrl || '📸', // Using imageUrl instead of image as per schema
          location: item.location || 'No location specified',
          available: item.available
        };
      });
      
      listings.push(...formattedListings);
    }
    
    // Update state with formatted data
    setFormattedData({
      stats,
      recentActivity: activity,
      listedItems: listings
    });
  };

  const handleLogout = async () => {
    try {
      // First call NextAuth signOut to clear the session
      await signOut({ redirect: false });
      
      // Then call our custom logout to clean up the AuthContext
      logout();
      
      // Finally redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <main className="relative min-h-screen pt-20 pb-10">
      {/* Gradient overlay without particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-900/10 to-black/60 -z-10" />

      <div className="container mx-auto px-4">
        <AnimatePresence>
          {isLoading ? (
            <motion.div 
              className="flex items-center justify-center min-h-[80vh]"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <UserCircleIcon className="h-12 w-12 text-purple-500" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Profile header */}
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
                      onClick={handleLogout}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition duration-300 hover:cursor-pointer"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Logout
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Stats cards */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {formattedData.stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-purple-500/20 flex items-center gap-4"
                    variants={fadeInUp}
                    transition={{ delay: index * 0.1 }}
                    whileHover={cardHoverAnimation}
                    whileTap={cardTapAnimation}
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Tabs */}
              <div className="mb-8 border-b border-gray-800">
                <div className="flex overflow-x-auto scrollbar-hide gap-2">
                  {['overview', 'listings', 'rentals', 'favorites', 'messages', 'settings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 whitespace-nowrap capitalize font-medium transition-colors duration-300 cursor-pointer ${
                        activeTab === tab
                          ? 'text-purple-400 border-b-2 border-purple-500'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="mb-8">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                      {formattedData.recentActivity.map((activity, index) => (
                        <motion.div
                          key={index}
                          className="p-4 rounded-lg bg-gray-900/50 backdrop-blur-md border border-purple-500/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01, borderColor: 'rgba(168, 85, 247, 0.3)' }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="inline-block px-2 py-1 text-xs rounded bg-gray-800 text-gray-300 mb-2">
                                {activity.type}
                              </span>
                              <h3 className="text-white font-medium">{activity.item}</h3>
                              <p className="text-gray-400 text-sm">{activity.date}</p>
                            </div>
                            <div>
                              {activity.status && (
                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                  activity.status === 'active' 
                                    ? 'bg-green-500/20 text-green-300' 
                                    : 'bg-blue-500/20 text-blue-300'
                                }`}>
                                  {activity.status}
                                </span>
                              )}
                              {activity.rating && (
                                <div className="flex items-center">
                                  {[...Array(activity.rating)].map((_, i) => (
                                    <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'listings' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-white">Your Listings</h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-300"
                      >
                        <PlusCircleIcon className="h-5 w-5" />
                        Add New
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {formattedData.listedItems.map((item, index) => (
                        <motion.div
                          key={index}
                          className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-purple-500/10 flex flex-col"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={cardHoverAnimation}
                          whileTap={cardTapAnimation}
                        >
                          <div className="text-4xl mb-4">{item.image}</div>
                          <h3 className="text-white font-medium mb-2">{item.name}</h3>
                          <p className="text-gray-400 text-sm mb-2">{item.category}</p>
                          <p className="text-purple-400 font-semibold mb-4">{item.price}</p>
                          <div className="mt-auto flex justify-between">
                            <button className="text-sm text-blue-400 hover:text-blue-300">Edit</button>
                            <button className="text-sm text-red-400 hover:text-red-300">Remove</button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placeholder for other tabs */}
                {(activeTab === 'rentals' || activeTab === 'favorites' || activeTab === 'messages') && (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-white mb-4 capitalize">{activeTab}</h2>
                    <p className="text-gray-400">This section is coming soon.</p>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
                    
                    {/* Profile Settings */}
                    <div className="mb-8 p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-purple-500/20">
                      <h3 className="text-xl font-bold text-white mb-4">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                          <input 
                            type="text" 
                            defaultValue={user?.name || ''} 
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                          <input 
                            type="email" 
                            defaultValue={user?.email || ''} 
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                          <input 
                            type="tel" 
                            placeholder="Add phone number" 
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                          <input 
                            type="text" 
                            placeholder="Add your location" 
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                        <textarea 
                          rows={4}
                          placeholder="Tell others about yourself..." 
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="mt-6 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-300"
                        >
                          Save Changes
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Security Settings */}
                    <div className="mb-8 p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-purple-500/20">
                      <h3 className="text-xl font-bold text-white mb-4">Security</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                          <input 
                            type="password" 
                            placeholder="Enter current password" 
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                          <input 
                            type="password" 
                            placeholder="Enter new password" 
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                          <input 
                            type="password" 
                            placeholder="Confirm new password" 
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-300"
                        >
                          Update Password
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Danger Zone */}
                    <div className="p-6 rounded-xl bg-red-900/20 backdrop-blur-md border border-red-500/20">
                      <h3 className="text-xl font-bold text-white mb-4">Danger Zone</h3>
                      <p className="text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition duration-300"
                      >
                        Delete Account
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile logout button */}
              <div className="md:hidden mt-8">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}