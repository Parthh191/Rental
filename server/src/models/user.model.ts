export interface CreateUserInput {
  email: string;
  name?: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  rentals?: Array<{
    id: number;
    itemId: number;
    startDate: Date;
    endDate: Date;
    status: string;
  }>;
  reviews?: Array<{
    id: number;
    itemId: number;
    rating: number;
    comment: string | null;
  }>;
}