'use client';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = ['overview', 'listings', 'rentals', 'favorites', 'messages', 'settings'];

  return (
    <div className="mb-8 border-b border-gray-800">
      <div className="flex overflow-x-auto scrollbar-hide gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2 whitespace-nowrap capitalize font-medium transition-colors duration-300 cursor-pointer ${
              activeTab === tab
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}