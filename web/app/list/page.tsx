'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, CameraIcon, TagIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { api } from '../utils/api';

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

export default function ListItemPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerDay: '',
    category: '',
    location: '',
    image: null as File | null,
  });

  useEffect(() => {
    fetchUserItems();
  }, []);

  const fetchUserItems = async () => {
    try {
      const response = await api.items.getByOwner();
      if (response.success) {
        setItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]); // Set empty array on error
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First, upload the image if one is selected
      let imageUrl;
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
        available: true
      };

      const response = await api.items.create(itemData);
      if (response.success) {
        setIsFormOpen(false);
        setFormData({
          name: '',
          description: '',
          pricePerDay: '',
          category: '',
          location: '',
          image: null,
        });
        fetchUserItems(); // Refresh the items list
      }
    } catch (error) {
      console.error('Error creating item:', error);
      // TODO: Add error handling UI
    }
  };

  const handleEdit = (itemId: number) => {
    router.push(`/items/${itemId}`);
  };

  return (
    <main className="min-h-screen pt-16 relative overflow-hidden bg-[#0a0a0a]">
      {/* Enhanced background gradient effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black opacity-90"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
            List Your Items
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Share your items with the community and start earning today
          </p>

          {/* Enhanced Add Item Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium shadow-lg group overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <PlusIcon className="h-5 w-5 mr-2 relative z-10" />
            <span className="relative z-10">List New Item</span>
          </motion.button>
        </motion.div>

        {/* Enhanced Modal Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsFormOpen(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#1a1a1a] rounded-xl p-8 max-w-2xl w-full border border-gray-800 shadow-2xl relative"
              >
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                
                <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  List a New Item
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#2a2a2a] text-white rounded-lg border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder="Enter item name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                          value={formData.pricePerDay}
                          onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                          className="w-full bg-[#2a2a2a] text-white rounded-lg border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                          placeholder="0.00"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 mb-2 font-medium">Category</label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-[#2a2a2a] text-white rounded-lg border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                          placeholder="e.g., Electronics"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-[#2a2a2a] text-white rounded-lg border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        placeholder="Enter location"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">Image</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full bg-[#2a2a2a] text-white rounded-lg border border-gray-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end mt-8">
                    <motion.button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
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
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      List Item
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Items Grid Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Your Listed Items
          </h2>
          
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16 bg-[#1a1a1a]/50 rounded-xl border border-gray-800"
            >
              <div className="text-gray-400 text-lg mb-6">
                You haven't listed any items yet.
              </div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium shadow-lg"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                <span>List Your First Item</span>
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 group hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="relative h-48 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <CameraIcon className="h-12 w-12 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 bg-purple-500/90 text-white text-sm rounded-full shadow-lg">
                        ${item.pricePerDay}/day
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <TagIcon className="h-4 w-4" />
                      <span className="bg-gray-800 px-2 py-1 rounded-full">
                        {item.category.name}
                      </span>
                    </div>
                    {item.location && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        item.available 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.available ? 'Available' : 'Not Available'}
                      </span>
                      <motion.button 
                        onClick={() => handleEdit(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-purple-400 hover:text-purple-300 font-medium"
                      >
                        Edit
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}