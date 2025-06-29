'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User } from './types';
import ProfileHeader from './components/ProfileHeader';
import StatsCards from './components/StatsCards';
import ProfileTabs from './components/ProfileTabs';
import RecentActivity from './components/RecentActivity';
import ListingsGrid from './components/ListingsGrid';
import RentalsGrid from './components/RentalsGrid';
import ProfileSettings from './components/ProfileSettings';
import SecuritySettings from './components/SecuritySettings';
import { PlusCircleIcon, ShoppingBagIcon, StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { api } from '../utils/api';

// Helper function to transform auth user to profile user
const transformAuthUser = (authUser: import('../context/AuthContext').User | null): User | null => {
  if (!authUser) return null;
  
  return {
    ...authUser,
    address: authUser.address || undefined
  };
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [formattedData, setFormattedData] = useState({
    stats: [] as { label: string; value: string | number; icon: any }[],
    recentActivity: [] as any[],
    listedItems: [] as any[]
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

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

    // Format activity
    const activity = [
      ...(userData.rentals || []).map(rental => ({
        type: 'rental',
        item: rental.item.name,
        date: formatDate(rental.startDate),
        status: rental.status.toLowerCase(),
        id: rental.id
      })),
      ...(userData.reviews || []).map(review => ({
        type: 'review',
        item: review.item.name,
        date: 'Recently', // You might want to add date to the review model
        rating: review.rating,
        comment: review.comment,
        id: review.id
      }))
    ].sort((a, b) => {
      if (a.date === 'Today') return -1;
      if (b.date === 'Today') return 1;
      if (a.date === 'Yesterday') return -1;
      if (b.date === 'Yesterday') return 1;
      return 0;
    });

    // Format listings
    const listings = userData.items?.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category.name,
      price: `$${item.pricePerDay}/day`,
      image: item.imageUrl || '/images/placeholder-item.png',
      location: item.location || 'No location specified',
      available: item.available
    })) || [];

    setFormattedData({ stats, recentActivity: activity, listedItems: listings });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const itemDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - itemDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Redirect to home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleUpdateProfile = async (formData: any) => {
    try {
      const response = await api.users.update(formData);
      if (response.success && response.data) {
        setProfileData(response.data);
        formatDataForDisplay(response.data);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // Changed to match the API signature
      await api.users.updatePassword(currentPassword);
      await api.users.updatePassword(newPassword);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteAccount = async (password: string) => {
    try {
      // First verify the password
      const verifyResponse = await api.users.checkPassword(password);
      if (!verifyResponse.success) {
        throw new Error('Incorrect password');
      }

      // Then delete the account with the password
      await api.users.delete(password);
      
      // Logout and redirect
      await logout();
      window.location.href = '/';
    } catch (error) {
      throw error;
    }
  };

  const handleAddNewListing = () => {
    window.location.href = '/items/new';
  };

  const handleEditListing = (id: number) => {
    window.location.href = `/items/${id}/edit`;
  };

  const handleRemoveListing = async (id: number) => {
    try {
      await api.items.delete(id);
      await loadUserProfile();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <PlusCircleIcon className="h-12 w-12 text-purple-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen pt-20 pb-10">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-900/10 to-black/60 -z-10" />
      <div className="container mx-auto px-4">
        <ProfileHeader 
          user={transformAuthUser(user)}
          isLoggingOut={isLoggingOut}
          onLogout={handleLogout}
        />

        <StatsCards stats={formattedData.stats} />

        <ProfileTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mb-8">
          {activeTab === 'overview' && (
            <RecentActivity activities={formattedData.recentActivity} />
          )}

          {activeTab === 'listings' && (
            <ListingsGrid 
              items={formattedData.listedItems}
              onAddNew={handleAddNewListing}
              onEdit={handleEditListing}
              onRemove={handleRemoveListing}
            />
          )}

          {activeTab === 'rentals' && (
            <RentalsGrid 
              onViewRental={(id) => {
                // Navigate to rental details page
                window.location.href = `/rentals/${id}`;
              }}
            />
          )}

          {activeTab === 'favorites' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-4 capitalize">{activeTab}</h2>
              <p className="text-gray-400">This section is coming soon.</p>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-4 capitalize">{activeTab}</h2>
              <p className="text-gray-400">This section is coming soon.</p>
            </div>
          )}

          {activeTab === 'settings' && profileData && (
            <div className="space-y-8">
              <ProfileSettings 
                initialData={{
                  name: profileData.name || '', // Provide empty string as fallback
                  phoneCountry: profileData.phoneCountry || '',
                  phoneNumber: profileData.phoneNumber || '',
                  address: profileData.address || {
                    street: '',
                    houseNumber: '',
                    landmark: '',
                    city: '',
                    state: '',
                    country: '',
                    postalCode: ''
                  },
                  bio: profileData.bio || ''
                }}
                onSubmit={handleUpdateProfile}
              />

              <SecuritySettings
                onChangePassword={handleChangePassword}
                onDeleteAccount={handleDeleteAccount}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}