'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { MapPinIcon, UserCircleIcon, CalendarIcon } from '@heroicons/react/24/outline';
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
    email: string;
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

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const data = await api.items.getById(params.id as string);
        
        if (data.success) {
          setItem(data.data);
        }
      } catch (error: any) {
        setError(error.message || 'Failed to fetch item details');
        console.error('Failed to fetch item:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id && status === 'authenticated') {
      fetchItem();
    }
  }, [params.id, status, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
        <BackgroundGradient />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-800/50 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-800/50 rounded w-3/4"></div>
              <div className="h-4 bg-gray-800/50 rounded w-1/2"></div>
              <div className="h-4 bg-gray-800/50 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
        <BackgroundGradient />
        <div className="container mx-auto px-4 py-8 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 rounded-lg glass-dark border border-gray-800/50 inline-block"
          >
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-semibold mb-2 text-white">Item not found</h3>
            <p className="text-gray-400 mb-4">
              {error || "We couldn't find the item you're looking for."}
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go Back
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
      <BackgroundGradient />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Image Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 rounded-xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-900">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                  No image available
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                {item.name}
              </h1>
              <span className="inline-block px-3 py-1 text-sm text-purple-400 bg-purple-500/10 rounded-full">
                {item.category.name}
              </span>
            </div>

            <p className="text-gray-300 text-lg">
              {item.description || 'No description available.'}
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-gray-300">
                <MapPinIcon className="h-5 w-5 text-purple-500 mr-2" />
                {item.location || 'Location not specified'}
              </div>

              <div className="flex items-center text-gray-300">
                <UserCircleIcon className="h-5 w-5 text-purple-500 mr-2" />
                Listed by {item.owner.name || 'Anonymous'}
              </div>

              <div className="flex items-center text-gray-300">
                <CalendarIcon className="h-5 w-5 text-purple-500 mr-2" />
                {item.available ? 'Available for rent' : 'Currently unavailable'}
              </div>
            </div>

            <div className="mt-8">
              <div className="text-3xl font-bold text-white mb-6">
                ${item.pricePerDay.toFixed(2)}<span className="text-gray-400 text-lg font-normal"> / day</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full group"
                onClick={() => {
                  // Will implement rental functionality later
                  console.log('Rent button clicked');
                }}
                disabled={!item.available}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative w-full py-4 bg-[#1a1a1a] text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center space-x-2">
                  {item.available ? (
                    <>
                      <span>Rent Now</span>
                      <svg 
                        className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  ) : (
                    <span>Currently Unavailable</span>
                  )}
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}