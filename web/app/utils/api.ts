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
  users: {
    getCurrent: () => fetchWithAuth('/users/get'),
    update: async (data: any) => {
      // Transform nested address into flat structure
      const flatData = {
        ...data,
        addressStreet: data.address?.street,
        addressHouseNumber: data.address?.houseNumber,
        addressLandmark: data.address?.landmark,
        addressCity: data.address?.city,
        addressState: data.address?.state,
        addressCountry: data.address?.country,
        addressPostalCode: data.address?.postalCode
      };
      
      // Remove the nested address object
      delete flatData.address;

      return fetchWithAuth('/users/update', {
        method: 'PUT',
        body: JSON.stringify(flatData),
      });
    },
    checkPassword: (password: string) => fetchWithAuth('/users/checkpassword', {
      method: 'POST',
      body: JSON.stringify({ password })
    }),
    updatePassword: (newPassword: string) => fetchWithAuth('/users/updatepassword', {
      method: 'POST',
      body: JSON.stringify({ newPassword })
    }),
    delete: () => fetchWithAuth('/users/delete', {
      method: 'DELETE'
    })
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

/**
 * TypeScript interfaces for API data structures
 */

export interface User {
  id: number;
  email: string;
  name: string | null;
  phoneCountry: string | null;
  phoneNumber: string | null;
  addressStreet: string | null;
  addressHouseNumber: string | null;
  addressLandmark: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressCountry: string | null;
  addressPostalCode: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
  stats?: {
    itemsListed: number;
    totalRentals: number;
    totalReviews: number;
    averageRating: string;
  };
  rentals?: Array<{
    id: number;
    startDate: Date;
    endDate: Date;
    status: string;
    item: {
      id: number;
      name: string;
      imageUrl: string | null;
    }
  }>;
  items?: Array<{
    id: number;
    name: string;
    pricePerDay: number;
    imageUrl: string | null;
    available: boolean;
    category: {
      name: string;
    };
    location: string | null;
  }>;
  reviews?: Array<{
    id: number;
    rating: number;
    comment: string | null;
    item: {
      name: string;
    }
  }>;
}

/**
 * Update user data structure
 */
interface UpdateUserData {
  name?: string;
  phoneCountry?: string;
  phoneNumber?: string;
  addressStreet?: string;
  addressHouseNumber?: string;
  addressLandmark?: string;
  addressCity?: string;
  addressState?: string;
  addressCountry?: string;
  addressPostalCode?: string;
  bio?: string;
}

// Update the users object methods
const users = {
  getCurrent: () => fetchWithAuth('/users/get'),
  update: async (data: UpdateUserData) => {
    const response = await fetchWithAuth('/api/users', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  },
  checkPassword: (password: string) => fetchWithAuth('/users/checkpassword', {
    method: 'POST',
    body: JSON.stringify({ password })
  }),
  updatePassword: (newPassword: string) => fetchWithAuth('/users/updatepassword', {
    method: 'POST',
    body: JSON.stringify({ newPassword })
  }),
  delete: () => fetchWithAuth('/users/delete', {
    method: 'DELETE'
  })
};