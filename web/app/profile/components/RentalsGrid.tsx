'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, TagIcon, ClockIcon } from '@heroicons/react/24/outline';
import { fetchRentalsByUser } from '../../utils/rentalsApi';

interface Rental {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  status: string;
}

interface RentalsGridProps {
  onViewRental?: (id: number) => void;
}

export default function RentalsGrid({ onViewRental }: RentalsGridProps) {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const rentalsData = await fetchRentalsByUser();
      setRentals(rentalsData);
    } catch (err) {
      console.error('Error loading rentals:', err);
      setError('Failed to load rentals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const calculateTotalCost = (price: number, startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return price * diffDays;
  };

  const getRentalStats = () => {
    const totalCost = rentals.reduce((sum, rental) => 
      sum + calculateTotalCost(rental.price, rental.startDate, rental.endDate), 0
    );
    
    const statusCounts = rentals.reduce((acc, rental) => {
      const status = rental.status.toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalCost, statusCounts };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Rentals</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={loadRentals}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Rentals Yet</h3>
        <p className="text-gray-400 mb-4">You haven't rented any items yet. Start exploring our catalog!</p>
        <button
          onClick={() => window.location.href = '/items'}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Browse Items
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Rentals</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {rentals.length} rental{rentals.length > 1 ? 's' : ''}
          </div>
          <button
            onClick={loadRentals}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Rental Statistics */}
      {rentals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              ${getRentalStats().totalCost.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {getRentalStats().statusCounts.approved || 0}
            </div>
            <div className="text-sm text-gray-400">Active Rentals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {getRentalStats().statusCounts.completed || 0}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map((rental, index) => (
          <motion.div
            key={rental.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-700 overflow-hidden">
              <img
                src={rental.imageUrl || '/images/placeholder-item.png'}
                alt={rental.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-item.png';
                }}
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(rental.status)}`}>
                  {rental.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                  {rental.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {rental.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-400 text-sm">
                  <TagIcon className="w-4 h-4 mr-1" />
                  {rental.category}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-400">
                    ${rental.price}/day
                  </div>
                  <div className="text-xs text-gray-500">
                    Total: ${calculateTotalCost(rental.price, rental.startDate, rental.endDate)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-400">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  <span>{formatDuration(rental.startDate, rental.endDate)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onViewRental?.(rental.id)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 