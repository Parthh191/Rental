export interface CreatePaymentInput {
  rentalId: number;
  amount: number;
  paymentDate: Date;
  method: string;
}

export interface UpdatePaymentInput {
  amount?: number;
  paymentDate?: Date;
  method?: string;
}

export interface PaymentResponse {
  id: number;
  rentalId: number;
  amount: number;
  paymentDate: Date;
  method: string;
  rental?: {
    id: number;
    userId: number;
    itemId: number;
    startDate: Date;
    endDate: Date;
    status: string;
  };
}