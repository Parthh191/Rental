"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../utils/api';
import { useSession } from 'next-auth/react';
import { MapPinIcon, TagIcon, CameraIcon } from '@heroicons/react/24/outline';

interface Item {
  id: number;
  name: string;
  description: string | null;
  pricePerDay: number;
  available: boolean;
  imageUrl: string | null;
  location: string | null;
  category: {
    name: string;
  };
}

// Background gradient component
const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
    <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl animate-blob"></div>
    <div className="absolute bottom-1/3 -right-20 w-72 h-72 bg-pink-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
  </div>
);

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerDay: '',
    category: '',
    location: '',
    available: true,
    image: null as File | null
  });
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

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
          const item = data.data;
          setFormData({
            name: item.name,
            description: item.description || '',
            pricePerDay: item.pricePerDay.toString(),
            category: item.category.name,
            location: item.location || '',
            available: item.available,
            image: null
          });
          setCurrentImageUrl(item.imageUrl);
        }
      } catch (error) {
        console.error('Failed to fetch item:', error);
        router.push('/items');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id && status === 'authenticated') {
      fetchItem();
    }
  }, [params.id, status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = currentImageUrl;
      
      if (formData.image) {
        const formDataWithImage = new FormData();
        formDataWithImage.append('image', formData.image);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataWithImage,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      const itemData = {
        name: formData.name,
        description: formData.description,
        pricePerDay: parseFloat(formData.pricePerDay),
        category: formData.category,
        location: formData.location,
        imageUrl: imageUrl,
        available: formData.available
      };

      const response = await api.items.update(params.id as string, itemData);
      
      if (response.success) {
        router.push(`/items/${params.id}`);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
        <BackgroundGradient />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-800 rounded w-1/2"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-800 rounded"></div>
                ))}
              </div>
            </div>
          </div>
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
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Edit Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2a2a] text-white rounded-lg border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Enter item name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2a2a] text-white rounded-lg border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all h-32 resize-none"
                  placeholder="Describe your item..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Price per Day ($)</label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleInputChange}
                    className="w-full bg-[#2a2a2a] text-white rounded-lg border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="0.00"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Category</label>
                  <div className="relative">
                    <TagIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-[#2a2a2a] text-white rounded-lg border border-gray-700 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                      placeholder="e.g., Electronics"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Location</label>
                <div className="relative">
                  <MapPinIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-[#2a2a2a] text-white rounded-lg border border-gray-700 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Enter location"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Image</label>
                <div className="relative">
                  {currentImageUrl && (
                    <div className="mb-4">
                      <img
                        src={currentImageUrl}
                        alt="Current item"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full bg-[#2a2a2a] text-white rounded-lg border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                    className="form-checkbox h-5 w-5 text-purple-500 rounded border-gray-700 bg-[#2a2a2a] focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Available for rent</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                type="button"
                onClick={() => router.back()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Save Changes
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}


