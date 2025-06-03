'use client';

import { getSession } from 'next-auth/react';

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Helper function for making authenticated API requests
 */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  const token = session?.user?.token;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Something went wrong');
  }
  
  return data;
}

/**
 * Common API methods for your application
 */
export const api = {
  // User related endpoints
  users: {
    getCurrent: () => fetchWithAuth('/users/me'),
    update: (userData: any) => fetchWithAuth('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(userData)
    }),
  },
  
  // Item related endpoints
  items: {
    getAll: (params?: URLSearchParams) => {
      const queryString = params ? `?${params.toString()}` : '';
      return fetchWithAuth(`/items${queryString}`);
    },
    getById: (id: string | number) => fetchWithAuth(`/items/${id}`),
    create: (itemData: any) => fetchWithAuth('/items', {
      method: 'POST',
      body: JSON.stringify(itemData)
    }),
    update: (id: string | number, itemData: any) => fetchWithAuth(`/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(itemData)
    }),
    delete: (id: string | number) => fetchWithAuth(`/items/${id}`, {
      method: 'DELETE'
    }),
  },
  
  // Rental related endpoints
  rentals: {
    getAll: () => fetchWithAuth('/rentals'),
    getById: (id: string | number) => fetchWithAuth(`/rentals/${id}`),
    create: (rentalData: any) => fetchWithAuth('/rentals', {
      method: 'POST',
      body: JSON.stringify(rentalData)
    }),
    update: (id: string | number, rentalData: any) => fetchWithAuth(`/rentals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(rentalData)
    }),
    cancel: (id: string | number) => fetchWithAuth(`/rentals/${id}/cancel`, {
      method: 'POST'
    }),
  },
  
  // Add other API endpoint groups as needed
};