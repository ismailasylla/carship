export interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  currency: string;
  price: number;
  shippingStatus: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  vin: string;
  __v: number;
}

export interface FetchCarsParams {
  page?: number;
  limit?: number;
  make?: string;
  model?: string;
  year?: number;
  currency?: string;
  minPrice?: number;
  maxPrice?: number;
  shippingStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FetchCarsResponse {
  cars: Car[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
