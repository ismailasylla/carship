import mongoose, { Schema, Model } from 'mongoose';
import { ICar } from '../interfaces/car';
import { ShippingStatus } from '../interfaces/enums/shippingStatus.enum';

const carSchema = new Schema<ICar>({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  vin: { type: String, required: true, unique: true },
  currency: { type: String, required: true, default: 'AED' },
  shippingStatus: { 
    type: String, 
    enum: Object.values(ShippingStatus),  // Use the enum values here
    default: ShippingStatus.Pending 
  }
}, { timestamps: true });

const Car: Model<ICar> = mongoose.model<ICar>('Car', carSchema);

export default Car;

