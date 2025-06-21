export interface Address {
  street: string;
  houseNumber: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Stats {
  itemsListed: number;
  totalRentals: number;
  totalReviews: number;
  averageRating: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  item: {
    name: string;
  };
}

export interface Item {
  id: string;
  name: string;
  category: {
    name: string;
  };
  pricePerDay: number;
  imageUrl?: string;
  location?: string;
  available: boolean;
}

export interface Rental {
  id: string;
  startDate: Date;
  status: string;
  item: {
    name: string;
  };
}

export interface User {
  name: string;
  phoneCountry: string;
  phoneNumber: string;
  address: Address;
  bio: string;
  stats?: Stats;
  reviews?: Review[];
  items?: Item[];
  rentals?: Rental[];
}

export interface FormData {
  name: string;
  phoneCountry: string;
  phoneNumber: string;
  address: Address;
  bio: string;
}