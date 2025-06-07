export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  token?: string; // JWT token for authenticated sessions
  rentals?: Array<{
    id: number;
    startDate: Date;
    endDate: Date;
    status: string;
    item: {
      id: number;
      name: string; // "name" instead of "title" as per schema
      imageUrl: string | null; // "imageUrl" instead of "image" as per schema
    }
  }>;
  items?: Array<{
    id: number;
    name: string; // "name" instead of "title" as per schema
    pricePerDay: number; // "pricePerDay" instead of "price" as per schema
    imageUrl: string | null; // "imageUrl" instead of "image" as per schema
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
      name: string; // "name" instead of "title" as per schema
    }
  }>;
  stats?: {
    itemsListed: number;
    totalRentals: number;
    totalReviews: number;
    averageRating: string;
  }
}