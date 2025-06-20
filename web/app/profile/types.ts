export interface User {
  id: number;
  name: string | null;  // Changed from string to string | null
  email: string;
  password?: string;
  phoneCountry?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    houseNumber?: string;
    landmark?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  bio: string | null;  // Changed from string | undefined to string | null
  image?: string;
  stats?: {
    itemsListed: number;
    totalRentals: number;
    totalReviews: number;
    averageRating: string;  // Changed from number to string
  };
  rentals?: Rental[];
  reviews?: Review[];
  items?: Item[];
}

export interface Rental {
  id: number;
  startDate: Date;
  endDate: Date;
  status: string;
  item: {
    id: number;
    name: string;
    imageUrl: string | null;
  }
}

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  item: {
    name: string;
  }
}

export interface Item {
  id: number;
  name: string;
  pricePerDay: number;
  imageUrl: string | null;
  available: boolean;
  category: {
    name: string;
  };
  location: string | null;
}