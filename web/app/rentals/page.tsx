'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Rental {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
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

  useEffect(() => {
    // TODO: Fetch rentals from API
    // Placeholder data for now
    setRentals([
      {
        id: '1',
        title: 'Professional Camera',
        description: 'High-end DSLR camera perfect for photography',
        price: 50,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3'
      },
      {
        id: '2',
        title: 'Mountain Bike',
        description: 'Premium mountain bike for outdoor adventures',
        price: 35,
        category: 'Sports',
        imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3'
      },
      // Add more placeholder items as needed
    ]);
  }, []);
  const filteredRentals = rentals.filter((rental) => {
    const matchesSearch = rental.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || rental.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                <span>Discover Amazing Rentals</span>
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(168,85,247,0.3)]">
              Available Rentals
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Find the perfect items to rent from our trusted community
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
                  placeholder="Search rentals..." 
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 "
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
            {filteredRentals.map((rental) => (
              <motion.div
                key={rental.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                {/* Ambient glow wrapper */}
                <div className="relative">
                  {/* Large ambient glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                  
                  {/* Card content */}
                  <div className="relative bg-[#1a1a1a]/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)] group-hover:shadow-[0_8px_30px_rgba(168,85,247,0.3)] border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
                    {rental.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={rental.imageUrl}
                          alt={rental.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        {/* Price Tag with glow */}
                        <div className="absolute top-4 right-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative"
                          >
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-70"></div>
                            <div className="relative px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] font-medium backdrop-blur-sm">
                              ${rental.price}/day
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6 bg-gradient-to-b from-[#1a1a1a]/0 to-[#1a1a1a]/100">
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 mb-2">
                          {rental.title}
                        </h2>
                        <span className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full inline-block shadow-inner">
                          {rental.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 mb-6 line-clamp-2">
                        {rental.description}
                      </p>
                      
                      {/* Button with enhanced glow */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative w-full group/btn"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-sm opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg transition-all duration-300 font-medium flex items-center justify-center gap-2">
                          <span>Rent Now</span>
                          <svg 
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}