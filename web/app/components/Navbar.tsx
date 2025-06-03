'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  UserCircleIcon, 
  ShoppingBagIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  QuestionMarkCircleIcon,
  Square3Stack3DIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

const Logo = () => {
  const { scrollY } = useScroll();
  const scrolled = useTransform(scrollY, [0, 50], [0, 1]);

  return (
    <Link href="/" className="group">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 relative group-hover:scale-110 transition-transform duration-300">
          {/* Animated gradient background */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 
            rounded-xl transform rotate-6 group-hover:rotate-12 transition-all duration-500 animate-pulse"
          ></div>
          
          {/* Main logo container */}
          <div 
            className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-lg flex items-center 
            justify-center overflow-hidden"
          >
            {/* "R" letter with gradient */}
            <motion.span 
              className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
              bg-clip-text text-transparent group-hover:scale-125 transition-transform duration-300"
              animate={{ 
                textShadow: [
                  "0 0 8px rgba(255,255,255,0.5)",
                  "0 0 16px rgba(255,255,255,0.8)",
                  "0 0 8px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              R
            </motion.span>
            
            {/* Hover overlay effect */}
            <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40 opacity-0 group-hover:opacity-30 
            transition-opacity duration-300"></div>
          </div>
          
          {/* Animated dot */}
          <motion.div 
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 group-hover:bg-pink-500 
            transition-colors duration-300"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
        </div>

        {/* Text content */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold relative overflow-hidden">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Rent
            </span>
            <motion.span 
              style={{
                color: useTransform(
                  scrolled,
                  [0, 1],
                  ['rgb(255, 255, 255)', 'rgb(229, 231, 235)']
                )
              }}
            >
              Easy
            </motion.span>
            {/* Underline animation */}
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 
            to-pink-600 group-hover:w-full transition-all duration-300 ease-out"></div>
          </h1>
          <motion.span 
            style={{
              color: useTransform(
                scrolled,
                [0, 1],
                ['rgb(209, 213, 219)', 'rgb(156, 163, 175)']
              )
            }}
            className="text-xs"
          >
            Find. Book. Relax.
          </motion.span>
        </div>
      </div>
    </Link>
  );
};

const ListNowButton = ({ isMobile = false }: { isMobile?: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`${isMobile ? 'w-full' : ''}`}
  >
    <Link
      href="/list"
      className={`
        group flex items-center justify-center space-x-2 
        ${isMobile ? 'w-full' : 'px-4'} py-2 rounded-full
        bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 
        hover:from-purple-500 hover:via-blue-500 hover:to-purple-500
        text-white font-medium transition-all duration-300
        shadow-[0_0_15px_rgba(147,51,234,0.3)]
        hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]
      `}
    >
      <PlusCircleIcon className="h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300" />
      <span>List Now</span>
    </Link>
  </motion.div>
);

const NavBar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(0, 0, 0, 0)', 'rgba(3, 3, 3, 0.9)']
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add debug logging to check user state
  useEffect(() => {
    console.log('Current user state:', user);
  }, [user]);

  const navItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Rentals', href: '/rentals', icon: ShoppingBagIcon },
    { name: 'Categories', href: '/categories', icon: Square3Stack3DIcon },
    { name: 'How it Works', href: '/how-it-works', icon: QuestionMarkCircleIcon },
    ...(user === null
      ? [{ name: 'Login / Signup', href: '/login', icon: UserCircleIcon }]
      : [{ name: 'Profile', href: '/profile', icon: UserCircleIcon }]
    ),
  ];

  return (
    <motion.nav
      style={{ backgroundColor }}
      className="fixed w-full z-50 transition-all duration-300 backdrop-blur-sm border-b border-gray-800/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Search Bar */}
            <motion.div
              animate={{ width: isSearchOpen ? 'auto' : '2rem' }}
              className="relative"
            >
              <motion.input
                initial={false}
                animate={{ width: isSearchOpen ? '250px' : '0px', padding: isSearchOpen ? '0.5rem' : '0' }}
                transition={{ duration: 0.3 }}
                type="text"
                placeholder="Search rentals..."
                className={`rounded-full bg-gray-800/50 border border-gray-700/50 pl-8 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                  isSearchOpen ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <MagnifyingGlassIcon
                className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors duration-200"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
            </motion.div>

            {/* Nav Items */}
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-300 hover:text-purple-400 transition-colors duration-200"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}

            {/* List Now CTA Button - Desktop */}
            {user && <ListNowButton />}
          </div>

          {/* Mobile menu button */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="md:hidden"
          >
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
          >
            <div className="px-4 pt-2 pb-3 space-y-3">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search rentals..."
                  className="w-full rounded-full bg-gray-100 dark:bg-gray-800 pl-8 py-2"
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>

              {/* List Now CTA Button - Mobile */}
              {user && <ListNowButton isMobile />}

              {/* Mobile Nav Items */}
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;