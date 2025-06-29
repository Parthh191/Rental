'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, SparklesIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { api } from '.././utils/api'
import {fetchRentalsByUser} from '.././utils/rentalsApi';
import { useSession } from 'next-auth/react';

interface Rental {
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

// Background component with enhanced dark theme
const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
    <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-blob"></div>
    <div className="absolute bottom-1/3 -right-20 w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
    <div className="absolute top-2/3 left-1/3 w-60 h-60 bg-blue-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
  </div>
);

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/login';
      return;
    }
    const fetchUserRentals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchRentalsByUser();
        console.log('API Response:', response); // Debug log

        if (response && response.success && Array.isArray(response.data)) {
          // Transform flat rentals to nested structure if needed
          const rentalsData = response.data.map((rental: any) => {
            if (rental.item) return rental;
            return {
              ...rental,
              item: {
                id: rental.itemId || rental.id,
                name: rental.title,
                description: rental.description,
                pricePerDay: rental.price,
                imageUrl: rental.imageUrl,
                location: rental.location,
                category: rental.category,
                owner: rental.owner || {},
              },
              // Optionally, remove flat fields if you want
            };
          });
          setRentals(rentalsData);
        } else if (response && Array.isArray(response)) {
          // Same transformation for fallback
          const rentalsData = response.map((rental: any) => {
            if (rental.item) return rental;
            return {
              ...rental,
              item: {
                id: rental.itemId || rental.id,
                name: rental.title,
                description: rental.description,
                pricePerDay: rental.price,
                imageUrl: rental.imageUrl,
                location: rental.location,
                category: rental.category,
                owner: rental.owner || {},
              },
            };
          });
          setRentals(rentalsData);
        } else {
          console.log('Unexpected response format:', response); // Debug log
          setError('Invalid response format from server');
        }
      } catch (error) {
        console.error('Error fetching user rentals:', error);
        setError('Failed to load your rentals. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchUserRentals();
    }
  }, []);

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
        return '⏳';
      case 'approved':
        return '✅';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const handleCardClick = (rentalId: number) => {
    router.push(`/rentals/${rentalId}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
        <BackgroundGradient />
        <div className="relative container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-purple-400">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-center">Loading your rentals...</p>
          </div>
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
        <BackgroundGradient />
        <div className="relative container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const filteredRentals = Array.isArray(rentals) ? rentals.filter((rental) => {
    // Check if rental and rental.item exist before accessing properties
    if (!rental || !rental.item) {
      console.warn('Rental or rental.item is undefined:', rental);
      return false;
    }
    
    const matchesSearch = rental.item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesCategory = selectedCategory === 'all' || rental.item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  // Sort rentals
  const sortedRentals = [...filteredRentals].sort((a, b) => {
    // Add null checks for sorting
    if (!a || !b || !a.item || !b.item) return 0;
    
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-low':
        return (a.item.pricePerDay || 0) - (b.item.pricePerDay || 0);
      case 'price-high':
        return (b.item.pricePerDay || 0) - (a.item.pricePerDay || 0);
      case 'popular':
        return b.status.localeCompare(a.status);
      default:
        return 0;
    }
  });

  console.log('Current rentals state:', rentals); // Debug log
  console.log('Filtered rentals:', filteredRentals); // Debug log

  return (
    <main className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
      <BackgroundGradient />
      
      <div className="relative container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section with enhanced ambient glow */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1a1a1a]/80 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 transition-all shadow-[0_0_50px_rgba(168,85,247,0.15)] hover:shadow-[0_0_80px_rgba(168,85,247,0.25)]">
                <SparklesIcon className="h-4 w-4 animate-pulse" />
                <span>Your Rental History</span>
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(168,85,247,0.3)]">
              My Rentals
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              View and manage all the items you've rented
            </p>
          </div>

          {/* Search and Filters with ambient glow */}
          <div className="max-w-2xl mx-auto mb-12 space-y-6">
            {/* Search Bar with extended glow */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt opacity-0 group-hover:opacity-100"></div>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search your rentals..." 
                  className="w-full py-4 pl-12 pr-4 rounded-xl bg-[#1a1a1a]/90 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.2)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Sort Dropdown with ambient glow */}
            <div className="flex justify-end">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="relative bg-[#1a1a1a]/90 text-gray-300 px-4 py-2 rounded-lg border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent shadow-[0_4px_20px_rgba(168,85,247,0.1)] hover:shadow-[0_4px_20px_rgba(168,85,247,0.2)] transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rental Cards Grid with enhanced ambient glow */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {sortedRentals.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <CalendarIcon className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Rentals Found</h3>
                <p className="text-gray-500">You haven't rented any items yet.</p>
                <button 
                  onClick={() => router.push('/items')}
                  className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Browse Items
                </button>
              </div>
            ) : (
              sortedRentals.map((rental) => {
                // Add null check for rental.item
                if (!rental || !rental.item) {
                  console.warn('Skipping rental with missing item data:', rental);
                  return null;
                }
                
                const duration = calculateDuration(rental.startDate, rental.endDate);
                const totalCost = calculateTotalCost(rental.item.pricePerDay || 0, rental.startDate, rental.endDate);
                
                return (
                  <motion.div
                    key={rental.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="group cursor-pointer"
                    onClick={() => handleCardClick(rental.id)}
                  >
                    {/* Ambient glow wrapper */}
                    <div className="relative">
                      {/* Large ambient glow */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                      
                      {/* Card content */}
                      <div className="relative bg-[#1a1a1a]/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)] group-hover:shadow-[0_8px_30px_rgba(168,85,247,0.3)] border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
                        {rental.item.imageUrl && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={rental.item.imageUrl}
                              alt={rental.item.name || 'Rental Item'}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                            
                            {/* Status Badge with glow */}
                            <div className="absolute top-4 left-4">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="relative"
                              >
                                <div className={`absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-70`}></div>
                                <div className={`relative px-3 py-1 ${getStatusColor(rental.status)} text-xs rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] font-medium backdrop-blur-sm border`}>
                                  <span className="mr-1">{getStatusIcon(rental.status)}</span>
                                  {rental.status}
                                </div>
                              </motion.div>
                            </div>

                            {/* Price Tag with glow */}
                            <div className="absolute top-4 right-4">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="relative"
                              >
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-70"></div>
                                <div className="relative px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] font-medium backdrop-blur-sm">
                                  ${rental.item.pricePerDay || 0}/day
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        )}
                        
                        <div className="p-6 bg-gradient-to-b from-[#1a1a1a]/0 to-[#1a1a1a]/100">
                          <div className="mb-4">
                            <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 mb-2">
                              {rental.item.name || 'Unnamed Item'}
                            </h2>
                            <span className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full inline-block shadow-inner">
                              {rental.item.category || 'Uncategorized'}
                            </span>
                          </div>
                          
                          <p className="text-gray-400 mb-4 line-clamp-2">
                            {rental.item.description || 'No description available'}
                          </p>

                          {/* Rental Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-300">
                              <CalendarIcon className="w-4 h-4 mr-2 text-purple-400" />
                              <span>{formatDate(rental.startDate)} - {formatDate(rental.endDate)}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                              <MapPinIcon className="w-4 h-4 mr-2 text-purple-400" />
                              <span>{rental.item.location || 'Location not specified'}</span>
                            </div>
                            <div className="text-sm text-gray-300">
                              <span className="text-purple-400">Duration:</span> {duration} day{duration !== 1 ? 's' : ''}
                            </div>
                            <div className="text-sm text-gray-300">
                              <span className="text-purple-400">Total Cost:</span> ${totalCost}
                            </div>
                          </div>
                          
                          {/* Button with enhanced glow */}
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative w-full group/btn"
                          >
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-sm opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg transition-all duration-300 font-medium flex items-center justify-center gap-2">
                              <span>View Details</span>
                              <svg 
                                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }).filter(Boolean) // Remove null entries
            )}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}