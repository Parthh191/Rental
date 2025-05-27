import { RentalStatus as PrismaRentalStatus } from '../../generated/prisma';

export interface CreateRentalInput {
  userId: number;
  itemId: number;
  startDate: Date;
  endDate: Date;
}

export interface UpdateRentalInput {
  startDate?: Date;
  endDate?: Date;
  status?: PrismaRentalStatus;
}

export enum RentalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export interface RentalResponse {
  id: number;
  userId: number;
  itemId: number;
  startDate: Date;
  endDate: Date;
  status: PrismaRentalStatus;
  createdAt: Date;
  updatedAt: Date;
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
  payment?: {
    id: number;
    rentalId: number;
    amount: number;
    paymentDate: Date;
    method: string;
  } | null;
}