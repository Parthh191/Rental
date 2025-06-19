'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import ParticlesBackground from './components/Particles';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Button animations
const buttonHoverAnimation = {
  scale: 1.05,
  boxShadow: "0 10px 20px rgba(147, 51, 234, 0.3)",
  transition: { duration: 0.3, ease: "easeOut" }
};

const buttonTapAnimation = {
  scale: 0.95,
  transition: { duration: 0.1 }
};

// Card animations
const cardHoverAnimation = {
  y: -8,
  scale: 1.02,
  boxShadow: "0 20px 30px rgba(147, 51, 234, 0.2)",
  transition: { duration: 0.3, ease: "easeOut" }
};

const cardTapAnimation = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);
  const router = useRouter();

  // Sections data
  const categories = [
    { title: "Electronics", icon: "💻", desc: "Cameras, Laptops, Phones" },
    { title: "Vehicles", icon: "🚗", desc: "Cars, Bikes, Boats" },
    { title: "Tools", icon: "🔧", desc: "Power Tools, Equipment" },
    { title: "Spaces", icon: "🏠", desc: "Venues, Studios, Storage" },
    { title: "Sports", icon: "⚽", desc: "Gear, Equipment, Accessories" },
    { title: "Fashion", icon: "👗", desc: "Designer Wear, Accessories" },
  ];

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
            >
              List Your Item
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
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
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Popular Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                className="group relative overflow-hidden p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all cursor-pointer"
                whileHover={cardHoverAnimation}
                whileTap={cardTapAnimation}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                <p className="text-gray-400">{category.desc}</p>
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
