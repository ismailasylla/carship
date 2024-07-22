import { Document } from 'mongoose';
import { ShippingStatus } from '../interfaces/enums/shippingStatus.enum';

export interface ICar extends Document {
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  vin: string;
  shippingStatus: ShippingStatus;
}
