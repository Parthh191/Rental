'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HomeIcon,
  InformationCircleIcon,
  NewspaperIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  ComputerDesktopIcon,
  TruckIcon,
  MusicalNoteIcon,
  TrophyIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  ArchiveBoxIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const socialIcons = [
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      )
    },
    {
      name: 'X',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
        </svg>
      )
    }
  ];

  const quickLinks = [
    { name: 'Home', icon: <HomeIcon className="w-4 h-4" /> },
    { name: 'About Us', icon: <InformationCircleIcon className="w-4 h-4" /> },
    { name: 'Blog', icon: <NewspaperIcon className="w-4 h-4" /> },
    { name: 'Careers', icon: <BriefcaseIcon className="w-4 h-4" /> },
    { name: 'Contact Us', icon: <ChatBubbleLeftRightIcon className="w-4 h-4" /> }
  ];

  const rentalServices = [
    { name: 'Equipment & Tools', icon: <WrenchScrewdriverIcon className="w-4 h-4" /> },
    { name: 'Electronics', icon: <ComputerDesktopIcon className="w-4 h-4" /> },
    { name: 'Vehicles', icon: <TruckIcon className="w-4 h-4" /> },
    { name: 'Event Equipment', icon: <MusicalNoteIcon className="w-4 h-4" /> },
    { name: 'Sports Gear', icon: <TrophyIcon className="w-4 h-4" /> }
  ];

  const propertyServices = [
    { name: 'Residential Spaces', icon: <HomeIcon className="w-4 h-4" /> },
    { name: 'Commercial Spaces', icon: <BuildingOfficeIcon className="w-4 h-4" /> },
    { name: 'Event Venues', icon: <BuildingStorefrontIcon className="w-4 h-4" /> },
    { name: 'Storage Units', icon: <ArchiveBoxIcon className="w-4 h-4" /> },
    { name: 'Co-working Spaces', icon: <TableCellsIcon className="w-4 h-4" /> }
  ];

  return (
    <footer className="bg-black text-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* About Section - 3 columns */}
          <div className="md:col-span-3">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.span 
                    className="text-white font-bold text-2xl relative z-10"
                    whileHover={{ scale: 1.1 }}
                  >
                    R
                  </motion.span>
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">RentEasy</h3>
                  <p className="text-sm text-gray-400">Your Premier Rental Platform</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your premier destination for hassle-free rentals. We connect people with quality items and spaces, 
                making sharing resources easier and more sustainable.
              </p>
            </div>
          </div>

          {/* Quick Links - 2 columns */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <motion.li key={link.name} whileHover={{ x: 2 }}>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="text-purple-500 group-hover:text-purple-400 transition-colors">
                      {link.icon}
                    </span>
                    <span>{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Rental Services - 2 columns */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-white mb-4">Rental Services</h4>
            <ul className="space-y-2">
              {rentalServices.map((service) => (
                <motion.li key={service.name} whileHover={{ x: 2 }}>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="text-purple-500 group-hover:text-purple-400 transition-colors">
                      {service.icon}
                    </span>
                    <span>{service.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Property Services - 2 columns */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-white mb-4">Property Services</h4>
            <ul className="space-y-2">
              {propertyServices.map((service) => (
                <motion.li key={service.name} whileHover={{ x: 2 }}>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="text-purple-500 group-hover:text-purple-400 transition-colors">
                      {service.icon}
                    </span>
                    <span>{service.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact & Social - 3 columns */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                {socialIcons.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-purple-600/20 transition-all duration-300 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-gray-400 group-hover:text-white transition-colors duration-300">
                      {social.icon}
                    </span>
                  </motion.a>
                ))}
              </div>
              <div className="space-y-3">
                <motion.a
                  href="mailto:contact@renteasy.com"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200 group"
                  whileHover={{ x: 2 }}
                >
                  <EnvelopeIcon className="h-5 w-5 text-purple-500 group-hover:text-purple-400" />
                  <span>contact@renteasy.com</span>
                </motion.a>
                <motion.a
                  href="tel:+1234567890"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200 group"
                  whileHover={{ x: 2 }}
                >
                  <PhoneIcon className="h-5 w-5 text-purple-500 group-hover:text-purple-400" />
                  <span>+1 (234) 567-890</span>
                </motion.a>
                <motion.a
                  href="#"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200 group"
                  whileHover={{ x: 2 }}
                >
                  <MapPinIcon className="h-5 w-5 text-purple-500 group-hover:text-purple-400" />
                  <span>Find Our Offices</span>
                </motion.a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <span className="text-sm text-gray-500">
                © {new Date().getFullYear()} RentEasy. All rights reserved.
              </span>
              <span className="hidden md:inline text-gray-600">•</span>
              <span className="text-sm text-gray-500">
                Made with ♥ for better renting
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {['Terms', 'Privacy', 'Cookies', 'Accessibility'].map((text) => (
                <motion.a
                  key={text}
                  href="#"
                  className="text-sm text-gray-500 hover:text-purple-400 transition-colors duration-200"
                  whileHover={{ y: -1 }}
                >
                  {text}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;