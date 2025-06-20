'use client';

import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

interface Activity {
  type: 'rental' | 'review';
  item: string;
  date: string;
  status?: string;
  rating?: number;
  comment?: string | null;
  id: number;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="p-4 rounded-lg bg-gray-900/50 backdrop-blur-md border border-purple-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01, borderColor: 'rgba(168, 85, 247, 0.3)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block px-2 py-1 text-xs rounded bg-gray-800 text-gray-300 mb-2">
                  {activity.type}
                </span>
                <h3 className="text-white font-medium">{activity.item}</h3>
                <p className="text-gray-400 text-sm">{activity.date}</p>
              </div>
              <div>
                {activity.status && (
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    activity.status === 'active' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {activity.status}
                  </span>
                )}
                {activity.rating && (
                  <div className="flex items-center">
                    {[...Array(activity.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                )}
                {activity.comment && (
                  <p className="text-sm text-gray-400 mt-2 italic">"{activity.comment}"</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}