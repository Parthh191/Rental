import { motion } from 'framer-motion';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface ProfileFormData {
  name: string;
  phoneCountry: string;
  phoneNumber: string;
  address: {
    street: string;
    houseNumber: string;
    landmark: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  bio: string;
}

interface ProfileInformationProps {
  isEditing: boolean;
  formData: ProfileFormData;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const countryPhoneCodes = [
  { id: 'us', name: 'United States', code: '+1', flag: '🇺🇸' },
  { id: 'uk', name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { id: 'in', name: 'India', code: '+91', flag: '🇮🇳' },
  { id: 'ca', name: 'Canada', code: '+1-CA', flag: '🇨🇦' },
  { id: 'au', name: 'Australia', code: '+61', flag: '🇦🇺' },
  { id: 'de', name: 'Germany', code: '+49', flag: '🇩🇪' },
  { id: 'fr', name: 'France', code: '+33', flag: '🇫🇷' },
  { id: 'jp', name: 'Japan', code: '+81', flag: '🇯🇵' },
  { id: 'sg', name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { id: 'ae', name: 'UAE', code: '+971', flag: '🇦🇪' }
];

export default function ProfileInformation({
  isEditing,
  formData,
  onEdit,
  onCancel,
  onSubmit,
  onChange
}: ProfileInformationProps) {
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
            onClick={onEdit}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Profile
          </motion.button>
        )}
      </div>
      
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-purple-400 mb-4">
            <UserCircleIcon className="h-5 w-5" />
            <h4 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Basic Information
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
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
                  onChange={onChange}
                  className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="space-y-2"
              initial={isEditing ? { opacity: 0, x: 20 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-300">Phone</label>
              <div className="flex gap-4">
                <div className="w-2/5">
                  <select
                    name="phoneCountry"
                    value={formData.phoneCountry}
                    onChange={onChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  >
                    <option value="">Select</option>
                    {countryPhoneCodes.map((country) => (
                      <option key={country.id} value={country.code}>
                        {country.flag} {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-3/5">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={onChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    disabled={!isEditing}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-purple-400 mb-4">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h4 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">About You</h4>
          </div>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={onChange}
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
          <div className="flex items-center gap-2 text-purple-400 mb-4">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h4 className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Address</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Street */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Street</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={onChange}
                  className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  disabled={!isEditing}
                  placeholder="Enter street name"
                />
              </div>
            </div>

            {/* House Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">House/Flat Number</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                <input
                  type="text"
                  name="address.houseNumber"
                  value={formData.address.houseNumber}
                  onChange={onChange}
                  className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  disabled={!isEditing}
                  placeholder="Enter house/flat number"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">City</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={onChange}
                  className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  disabled={!isEditing}
                  placeholder="Enter city"
                />
              </div>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">State</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={onChange}
                  className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  disabled={!isEditing}
                  placeholder="Enter state"
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Country</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={onChange}
                  className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  disabled={!isEditing}
                  placeholder="Enter country"
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Postal Code</label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
                <input
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={onChange}
                  className="relative w-full px-4 py-3 rounded-lg bg-gray-800/90 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  disabled={!isEditing}
                  placeholder="Enter postal code"
                />
              </div>
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
              onClick={onCancel}
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
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </motion.button>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}