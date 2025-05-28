export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  name?: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  token?: string; // JWT token for authenticated sessions
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