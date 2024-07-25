import { Document } from 'mongoose';
import { ShippingStatus } from './enums/shippingStatus.enum';

export interface ICar extends Document {
  make: string;
  model: string;
  year: number;
  price: number;
  vin: string;
  currency: string;
  shippingStatus: ShippingStatus;
}

export type Car = Omit<ICar, '_id' | 'createdAt' | 'updatedAt' | '__v'>;
