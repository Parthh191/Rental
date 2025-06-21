// Rental model interface for creating a rental
export interface CreateRental {
    itemId: number;
    startDate: Date;
    endDate: Date;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
    totalPrice?: number;
    description?: string;
}

