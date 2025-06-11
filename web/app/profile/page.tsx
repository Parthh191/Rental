'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { api } from '../utils/api';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  PlusCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { User } from '../context/AuthContext';

interface Rental {
  id: number;
  startDate: Date;
  endDate: Date;
  status: string;
  item: {
    id: number;
    name: string;
    imageUrl: string | null;
  }
}

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  item: {
    name: string;
  }
}

interface Item {
  id: number;
  name: string;
  pricePerDay: number;
  imageUrl: string | null;
  available: boolean;
  category: {
    name: string;
  };
  location: string | null;
}

interface ProfileUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  phoneCountry?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    houseNumber?: string;
    landmark?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  bio?: string;
  image?: string;
  stats?: {
    itemsListed: number;
    totalRentals: number;
    totalReviews: number;
    averageRating: number;
  };
  rentals?: Rental[];
  reviews?: Review[];
  items?: Item[];
}

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
  const [profileData, setProfileData] = useState<ProfileUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [formattedData, setFormattedData] = useState({
    stats: [] as { label: string; value: string | number; icon: any }[],
    recentActivity: [] as any[],
    listedItems: [] as any[]
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneCountry: '',
    phoneNumber: '',
    address: {
      street: '',
      houseNumber: '',
      landmark: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    bio: ''
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Add country data for phone codes
  const countryPhoneCodes = [
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    // Add more countries as needed
  ];

  useEffect(() => {
    // Load user data from the server using JWT token
    const loadUserProfile = async () => {
      setIsLoading(true);
      try {
        const response = await api.users.getCurrent();
        if (response.data) {
          setProfileData(response.data);
          formatDataForDisplay(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserProfile();
  }, []); // Empty dependency array to ensure it only runs once

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        phoneCountry: profileData.phoneCountry || '',
        phoneNumber: profileData.phoneNumber || '',
        address: {
          street: profileData.address?.street || '',
          houseNumber: profileData.address?.houseNumber || '',
          landmark: profileData.address?.landmark || '',
          city: profileData.address?.city || '',
          state: profileData.address?.state || '',
          country: profileData.address?.country || '',
          postalCode: profileData.address?.postalCode || ''
        },
        bio: profileData.bio || ''
      });
    }
  }, [profileData]);

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
      const rentalActivity = userData.rentals.map((rental: Rental) => {
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
      const reviewActivity = userData.reviews.map((review: Review) => {
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
      const formattedListings = userData.items.map((item: Item) => {
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
      // Call our custom logout which now handles everything
      await logout();
      
      // After successful logout, redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setDeleteError('');
      
      // Verify password first
      const verifyResponse = await api.users.checkPassword(deletePassword);

      if (!verifyResponse.success) {
        setDeleteError('Incorrect password');
        setIsDeleting(false);
        return;
      }

      // If password is correct, proceed with deletion
      const deleteResponse = await api.users.delete();

      if (!deleteResponse.success) {
        throw new Error('Failed to delete account');
      }

      // First sign out from NextAuth
      await signOut({ redirect: false });
      
      // Then clear local state with custom logout
      await logout();
      
      // Finally redirect to home page
      window.location.href = '/';
    } catch (error: any) {
      setDeleteError(error.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePasswordUpdate = async () => {
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

      // Verify current password
      const checkResponse = await api.users.checkPassword(currentPassword);

      if (!checkResponse.success) {
        setPasswordError('Current password is incorrect');
        return;
      }

      // Update password
      const updateResponse = await api.users.updatePassword(newPassword);

      if (!updateResponse.success) {
        throw new Error('Failed to update password');
      }

      // Reset form and show success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowPasswordForm(false);
      
      // Optional: Show success message
      // You might want to add a state for success messages
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpdateUserDetails = async (formData: any) => {
    try {
      const response = await api.users.update(formData);
      if (response.success && response.data) {
        // Update local state with new user data
        setProfileData(response.data);
        formatDataForDisplay(response.data);
      }
    } catch (error: any) {
      console.error("Failed to update user details:", error);
      // You might want to add error handling UI here
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.users.update(formData);
      if (response.success && response.data) {
        // Convert flat address fields back to nested structure for profile data
        const userData = {
          ...response.data,
          address: {
            street: response.data.addressStreet,
            houseNumber: response.data.addressHouseNumber,
            landmark: response.data.addressLandmark,
            city: response.data.addressCity,
            state: response.data.addressState,
            country: response.data.addressCountry,
            postalCode: response.data.addressPostalCode
          }
        };
        setProfileData(userData);
        formatDataForDisplay(userData);
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error("Failed to update user details:", error);
      // You might want to add error handling UI here
    }
  };

  return (
    <main className="relative min-h-screen pt-20 pb-10">
      {/* Logout Animation Overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm"
          >
            <motion.div 
              className="text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative mb-4">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ArrowRightOnRectangleIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <p className="text-xl text-purple-300 animate-pulse">Logging out...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlay without particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-900/10 to-black/60 -z-10" />

      {/* Only render the main content if not logging out */}
      <AnimatePresence>
        {!isLoggingOut && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4"
          >
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
                        <div className="mb-8 overflow-hidden">
                          <motion.div 
                            className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 via-purple-900/10 to-gray-900/50 backdrop-blur-md border border-purple-500/20 shadow-lg hover:shadow-purple-500/10 transition-all duration-500"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="flex justify-between items-center mb-8">
                              <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                                  Profile Information
                                </h3>
                                <p className="text-gray-400 text-sm">Update your personal information and how others see you</p>
                              </div>
                              {!isEditing && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setIsEditing(true)}
                                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/20"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                  Edit Profile
                                </motion.button>
                              )}
                            </div>
                            
                            <form onSubmit={handleSubmitEdit} className="space-y-8">
                              {/* Basic Information */}
                              <div className="space-y-6">
                                <div className="flex items-center gap-2 text-purple-400 mb-4">
                                  <UserCircleIcon className="h-5 w-5" />
                                  <h4 className="text-lg font-semibold text-gradient bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Basic Information</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <motion.div
                                    className="space-y-2"
                                    initial={isEditing ? { opacity: 0, x: -20 } : false}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <label className="block text-sm font-medium text-gray-300">Full Name</label>
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                      <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        disabled={!isEditing}
                                        placeholder="Enter your full name"
                                      />
                                    </div>
                                  </motion.div>

                                  <motion.div
                                    className="space-y-2"
                                    initial={isEditing ? { opacity: 0, x: 20 } : false}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                  >
                                    <label className="block text-sm font-medium text-gray-300">Email Address</label>
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                      <input 
                                        type="email" 
                                        value={user?.email || ''} 
                                        className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        disabled
                                        placeholder="your@email.com"
                                      />
                                    </div>
                                  </motion.div>
                                </div>
                              </div>

                              {/* Phone Number with enhanced styling */}
                              <div className="space-y-6">
                                <div className="flex items-center gap-2 text-purple-400 mb-4">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  <h4 className="text-lg font-semibold text-gradient bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Contact Details</h4>
                                </div>
                                <div className="flex gap-4">
                                  <div className="w-2/5">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Country Code</label>
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                      <select
                                        name="phoneCountry"
                                        value={formData.phoneCountry}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 appearance-none"
                                      >
                                        <option value="">Select Country</option>
                                        {countryPhoneCodes.map((country) => (
                                          <option key={country.name} value={country.code}>
                                            {country.flag} {country.name} ({country.code})
                                          </option>
                                        ))}
                                      </select>
                                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-3/5">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                      <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                        className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        disabled={!isEditing}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Bio with character counter */}
                              <div className="space-y-6">
                                <div className="flex items-center gap-2 text-purple-400 mb-4">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <h4 className="text-lg font-semibold text-gradient bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">About You</h4>
                                </div>
                                <div className="relative group">
                                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                  <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell others about yourself..."
                                    className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 h-32 resize-none"
                                    disabled={!isEditing}
                                    maxLength={500}
                                  />
                                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                    {formData.bio?.length || 0}/500
                                  </div>
                                </div>
                              </div>

                              {/* Address Information with icon */}
                              <div className="space-y-6">
                                <div className="flex items-center gap-2 text-purple-400 mb-4">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <h4 className="text-lg font-semibold text-gradient bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Address Information</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <motion.div
                                    className="space-y-2"
                                    initial={isEditing ? { opacity: 0, y: 20 } : false}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <label className="block text-sm font-medium text-gray-300">Street</label>
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                      <input
                                        type="text"
                                        name="address.street"
                                        value={formData.address.street}
                                        onChange={handleInputChange}
                                        placeholder="Enter street name"
                                        className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        disabled={!isEditing}
                                      />
                                    </div>
                                  </motion.div>

                                  <motion.div
                                    className="space-y-2"
                                    initial={isEditing ? { opacity: 0, y: 20 } : false}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                  >
                                    <label className="block text-sm font-medium text-gray-300">House/Flat Number</label>
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                      <input
                                        type="text"
                                        name="address.houseNumber"
                                        value={formData.address.houseNumber}
                                        onChange={handleInputChange}
                                        placeholder="Enter house/flat number"
                                        className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        disabled={!isEditing}
                                      />
                                    </div>
                                  </motion.div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <motion.div
                                    className="space-y-2"
                                    initial={isEditing ? { opacity: 0, y: 20 } : false}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <label className="block text-sm font-medium text-gray-300">Landmark</label>
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                      <input
                                        type="text"
                                        name="address.landmark"
                                        value={formData.address.landmark}
                                        onChange={handleInputChange}
                                        placeholder="Enter nearby landmark"
                                        className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        disabled={!isEditing}
                                      />
                                    </div>
                                  </motion.div>

                                  <motion.div
                                    className="space-y-2"
                                    initial={isEditing ? { opacity: 0, y: 20 } : false}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                  >
                                    <label className="block text-sm font-medium text-gray-300">City</label>
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                      <input
                                        type="text"
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                        className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        disabled={!isEditing}
                                      />
                                    </div>
                                  </motion.div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <motion.div
                                    className="space-y-2"
                                    initial={isEditing ? { opacity: 0, y: 20 } : false}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <label className="block text-sm font-medium text-gray-300">State</label>
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                      <input
                                        type="text"
                                        name="address.state"
                                        value={formData.address.state}
                                        onChange={handleInputChange}
                                        placeholder="Enter state"
                                        className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        disabled={!isEditing}
                                      />
                                    </div>
                                  </motion.div>

                                  <motion.div
                                    className="space-y-2"
                                    initial={isEditing ? { opacity: 0, y: 20 } : false}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                  >
                                    <label className="block text-sm font-medium text-gray-300">Country</label>
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                      <input
                                        type="text"
                                        name="address.country"
                                        value={formData.address.country}
                                        onChange={handleInputChange}
                                        placeholder="Enter country"
                                        className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        disabled={!isEditing}
                                      />
                                    </div>
                                  </motion.div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <motion.div
                                    className="space-y-2"
                                    initial={isEditing ? { opacity: 0, y: 20 } : false}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <label className="block text-sm font-medium text-gray-300">Postal Code</label>
                                    <div className="relative group">
                                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                                      <input
                                        type="text"
                                        name="address.postalCode"
                                        value={formData.address.postalCode}
                                        onChange={handleInputChange}
                                        placeholder="Enter postal code"
                                        className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                        disabled={!isEditing}
                                      />
                                    </div>
                                  </motion.div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              {isEditing && (
                                <motion.div 
                                  className="flex justify-end gap-4 pt-6 border-t border-gray-700"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(107, 114, 128, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      setIsEditing(false);
                                      if (profileData) {
                                        setFormData({
                                          name: profileData.name || '',
                                          phoneCountry: profileData.phoneCountry || '',
                                          phoneNumber: profileData.phoneNumber || '',
                                          address: {
                                            street: profileData.address?.street || '',
                                            houseNumber: profileData.address?.houseNumber || '',
                                            landmark: profileData.address?.landmark || '',
                                            city: profileData.address?.city || '',
                                            state: profileData.address?.state || '',
                                            country: profileData.address?.country || '',
                                            postalCode: profileData.address?.postalCode || ''
                                          },
                                          bio: profileData.bio || ''
                                        });
                                      }
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-500/20"
                                  >
                                    Cancel
                                  </motion.button>
                                  <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/20 flex items-center gap-2"
                                  >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Save Changes
                                  </motion.button>
                                </motion.div>
                              )}
                            </form>
                          </motion.div>
                        </div>
                        
                        {/* Security Settings */}
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
                              <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="space-y-4"
                              >
                                <div>
                                  <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                                  <motion.div
                                    whileFocus={{ scale: 1.01 }}
                                    className="relative group"
                                  >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-20 group-hover:opacity-30 transition duration-300 blur"></div>
                                    <input 
                                      type="password" 
                                      value={currentPassword}
                                      onChange={(e) => setCurrentPassword(e.target.value)}
                                      placeholder="Enter current password" 
                                      className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    />
                                  </motion.div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                                  <motion.div
                                    whileFocus={{ scale: 1.01 }}
                                    className="relative group"
                                  >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-20 group-hover:opacity-30 transition duration-300 blur"></div>
                                    <input 
                                      type="password" 
                                      value={newPassword}
                                      onChange={(e) => setNewPassword(e.target.value)}
                                      placeholder="Enter new password" 
                                      className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    />
                                  </motion.div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                                  <motion.div
                                    whileFocus={{ scale: 1.01 }}
                                    className="relative group"
                                  >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-20 group-hover:opacity-30 transition duration-300 blur"></div>
                                    <input 
                                      type="password" 
                                      value={confirmNewPassword}
                                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                                      placeholder="Confirm new password" 
                                      className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    />
                                  </motion.div>
                                </div>
                                {passwordError && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-500/20 border border-red-500/20 rounded-lg text-red-300 text-sm"
                                  >
                                    {passwordError}
                                  </motion.div>
                                )}
                                <div className="flex gap-4 justify-end mt-6">
                                  <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(107, 114, 128, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      setShowPasswordForm(false);
                                      setCurrentPassword('');
                                      setNewPassword('');
                                      setConfirmNewPassword('');
                                      setPasswordError('');
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-500/20"
                                  >
                                    Cancel
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handlePasswordUpdate}
                                    disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmNewPassword}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isUpdatingPassword ? (
                                      <>
                                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                                        Updating...
                                      </>
                                    ) : (
                                      <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Update Password
                                      </>
                                    )}
                                  </motion.button>
                                </div>
                              </motion.div>
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
                      </div>
                    )}
                  </div>

                  {/* Delete Account Modal */}
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
                        
                        <input
                          type="password"
                          placeholder="Enter your password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                        />
                        
                        <div className="flex gap-3 justify-end">
                          <button
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
                            onClick={handleDeleteAccount}
                            disabled={!deletePassword || isDeleting}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isDeleting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-red-300/20 border-t-red-300 rounded-full animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              'Delete Account'
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                  
                  {/* Mobile logout button */}
                  <div className="md:hidden mt-8">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}