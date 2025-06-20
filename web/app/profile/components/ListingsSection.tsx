import { motion } from 'framer-motion';
import Image from 'next/image';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

interface ListingItem {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
}

interface ListingsSectionProps {
  items: ListingItem[];
  onAddNew: () => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

const cardHoverAnimation = {
  scale: 1.02,
  boxShadow: "0 0 20px rgba(147, 51, 234, 0.2)"
};

const cardTapAnimation = {
  scale: 0.98
};

export default function ListingsSection({ items, onAddNew, onEdit, onRemove }: ListingsSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Your Listings</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-300"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add New
        </motion.button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-purple-500/10 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={cardHoverAnimation}
            whileTap={cardTapAnimation}
          >
            <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h3 className="text-white font-medium mb-2">{item.name}</h3>
            <p className="text-gray-400 text-sm mb-2">{item.category}</p>
            <p className="text-purple-400 font-semibold mb-4">{item.price}</p>
            <div className="mt-auto flex justify-between">
              <button 
                onClick={() => onEdit(item.id)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Edit
              </button>
              <button 
                onClick={() => onRemove(item.id)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}