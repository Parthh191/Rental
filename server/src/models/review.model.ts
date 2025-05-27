export interface CreateReviewInput {
  userId: number;
  itemId: number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export interface ReviewResponse {
  id: number;
  userId: number;
  itemId: number;
  rating: number;
  comment: string | null;
  user?: {
    id: number;
    name: string | null;
    email: string;
  };
  item?: {
    id: number;
    name: string;
    description: string | null;
    pricePerDay: number;
  };
}