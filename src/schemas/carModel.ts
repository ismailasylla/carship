import mongoose, { Schema, Model } from 'mongoose';
import { ICar } from '../interfaces/car';
import { ShippingStatus } from '../interfaces/enums/shippingStatus.enum';

const carSchema = new Schema<ICar>({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true, min: 1900, max: new Date().getFullYear() },
  price: { type: Number, required: true, min: 0 },
  vin: { type: String, required: true, unique: true },
  currency: { type: String, required: true, default: 'AED' },
  shippingStatus: { 
    type: String, 
    enum: Object.values(ShippingStatus),
    default: ShippingStatus.Pending 
  }
}, { timestamps: true });

// indexes for efficient querying
carSchema.index({ make: 1 });
carSchema.index({ model: 1 });
carSchema.index({ year: 1 });
carSchema.index({ price: 1 });
carSchema.index({ shippingStatus: 1 });

const Car: Model<ICar> = mongoose.model<ICar>('Car', carSchema);

export default Car;
