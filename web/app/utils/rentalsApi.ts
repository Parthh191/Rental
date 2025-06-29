// Rental API utility functions
import { api } from './api';

export async function fetchRentals() {
  try {
    const response = await api.rentals.getAll();
    return response;
  } catch (error) {
    console.error('Error in fetchRentals:', error);
    throw error;
  }
}

export async function fetchRentalById(id: string) {
  try {
    const response = await api.rentals.getById(id);
    return response;
  } catch (error) {
    console.error('Error in fetchRentalById:', error);
    throw error;
  }
}

export async function createRental(data: any) {
  try {
    const response = await api.rentals.create(data);
    return response;
  } catch (error) {
    console.error('Error in createRental:', error);
    throw error;
  }
}

export async function fetchRentalsByUser() {
  try {
    const response = await api.rentals.getByUser();
    console.log('API Response in rentalsApi:', response); // Debug log
    
    // Handle the standard server response format
    if (response && response.success && Array.isArray(response.data)) {
      return response.data;
    }
    
    // Fallback: if response is directly an array (shouldn't happen with current server)
    if (Array.isArray(response)) {
      return response;
    }
    
    // If response exists but doesn't match expected format
    if (response && response.data) {
      return response.data;
    }
    
    // Return empty array if no data
    return [];
  } catch (error) {
    console.error('Error in fetchRentalsByUser:', error);
    throw error;
  }
}

export async function cancelRental(id: string) {
  try {
    const response = await api.rentals.cancel(id);
    return response;
  } catch (error) {
    console.error('Error in cancelRental:', error);
    throw error;
  }
}
