export interface CreateItemInput {
  name: string;
  description?: string;
  pricePerDay: number;
  available?: boolean;
  userId: number;
  categoryId: number;
  imageUrl?: string;
  location: string;
}

export interface createCategoryInput {
  name: string;
}
export interface CreateCategoryResponse {
  id: number;
  name: string;
}
export interface UpdateItemInput {
  name?: string;
  description?: string;
  pricePerDay?: number;
  available?: boolean;
}

export interface ItemResponse {
  id: number;
  name: string;
  description: string | null;
  pricePerDay: number;
  available: boolean;
  rentals?: Array<{
    id: number;
    userId: number;
    startDate: Date;
    endDate: Date;
    status: string;
  }>;
  reviews?: Array<{
    id: number;
    userId: number;
    rating: number;
    comment: string | null;
  }>;
}