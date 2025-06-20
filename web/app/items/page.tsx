'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { api } from '../utils/api';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Item {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  available: boolean;
  imageUrl: string | null;
  location: string | null;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  category: {
    id: number;
    name: string;
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

export default function ItemsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.items.getAll();
        if (response.success) {
          setItems(response.data);
        } else {
          setError('Failed to fetch items');
        }
      } catch (err) {
        setError('An error occurred while fetching items');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchItems();
    }
  }, [status, router]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-[#0a0a0a] overflow-hidden">
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1a1a]/90 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800/50 animate-pulse"
            >
              <div className="relative h-48 bg-gray-800"></div>
              <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="bg-red-900/50 backdrop-blur-sm border border-red-500/50 text-red-200 px-4 py-3 rounded-xl relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
      <BackgroundGradient />
      
      <div className="relative container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#1a1a1a]/80 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 transition-all shadow-[0_0_50px_rgba(168,85,247,0.15)] hover:shadow-[0_0_80px_rgba(168,85,247,0.25)]">
                <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span>Discover Amazing Items</span>
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(168,85,247,0.3)]">
              Available Items
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              Find the perfect items to rent from our trusted community
            </p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400 text-lg">No items available at the moment.</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {items.map((item) => (
                <Link 
                  href={`/items/${item.id}`} 
                  key={item.id}
                >
                  <motion.div
                    className="group relative cursor-pointer"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                    
                    <div className="relative bg-[#1a1a1a]/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)] group-hover:shadow-[0_8px_30px_rgba(168,85,247,0.3)] border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
                      <div className="relative h-48 w-full">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                        
                        {/* Price Tag with glow */}
                        <div className="absolute top-4 right-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative"
                          >
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm opacity-70"></div>
                            <div className="relative px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] font-medium backdrop-blur-sm">
                              ${item.pricePerDay}/day
                            </div>
                          </motion.div>
                        </div>
                        {!item.available && (
                          <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                            Not Available
                          </div>
                        )}
                      </div>

                      <div className="p-6 bg-gradient-to-b from-[#1a1a1a]/0 to-[#1a1a1a]/100">
                        <div className="mb-4">
                          <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 mb-2">
                            {item.name}
                          </h2>
                          <span className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full inline-block shadow-inner">
                            {item.category.name}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 mb-6 line-clamp-2">{item.description}</p>
                        
                        {item.location && (
                          <div className="mt-4 text-sm text-gray-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            {item.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}