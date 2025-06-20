'use client';

import { motion } from 'framer-motion';
import { PlusCircleIcon, ShoppingBagIcon, StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface StatItem {
  label: string;
  value: string | number;
  icon: any;
}

interface StatsCardsProps {
  stats: StatItem[];
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const cardHoverAnimation = {
  scale: 1.02,
  y: -8,
  boxShadow: "0 20px 30px rgba(147, 51, 234, 0.2)",
  transition: { duration: 0.3 }
};

const cardTapAnimation = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-md border border-purple-500/20 flex items-center gap-4"
          variants={fadeInUp}
          transition={{ delay: index * 0.1 }}
          whileHover={cardHoverAnimation}
          whileTap={cardTapAnimation}
        >
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
            <stat.icon className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}