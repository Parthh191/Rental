'use client';

import { motion } from 'framer-motion';
import { PencilIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Address {
  street?: string;
  houseNumber?: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface FormData {
  name: string;
  phoneCountry: string;
  phoneNumber: string;
  address: Address;
  bio: string;
}

interface ProfileSettingsProps {
  initialData: FormData;
  onSubmit: (data: FormData) => Promise<void>;
}

const countryPhoneCodes = [
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
];

export default function ProfileSettings({ initialData, onSubmit }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setIsEditing(false);
  };

  return (
    <motion.div 
      className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 via-purple-900/10 to-gray-900/50 backdrop-blur-md border border-purple-500/20 shadow-lg hover:shadow-purple-500/10 transition-all duration-500"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
            Profile Information
          </h3>
          <p className="text-gray-400 text-sm">Update your personal information and how others see you</p>
        </div>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/20"
          >
            <PencilIcon className="h-5 w-5" />
            Edit Profile
          </motion.button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-purple-400 mb-4">
            <UserCircleIcon className="h-5 w-5" />
            <h4 className="text-lg font-semibold text-gradient bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Basic Information
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name field */}
            <motion.div
              className="space-y-2"
              initial={isEditing ? { opacity: 0, x: -20 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>
            </motion.div>
            
            {/* Phone fields */}
            <div className="flex gap-4">
              <div className="w-2/5">
                <label className="block text-sm font-medium text-gray-300 mb-2">Country Code</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                  <select
                    name="phoneCountry"
                    value={formData.phoneCountry}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 appearance-none"
                  >
                    <option value="">Select Country</option>
                    {countryPhoneCodes.map((country) => (
                      <option key={country.name} value={country.code}>
                        {country.flag} {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="w-3/5">
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-6">
          <label className="block text-sm font-medium text-gray-300">Bio</label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell others about yourself..."
              className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 h-32 resize-none"
              disabled={!isEditing}
              maxLength={500}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {formData.bio?.length || 0}/500
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gradient bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Address Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Street */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Street</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!isEditing}
                placeholder="Enter street name"
              />
            </div>

            {/* House Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">House/Flat Number</label>
              <input
                type="text"
                name="address.houseNumber"
                value={formData.address.houseNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!isEditing}
                placeholder="Enter house/flat number"
              />
            </div>

            {/* Other address fields... */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!isEditing}
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">State</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!isEditing}
                placeholder="Enter state"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Country</label>
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!isEditing}
                placeholder="Enter country"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Postal Code</label>
              <input
                type="text"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={!isEditing}
                placeholder="Enter postal code"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <motion.div 
            className="flex justify-end gap-4 pt-6 border-t border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(107, 114, 128, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsEditing(false);
                setFormData(initialData);
              }}
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-500/20"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/20 flex items-center gap-2"
            >
              Save Changes
            </motion.button>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}