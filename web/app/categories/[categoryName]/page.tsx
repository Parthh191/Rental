'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '../../utils/api';

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

// Background gradient component
const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
    <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-blob"></div>
    <div className="absolute bottom-1/3 -right-20 w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
    <div className="absolute top-2/3 left-1/3 w-60 h-60 bg-blue-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
  </div>
);

// Item card component
const ItemCard = ({ item }: { item: Item }) => (
  <motion.div
    className="group relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
    <div className="relative bg-[#1a1a1a]/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)] group-hover:shadow-[0_8px_30px_rgba(168,85,247,0.3)] border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
      {item.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          <div className="absolute top-4 right-4">
            <motion.div whileHover={{ scale: 1.1 }} className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-70"></div>
              <div className="relative px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] font-medium backdrop-blur-sm">
                ${item.pricePerDay}/day
              </div>
            </motion.div>
          </div>
        </div>
      )}
      
      <div className="p-6 bg-gradient-to-b from-[#1a1a1a]/0 to-[#1a1a1a]/100">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 mb-2">
            {item.name}
          </h2>
          <span className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full inline-block shadow-inner">
            {item.category.name}
          </span>
        </div>
        
        <p className="text-gray-400 mb-6 line-clamp-2">
          {item.description}
        </p>
        
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
  </motion.div>
);

export default function CategoryItemsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const categoryName = (params.categoryName as string).toLowerCase();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const data = await api.items.getByCategory(categoryName);
        
        if (data.success) {
          setItems(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryName && status === 'authenticated') {
      fetchItems();
    }
  }, [categoryName, status, router]);

  const filteredItems = items.filter(item =>
    searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <main className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
      <BackgroundGradient />
      
      <div className="relative container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(168,85,247,0.3)]">
              {/* Capitalize first letter for display */}
              {decodeURIComponent(categoryName).charAt(0).toUpperCase() + decodeURIComponent(categoryName).slice(1)}
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Browse available items in {decodeURIComponent(categoryName)}
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt opacity-0 group-hover:opacity-100"></div>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search items..." 
                  className="w-full py-4 pl-12 pr-4 rounded-xl bg-[#1a1a1a]/90 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.2)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <motion.div 
                className="inline-block p-8 rounded-lg glass-dark border border-gray-800/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold mb-2 gradient-text">No items found</h3>
                <p className="text-gray-400">
                  We couldn't find any items in this category matching your search.
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}