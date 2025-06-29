"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createRental } from '../../utils/rentalsApi';
import { api } from '../../utils/api';

export default function NewRentalPage() {
  const [itemId, setItemId] = useState('');
  const [item, setItem] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [itemError, setItemError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const itemIdFromQuery = searchParams.get('itemId');
    if (itemIdFromQuery) {
      setItemId(itemIdFromQuery);
      // Fetch item details
      api.items.getById(itemIdFromQuery)
        .then(res => {
          if (res.success) setItem(res.data);
          else setItemError('Item not found');
        })
        .catch(() => setItemError('Failed to fetch item details'));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Ensure itemId is sent as a number
      await createRental({ itemId: Number(itemId), startDate, endDate });
      router.push('/rentals');
    } catch (err: any) {
      // Show more detailed error if available
      setError(err?.message || 'Failed to create rental.');
      console.error('Rental creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#18122B] via-[#393053] to-[#18122B] relative overflow-hidden">
      {/* Glassy blurred blobs for background */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl animate-blob -z-10"></div>
      <div className="absolute bottom-1/3 -right-20 w-72 h-72 bg-pink-500/20 rounded-full filter blur-3xl animate-blob animation-delay-2000 -z-10"></div>
      <div className="absolute top-2/3 left-1/3 w-60 h-60 bg-blue-500/20 rounded-full filter blur-3xl animate-blob animation-delay-4000 -z-10"></div>
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[#232946]/80 to-[#18122B]/80 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-purple-900/40 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">Rent an Item</h1>
        {itemId && item ? (
          <div className="mb-8 bg-[#18122B]/80 rounded-xl p-5 shadow border border-purple-800/40 flex flex-col items-center">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-32 h-32 object-cover rounded-lg mb-3 border border-purple-900/40" />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-800 text-gray-500 rounded-lg mb-3">No image</div>
            )}
            <div className="text-xl font-bold text-purple-200 mb-1">{item.name}</div>
            <div className="text-purple-400 mb-1">{item.category?.name}</div>
            <div className="text-gray-300 mb-1">{item.description || 'No description.'}</div>
            <div className="text-lg font-semibold text-white mt-2">${item.pricePerDay?.toFixed(2)} <span className="text-purple-300 text-base font-normal">/ day</span></div>
          </div>
        ) : itemId && itemError ? (
          <div className="mb-8 text-red-400 text-center font-semibold">{itemError}</div>
        ) : (
          <div className="mb-8 text-purple-200 text-center font-semibold">No item selected. Please select an item to rent.</div>
        )}
        {/* Rental form fields */}
        <div className="mb-6">
          <label className="block mb-2 text-purple-200 font-semibold">Start Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full px-4 py-3 bg-[#232946] text-white border border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-purple-200 font-semibold">End Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full px-4 py-3 bg-[#232946] text-white border border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
        </div>
        {error && <div className="text-red-400 mb-4 text-center font-semibold">{error}</div>}
        <button type="submit" disabled={loading || !itemId || !item} className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white rounded-lg font-bold shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Renting...' : 'Rent Now'}
        </button>
      </form>
    </div>
  );
}
