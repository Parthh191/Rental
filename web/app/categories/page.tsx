'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import Link from 'next/link';
import { SparklesIcon, TagIcon } from '@heroicons/react/24/outline';

// Background component with enhanced dark theme
const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
    <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-blob"></div>
    <div className="absolute bottom-1/3 -right-20 w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
    <div className="absolute top-2/3 left-1/3 w-60 h-60 bg-blue-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
  </div>
);

// Types for our components
interface Category {
  id: number;
  name: string;
}

interface Item {
  id: number;
  category: {
    id: number;
    name: string;
  };
}

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
    'Camera': '📸'
  };
  
  return emojiMap[name] || '📦';
};

// Main page component
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemCounts, setItemCounts] = useState<Record<number, number>>({});
  
  // Fetch all categories and count their items
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await api.items.getAll();
        
        if (response && response.data) {
          const allItems = response.data as Item[];
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Map(allItems.map(item => [item.category.id, item.category])).values()
          ).sort((a, b) => a.name.localeCompare(b.name));
          
          setCategories(uniqueCategories);
          
          // Calculate item counts
          const counts: Record<number, number> = {};
          allItems.forEach(item => {
            const categoryId = item.category.id;
            counts[categoryId] = (counts[categoryId] || 0) + 1;
          });
          setItemCounts(counts);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <main className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
      <BackgroundGradient />
      
      <div className="relative container mx-auto px-4 py-8">
        {/* Hero Section with enhanced ambient glow */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1a1a1a]/80 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 transition-all shadow-[0_0_50px_rgba(168,85,247,0.15)] hover:shadow-[0_0_80px_rgba(168,85,247,0.25)]">
              <SparklesIcon className="h-4 w-4 animate-pulse" />
              <span>Discover Amazing Items</span>
            </div>
          </motion.div>
        
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(168,85,247,0.3)]">
            Browse Categories
          </h1>
          
          <motion.p 
            className="text-gray-400 text-lg md:text-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Find anything you need to rent, from electronics to vehicles, all in one place.
          </motion.p>
        </motion.div>

        {/* Categories Grid with enhanced design */}
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-[#1a1a1a]/50 animate-pulse rounded-xl border border-gray-800/50"></div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {categories.map((category) => (
                <Link key={category.id} href={`/categories/${encodeURIComponent(category.name.toLowerCase())}`}>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <div className="relative">
                      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                      
                      <div className="relative bg-[#1a1a1a]/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)] group-hover:shadow-[0_8px_30px_rgba(168,85,247,0.3)] border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center text-3xl">
                            {getCategoryEmoji(category.name)}
                          </div>
                          <div className="relative">
                            <motion.div whileHover={{ scale: 1.1 }} className="relative">
                              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-70"></div>
                              <div className="relative px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] font-medium backdrop-blur-sm">
                                {itemCounts[category.id] || 0} items
                              </div>
                            </motion.div>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 mb-2">
                          {category.name}
                        </h3>
                        
                        <div className="flex items-center mt-4 text-purple-400 group-hover:text-purple-300 transition-colors">
                          <TagIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">Browse category</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}

          {categories.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <motion.div 
                className="inline-block p-8 rounded-lg bg-[#1a1a1a]/90 backdrop-blur-sm border border-gray-800/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-semibold mb-2 text-white">No Categories Found</h3>
                <p className="text-gray-400">
                  There are currently no categories available.
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}