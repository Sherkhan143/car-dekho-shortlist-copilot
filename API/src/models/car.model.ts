import mongoose, { Schema, Model } from "mongoose";

export type BodyType =
  | "Hatchback"
  | "Sedan"
  | "SUV"
  | "MUV"
  | "Coupe"
  | "Pickup";

export type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric" | "Hybrid";

export type Transmission = "Manual" | "Automatic";

export interface ICar {
  make: string;
  model: string;
  variant: string;
  priceInLacs: number;
  bodyType: BodyType;
  fuelType: FuelType;
  transmission: Transmission;
  mileage: number;
  safetyRating: number;
  seats: number;
  maintenanceScore: number;
  featureScore: number;
  performanceScore: number;
  cityUseScore: number;
  highwayUseScore: number;
  familyScore: number;
  imageUrl: string;
}

const scoreField = {
  type: Number,
  required: true,
  min: 0,
  max: 10,
};

const CarSchema = new Schema<ICar>(
  {
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    variant: { type: String, required: true, trim: true },
    priceInLacs: { type: Number, required: true, min: 0 },
    bodyType: {
      type: String,
      required: true,
      enum: ["Hatchback", "Sedan", "SUV", "MUV", "Coupe", "Pickup"],
    },
    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
    },
    transmission: {
      type: String,
      required: true,
      enum: ["Manual", "Automatic"],
    },
    mileage: { type: Number, required: true, min: 0 },
    safetyRating: { type: Number, required: true, min: 0, max: 5 },
    seats: { type: Number, required: true, min: 1 },
    maintenanceScore: scoreField,
    featureScore: scoreField,
    performanceScore: scoreField,
    cityUseScore: scoreField,
    highwayUseScore: scoreField,
    familyScore: scoreField,
    imageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Car: Model<ICar> =
  mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);

export default Car;
