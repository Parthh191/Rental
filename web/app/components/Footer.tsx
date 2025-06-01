'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ChevronDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HomeIcon,
  TruckIcon,
  ComputerDesktopIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, children, isOpen, onToggle }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render anything until after mount to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full md:cursor-default"
      >
        <h3 className="text-lg font-semibold text-white tracking-wide">{title}</h3>
        <ChevronDownIcon
          className={`h-5 w-5 transition-transform md:hidden ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.div
            initial={isMobile ? { height: 0, opacity: 0 } : false}
            animate={isMobile ? { height: 'auto', opacity: 1 } : {}}
            exit={isMobile ? { height: 0, opacity: 0 } : {}}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type SectionKey = 'about' | 'rentalServices' | 'propertyServices' | 'support' | 'legal' | 'connect';

const Footer = () => {
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    about: false,
    rentalServices: false,
    propertyServices: false,
    support: false,
    legal: false,
    connect: false,
  });

  const toggleSection = (section: SectionKey) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setOpenSections(prev => ({
        ...prev,
        [section]: !prev[section],
      }));
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const linkHoverVariants = {
    hover: {
      x: 5,
      transition: { duration: 0.2 }
    }
  };

  const socialIcons = [
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
      href: '#',
      name: 'Facebook'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
      ),
      href: '#',
      name: 'Twitter'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
        </svg>
      ),
      href: '#',
      name: 'Instagram'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 00-3.16 19.5c.5.08.66-.23.66-.5v-1.7C6.73 19.91 6.14 18 6.14 18A2.69 2.69 0 005 16.5c-.91-.62.07-.6.07-.6a2.1 2.1 0 011.53 1 2.15 2.15 0 002.91.83c.05-.65.2-1.1.38-1.35-1.34-.15-2.75-.67-2.75-3A2.35 2.35 0 018.14 11a2.17 2.17 0 01.06-1.6s.84-.27 2.75 1a9.48 9.48 0 015 0c1.91-1.29 2.75-1 2.75-1 .37.83.14 1.46.07 1.6a2.35 2.35 0 01.63 1.65c0 2.35-1.42 2.85-2.77 3 .21.2.4.58.4 1.17v2.25c0 .27.16.59.67.5A10 10 0 0012 2z" />
        </svg>
      ),
      href: '#',
      name: 'GitHub'
    }
  ];

  return (
    <footer className="bg-gradient-to-b from-[#0d0d0d] to-[#111] text-gray-200 relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-blue-900/5 to-transparent pointer-events-none" />
      
      {/* Animated particles or dots background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff12_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Main Footer Content */}
        <div className="px-6 py-16 border-t border-gray-800/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* About Section */}
            <div className="lg:col-span-2">
              <FooterSection
                title="About RentEasy"
                isOpen={openSections.about}
                onToggle={() => toggleSection('about')}
              >
                <motion.div
                  variants={fadeInUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <span className="text-white font-bold text-xl">R</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      RentEasy
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Your premier destination for hassle-free rentals. We connect people with quality items and spaces, making sharing resources easier and more sustainable.
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className="text-purple-400">★</span>
                    <span className="text-purple-400">★</span>
                    <span className="text-purple-400">★</span>
                    <span className="text-purple-400">★</span>
                    <span className="text-purple-400">★</span>
                    <span className="text-sm text-gray-400 ml-2">Trusted by 10,000+ users</span>
                  </div>
                </motion.div>
              </FooterSection>
            </div>

            {/* Rental Services */}
            <div>
              <FooterSection
                title="Rental Services"
                isOpen={openSections.rentalServices}
                onToggle={() => toggleSection('rentalServices')}
              >
                <ul className="space-y-3">
                  {[
                    { text: 'Equipment & Tools', icon: <TruckIcon className="w-4 h-4" /> },
                    { text: 'Electronics & Gadgets', icon: <ComputerDesktopIcon className="w-4 h-4" /> },
                    { text: 'Vehicles & Transport', icon: <TruckIcon className="w-4 h-4" /> },
                    { text: 'Event Equipment', icon: <HomeIcon className="w-4 h-4" /> },
                    { text: 'Sports & Recreation', icon: <UserGroupIcon className="w-4 h-4" /> },
                    { text: 'Photography Gear', icon: <ComputerDesktopIcon className="w-4 h-4" /> }
                  ].map((item) => (
                    <motion.li key={item.text} whileHover="hover" variants={linkHoverVariants}>
                      <Link 
                        href="#"
                        className="text-gray-400 hover:text-white transition-all duration-200 flex items-center space-x-2 group"
                      >
                        <span className="text-purple-500 group-hover:text-purple-400 transition-colors">
                          {item.icon}
                        </span>
                        <span>{item.text}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </FooterSection>
            </div>

            {/* Property Services */}
            <div>
              <FooterSection
                title="Property Services"
                isOpen={openSections.propertyServices}
                onToggle={() => toggleSection('propertyServices')}
              >
                <ul className="space-y-3">
                  {[
                    { text: 'Residential Spaces', icon: <HomeIcon className="w-4 h-4" /> },
                    { text: 'Commercial Spaces', icon: <BuildingOfficeIcon className="w-4 h-4" /> },
                    { text: 'Event Venues', icon: <UserGroupIcon className="w-4 h-4" /> },
                    { text: 'Storage Units', icon: <BuildingOfficeIcon className="w-4 h-4" /> },
                    { text: 'Parking Spaces', icon: <TruckIcon className="w-4 h-4" /> },
                    { text: 'Co-working Spaces', icon: <UserGroupIcon className="w-4 h-4" /> }
                  ].map((item) => (
                    <motion.li key={item.text} whileHover="hover" variants={linkHoverVariants}>
                      <Link 
                        href="#"
                        className="text-gray-400 hover:text-white transition-all duration-200 flex items-center space-x-2 group"
                      >
                        <span className="text-purple-500 group-hover:text-purple-400 transition-colors">
                          {item.icon}
                        </span>
                        <span>{item.text}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </FooterSection>
            </div>

            {/* Support Section */}
            <div>
              <FooterSection
                title="Support"
                isOpen={openSections.support}
                onToggle={() => toggleSection('support')}
              >
                <ul className="space-y-3">
                  {[
                    { text: 'Help Center', icon: <ChatBubbleLeftRightIcon className="w-4 h-4" /> },
                    { text: 'Safety Center', icon: <ShieldCheckIcon className="w-4 h-4" /> },
                    { text: 'Insurance Options', icon: <ShieldCheckIcon className="w-4 h-4" /> },
                    { text: 'Report an Issue', icon: <ChatBubbleLeftRightIcon className="w-4 h-4" /> },
                    { text: 'Rental Guide', icon: <HomeIcon className="w-4 h-4" /> },
                    { text: 'FAQ', icon: <ChatBubbleLeftRightIcon className="w-4 h-4" /> }
                  ].map((item) => (
                    <motion.li key={item.text} whileHover="hover" variants={linkHoverVariants}>
                      <Link 
                        href="#"
                        className="text-gray-400 hover:text-white transition-all duration-200 flex items-center space-x-2 group"
                      >
                        <span className="text-purple-500 group-hover:text-purple-400 transition-colors">
                          {item.icon}
                        </span>
                        <span>{item.text}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </FooterSection>
            </div>

            {/* Connect Section */}
            <div>
              <FooterSection
                title="Connect With Us"
                isOpen={openSections.connect}
                onToggle={() => toggleSection('connect')}
              >
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {socialIcons.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center hover:from-purple-600 hover:to-blue-600 transition-all duration-300 group"
                      >
                        <span className="text-gray-400 group-hover:text-white transition-colors duration-200">
                          {social.icon}
                        </span>
                      </motion.a>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <motion.a
                      href="mailto:contact@renteasy.com"
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-200 group"
                      whileHover={{ x: 2 }}
                    >
                      <EnvelopeIcon className="h-5 w-5 text-purple-500 group-hover:text-purple-400" />
                      <span>contact@renteasy.com</span>
                    </motion.a>
                    <motion.a
                      href="tel:+1234567890"
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-200 group"
                      whileHover={{ x: 2 }}
                    >
                      <PhoneIcon className="h-5 w-5 text-purple-500 group-hover:text-purple-400" />
                      <span>+1 (234) 567-890</span>
                    </motion.a>
                    <motion.a
                      href="#"
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-200 group"
                      whileHover={{ x: 2 }}
                    >
                      <MapPinIcon className="h-5 w-5 text-purple-500 group-hover:text-purple-400" />
                      <span>Find Our Offices</span>
                    </motion.a>
                  </div>
                </div>
              </FooterSection>
            </div>
          </div>
        </div>

        {/* Bottom Bar with enhanced styling */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10"></div>
          <div className="px-6 py-6 border-t border-gray-800/50 relative">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-gray-400"
                >
                  © {new Date().getFullYear()} RentEasy. All rights reserved.
                </motion.div>
                <div className="text-gray-600">•</div>
                <div className="text-sm text-gray-400">
                  Made with ♥ for better renting
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                {[
                  'Terms of Service',
                  'Privacy Policy',
                  'Cookie Policy',
                  'Accessibility',
                  'Sitemap'
                ].map((text) => (
                  <motion.a
                    key={text}
                    href="#"
                    className="text-gray-400 hover:text-white transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                    whileHover={{ y: -1 }}
                  >
                    {text}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;