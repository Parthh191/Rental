'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  TagIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Background particle component to add visual interest
const BackgroundParticles = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="geometric-box opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 300 + 50}px`,
            height: `${Math.random() * 300 + 50}px`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 30 + 15}s`
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-purple-900/20" />
    </div>
  );
};

// Types for our components
interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  description: string | null;
  pricePerDay: number;
  available: boolean;
  imageUrl: string | null;
  location: string | null;
  category: {
    id: number;
    name: string;
  };
  owner: {
    id: number;
    name: string | null;
  };
}

// Component for the animated category card
const CategoryCard = ({ category, totalItems, onClick, isActive }: { 
  category: Category; 
  totalItems: number; 
  onClick: () => void;
  isActive: boolean;
}) => {
  // Get an appropriate emoji for each category
  const getCategoryEmoji = (name: string) => {
    const emojiMap: Record<string, string> = {
      'Electronics': '💻',
      'Vehicles': '🚗',
      'Tools': '🔧',
      'Spaces': '🏠',
      'Sports': '⚽',
      'Fashion': '👗',
      'Books': '📚',
      'Music': '🎸',
      'Games': '🎮',
      'Furniture': '🪑',
      'Art': '🎨',
      'Appliances': '🔌',
      'Photography': '📷',
    };
    
    return emojiMap[name] || '📦';
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden p-5 rounded-xl cursor-pointer transition-all duration-300
        ${isActive 
          ? 'bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30 border-2 border-purple-400 animate-glow' 
          : 'card hover:border-purple-500/30'}
      `}
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      layout
    >
      <motion.div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <span className="text-3xl animate-pulse-slow">{getCategoryEmoji(category.name)}</span>
            <h3 className="text-xl font-semibold text-white">{category.name}</h3>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-300">
            <TagIcon className="h-4 w-4 mr-1 text-purple-400" />
            <span>{totalItems} items available</span>
          </div>
        </div>
        
        <motion.div 
          className={`h-10 w-10 rounded-full flex items-center justify-center
            ${isActive ? 'bg-white animate-pulse-slow' : 'bg-gray-800'}`}
          whileHover={{ rotate: 15 }}
        >
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {isActive ? (
              <motion.div 
                className="w-3 h-3 rounded-full bg-purple-600"
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            ) : (
              <motion.div className="w-2 h-2 rounded-full bg-gray-400" />
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated border effect when active */}
      {isActive && (
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur-sm opacity-50 -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.99, 1.01, 0.99],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

// Component for item cards
const ItemCard = ({ item }: { item: Item }) => {
  return (
    <motion.div
      className="card group relative overflow-hidden rounded-xl"
      whileHover={{ 
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative h-48 w-full overflow-hidden">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
            <span className="text-4xl animate-float">{item.category.name === 'Electronics' ? '💻' : '📦'}</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg backdrop-blur-sm animate-shine">
          ${item.pricePerDay} / day
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-white truncate">{item.name}</h3>
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
            {item.category.name}
          </span>
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
          {item.description || 'No description available'}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-sm">
            <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
            <span>4.8</span>
          </div>
          
          {item.location && (
            <div className="text-xs text-gray-500 truncate max-w-[150px]">
              📍 {item.location}
            </div>
          )}
        </div>
        
        <motion.button
          className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all relative overflow-hidden group"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="relative z-10">View Details</span>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Main page component
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [itemCounts, setItemCounts] = useState<Record<number, number>>({});
  
  // Fetch all categories and items
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all items with a staggered animation effect
        const response = await api.items.getAll();
        
        if (response && response.data) {
          // Add a small delay for a smoother animation effect
          const animateData = async () => {
            // First set categories with animation
            const allItems = response.data as Item[];
            
            // Extract unique categories with a better method
            const uniqueCategories = Array.from(
              new Map(allItems.map(item => [item.category.id, item.category])).values()
            ).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
            
            setCategories(uniqueCategories);
            
            // Calculate item counts with a more visual approach
            const counts: Record<number, number> = {};
            allItems.forEach(item => {
              const categoryId = item.category.id;
              counts[categoryId] = (counts[categoryId] || 0) + 1;
            });
            setItemCounts(counts);
            
            // Set items with a small delay for visual effect
            setTimeout(() => {
              setItems(allItems);
              
              // Select the category with most items or first category by default
              if (uniqueCategories.length > 0) {
                const mostPopularCategory = uniqueCategories.reduce((prev, current) => 
                  (counts[current.id] > counts[prev.id]) ? current : prev, uniqueCategories[0]);
                setSelectedCategory(mostPopularCategory);
              }
            }, 300);
          };
          
          animateData();
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        // Show a more user-friendly error message
        setItems([]);
        setCategories([]);
      } finally {
        // Delay the loading state change for a smoother transition
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    
    fetchInitialData();
  }, []);
  
  // Filter items when category or search changes
  const filteredItems = items.filter(item => {
    // Filter by selected category
    const matchesCategory = !selectedCategory || item.category.id === selectedCategory.id;
    
    // Filter by search query
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });
  
  // Select a category
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
  };
  
  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 relative z-10">
      {/* Dynamic Background */}
      <BackgroundParticles />
      
      {/* Hero Section */}
      <motion.div 
        className="max-w-7xl mx-auto mb-12 text-center relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block mb-4"
        >
          <div className="p-2 px-4 rounded-full bg-purple-500/20 text-purple-300 flex items-center gap-1 text-sm font-medium">
            <SparklesIcon className="h-4 w-4" />
            <span>Discover amazing items to rent</span>
          </div>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 relative">
          Explore All Categories
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600 mx-auto w-40 rounded-full"></div>
        </h1>
        
        <motion.p 
          className="text-xl text-gray-400 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Find anything you need to rent, from electronics to vehicles, all in one place.
        </motion.p>
      </motion.div>
      
      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div 
          className="glass-dark border border-purple-500/20 rounded-xl p-4 shadow-lg relative overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-blue-900/10" />
          
          <div className="flex flex-col md:flex-row gap-4 relative z-10">
            <div className="relative flex-grow group">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search for items..." 
                className="w-full py-3 pl-10 pr-4 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {/* Animated focus effect */}
              <motion.div 
                className="absolute inset-0 border border-purple-500 rounded-lg pointer-events-none opacity-0"
                animate={{ 
                  opacity: searchQuery ? 0.5 : 0, 
                  scale: searchQuery ? 1 : 0.95 
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
            
            <motion.button 
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 rounded-lg border border-gray-700 relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearFilters}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              <span>Clear Filters</span>
              
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="md:col-span-1">
            <div className="glass-dark rounded-xl border border-purple-500/20 p-5 sticky top-20 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="bg-gradient-to-r from-purple-400 to-blue-500 w-1 h-6 rounded-full mr-2 animate-pulse-slow"></span>
                  Categories
                </h2>
                <motion.button
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-400 hover:text-purple-500 bg-gray-800/50 p-2 rounded-full hover:bg-gray-800"
                  onClick={clearFilters}
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </motion.button>
              </div>
              
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-800/70 animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <motion.div
                    className={`
                      p-3 rounded-lg cursor-pointer transition-all
                      ${!selectedCategory ? 'bg-gradient-to-r from-purple-600 to-blue-600 animate-glow' : 'bg-gray-800/70 hover:bg-gray-700/70'}
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(null)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌟</span>
                        <span className="font-medium">All Categories</span>
                      </div>
                      <span className="text-sm bg-white/20 text-white px-2 py-0.5 rounded-full">{items.length}</span>
                    </div>
                  </motion.div>
                  
                  {categories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      totalItems={itemCounts[category.id] || 0}
                      onClick={() => handleCategorySelect(category)}
                      isActive={selectedCategory?.id === category.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Items Grid */}
          <div className="md:col-span-3">
            <motion.div 
              className="glass-dark rounded-xl border border-purple-500/20 p-5 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="bg-gradient-to-r from-purple-400 to-blue-500 w-1 h-6 rounded-full mr-2"></span>
                  {selectedCategory ? `${selectedCategory.name} Items` : 'All Items'}
                  <motion.span 
                    className="ml-2 text-sm px-2 py-0.5 rounded-full bg-gray-800"
                    key={filteredItems.length}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {filteredItems.length} items
                  </motion.span>
                </h2>
                
                <div className="flex gap-2">
                  {/* Sort options would go here */}
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-gray-800/50 animate-pulse rounded-lg">
                      <div className="h-48 bg-gray-700/50 rounded-t-lg" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-700/50 rounded w-3/4" />
                        <div className="h-4 bg-gray-700/50 rounded w-1/2" />
                        <div className="h-4 bg-gray-700/50 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredItems.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  layout
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence>
                    {filteredItems.map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center p-8 rounded-lg glass-dark border border-gray-800/50 animate-pulse-slow">
                    <div className="text-6xl mb-4 animate-float">🔍</div>
                    <h3 className="text-2xl font-semibold mb-2 gradient-text">No items found</h3>
                    <p className="text-gray-400">
                      We couldn't find any items matching your criteria.
                    </p>
                    <motion.button
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-medium relative overflow-hidden group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                    >
                      <span className="relative z-10">Clear Filters</span>
                      <motion.div 
                        className="absolute inset-0 bg-white/10"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Interactive Panel at bottom */}
      <motion.div 
        className="fixed bottom-6 left-0 right-0 mx-auto w-full max-w-md px-4 z-20"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      >
        <div className="bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-xl p-4 rounded-2xl border border-purple-500/30 shadow-2xl animate-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-300">Need something specific?</p>
              <p className="text-xs text-gray-400">Try our advanced search options</p>
            </div>
            <Link href="/search">
              <motion.div
                className="bg-white text-purple-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                Advanced Search
                <motion.div 
                  className="absolute inset-0 bg-purple-100"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                  style={{ zIndex: -1 }}
                />
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}