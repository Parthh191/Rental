'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  MapPinIcon, 
  TagIcon, 
  ClockIcon, 
  UserIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as ClockIconSolid,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { fetchRentalById, cancelRental } from '../../utils/rentalsApi';

interface RentalDetails {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  item: {
    id: number;
    name: string;
    description: string;
    pricePerDay: number;
    imageUrl: string | null;
    location: string | null;
    category: string;
    owner: {
      id: number;
      name: string;
      email: string;
    };
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function RentalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [rental, setRental] = useState<RentalDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const loadRental = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetchRentalById(id);
        if (response && response.success && response.data) {
          setRental(response.data);
        } else {
          setError('Failed to load rental details');
        }
      } catch (err) {
        console.error('Error loading rental:', err);
        setError('Failed to load rental details');
      } finally {
        setLoading(false);
      }
    };

    loadRental();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <ClockIconSolid className="w-5 h-5" />;
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalCost = (pricePerDay: number, startDate: string, endDate: string) => {
    const days = calculateDuration(startDate, endDate);
    return pricePerDay * days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CalendarIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <XCircleIcon className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Rental</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Rental Not Found</h2>
          <p className="text-gray-400 mb-6">The rental you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const duration = calculateDuration(rental.startDate, rental.endDate);
  const totalCost = calculateTotalCost(rental.item.pricePerDay, rental.startDate, rental.endDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <div className="relative pt-20 pb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-900/10 to-black/60 -z-10" />
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-3xl font-bold text-white">Rental Details</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
            >
              <div className="relative h-64 bg-gray-700">
                <img
                  src={rental.item.imageUrl || '/images/placeholder-item.png'}
                  alt={rental.item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-item.png';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border flex items-center gap-2 ${getStatusColor(rental.status)}`}>
                    {getStatusIcon(rental.status)}
                    {rental.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{rental.item.name}</h2>
                <p className="text-gray-400 mb-4">{rental.item.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-400">
                    <TagIcon className="w-4 h-4 mr-2" />
                    {rental.item.category}
                  </div>
                  <div className="text-2xl font-bold text-purple-400">
                    ${rental.item.pricePerDay}/day
                  </div>
                </div>

                {rental.item.location && (
                  <div className="flex items-center text-gray-400 mb-4">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    {rental.item.location}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Rental Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Rental Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Rental Start</div>
                    <div className="text-gray-400 text-sm">{formatDate(rental.startDate)} at {formatTime(rental.startDate)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Rental End</div>
                    <div className="text-gray-400 text-sm">{formatDate(rental.endDate)} at {formatTime(rental.endDate)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Duration</div>
                    <div className="text-gray-400 text-sm">{duration} day{duration > 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rental Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Rental Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Rate:</span>
                  <span className="text-white font-medium">${rental.item.pricePerDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white font-medium">{duration} day{duration > 1 ? 's' : ''}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-white font-bold text-lg">Total Cost:</span>
                    <span className="text-purple-400 font-bold text-lg">${totalCost}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Owner Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Item Owner</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{rental.item.owner.name}</div>
                  <div className="text-gray-400 text-sm">{rental.item.owner.email}</div>
                </div>
              </div>
              <button
                onClick={() => window.open(`mailto:${rental.item.owner.email}?subject=Rental Inquiry - ${rental.item.name}`, '_blank')}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                Contact Owner
              </button>
            </motion.div>

            {/* Rental Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Rental Info</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-gray-400 text-sm">Created</div>
                  <div className="text-white font-medium">{formatDate(rental.createdAt)}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Last Updated</div>
                  <div className="text-white font-medium">{formatDate(rental.updatedAt)}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.push('/profile')}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Back to Profile
          </button>
          <button
            onClick={() => router.push('/rentals')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            View All Rentals
          </button>
          {(rental.status.toLowerCase() === 'pending' || rental.status.toLowerCase() === 'approved') && (
            <button
              onClick={async () => {
                // Show confirmation dialog
                const confirmed = window.confirm(
                  `Are you sure you want to cancel this rental for "${rental.item.name}"? This action cannot be undone.`
                );
                
                if (!confirmed) return;
                
                try {
                  const response = await cancelRental(rental.id.toString());
                  
                  if (response.success) {
                    // Show success message and redirect to profile
                    alert('Rental cancelled successfully!');
                    router.push('/profile');
                  } else {
                    const errorData = response.error;
                    alert(errorData?.message || 'Failed to cancel rental');
                  }
                } catch (error) {
                  console.error('Error cancelling rental:', error);
                  alert('Failed to cancel rental. Please try again.');
                }
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Cancel Rental
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
} 