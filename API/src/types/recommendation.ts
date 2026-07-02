import type {
  BodyType,
  FuelType,
  Transmission,
  ICar,
} from "../models/car.model";

export type UseCase = "city" | "family" | "highway" | "suv";

export type Priority =
  | "mileage"
  | "safety"
  | "performance"
  | "features"
  | "low-maintenance";

export interface BudgetRange {
  min?: number;
  max: number;
}

export interface RecommendationInput {
  budgetRange: BudgetRange;
  bodyType?: BodyType;
  useCase?: UseCase;
  fuelType?: FuelType;
  priorities?: Priority[];
  seatingNeed?: number;
  transmissionPreference?: Transmission;
}

export interface ScoreBreakdown {
  useCase: number;
  priorities: number;
  bodyType: number;
  fuelType: number;
  transmission: number;
  budgetFit: number;
}

export interface Recommendation {
  car: ICar & { _id: unknown };
  score: number;
  matchPercentage: number;
  reasons: string[];
  breakdown: ScoreBreakdown;
}
