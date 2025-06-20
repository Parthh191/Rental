'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ParticlesBackground from './components/Particles';
import { api } from '../app/utils/api';  // Update import path
import { useAuth } from './context/AuthContext'; // Fixed import path

// Animation types
const buttonHoverAnimation = {
  scale: 1.05,
  boxShadow: "0 10px 20px rgba(147, 51, 234, 0.3)",
  transition: { duration: 0.3, ease: "easeInOut" as const }
};

const buttonTapAnimation = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

const cardHoverAnimation = {
  y: -8,
  scale: 1.02,
  boxShadow: "0 20px 30px rgba(147, 51, 234, 0.2)",
  transition: { duration: 0.3, ease: "easeInOut" as const }
};

const cardTapAnimation = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

interface Category {
  id: number;
  name: string;
}

interface ApiItem {
  category: Category;
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // If still loading or user is not authenticated, don't render the page content
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.items.getAll();
        
        if (response && response.data) {
          // Extract unique categories with proper typing
          const items = response.data as ApiItem[];
          const uniqueCategories = Array.from(
            new Map(items.map(item => [
              item.category.id, 
              item.category
            ])).values()
          ).sort((a, b) => a.name.localeCompare(b.name));
          
          setCategories(uniqueCategories);
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Get emoji for category
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

  // Sections data
  const features = [
    { title: "Verified Users", desc: "Every renter and owner is verified", icon: "🔒" },
    { title: "Secure Payments", desc: "Protected transactions every time", icon: "💳" },
    { title: "Smart Insurance", desc: "Coverage for peace of mind", icon: "🛡️" },
    { title: "24/7 Support", desc: "Help whenever you need it", icon: "🎯" },
  ];

  return (
    <main className="relative min-h-screen">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-purple-600 transform-origin-0 z-50"
        style={{ scaleX }}
      />

      {/* Particles Background */}
      <div className="absolute inset-0 -z-10">
        <ParticlesBackground />
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
        
        <motion.div
          className="container mx-auto text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Rent Anything, Anywhere
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your one-stop marketplace for renting items. From tools to tech, spaces to vehicles.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              whileHover={buttonHoverAnimation}
              whileTap={buttonTapAnimation}
              className="px-8 py-4 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors cursor-pointer"
              onClick={() => router.push('/items')}
            >
              Browse Items
            </motion.button>
            <motion.button
              whileHover={buttonHoverAnimation}
              whileTap={buttonTapAnimation}
              className="px-8 py-4 border border-purple-500 text-purple-400 rounded-full font-medium hover:bg-purple-600/10 transition-colors cursor-pointer"
              onClick={() => router.push('/list')}
            >
              List Your Item
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4" aria-labelledby="categories-heading">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 }
          }}
          className="container mx-auto"
        >
          <h2 id="categories-heading" className="text-4xl font-bold text-center mb-12 text-white">Popular Categories</h2>
          
          {error && (
            <div className="text-center text-red-400 mb-8" role="alert">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                className="group relative overflow-hidden p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all cursor-pointer"
                whileHover={cardHoverAnimation}
                whileTap={cardTapAnimation}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => router.push(`/categories/${encodeURIComponent(category.name.toLowerCase())}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(`/categories/${encodeURIComponent(category.name.toLowerCase())}`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Browse ${category.name} category`}
              >
                <div className="text-3xl mb-4" aria-hidden="true">
                  {getCategoryEmoji(category.name)}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-gray-400">Browse {category.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black/0 via-purple-900/10 to-black/0">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 text-white"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 cursor-pointer rounded-xl border border-transparent hover:border-purple-500/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={cardHoverAnimation}
                whileTap={cardTapAnimation}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className="text-4xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12 text-white"
          >
            What Our Users Say
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                text: "Found exactly what I needed for my event. The process was smooth and the owner was great!",
                author: "Sarah Johnson",
                role: "Event Planner"
              },
              {
                text: "Great way to earn extra income from items I rarely use. The platform makes it super easy.",
                author: "Mike Richards",
                role: "Equipment Owner"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/10 cursor-pointer"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={cardHoverAnimation}
                whileTap={cardTapAnimation}
                viewport={{ once: true }}
              >
                <p className="text-gray-300 mb-4">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center">
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-purple-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm" />
        <div className="container mx-auto relative">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Renting?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users already sharing and renting items on our platform
            </p>
            <motion.button
              whileHover={buttonHoverAnimation}
              whileTap={buttonTapAnimation}
              className="px-8 py-4 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
