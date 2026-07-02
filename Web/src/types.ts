export type BodyType =
  | "Hatchback"
  | "Sedan"
  | "SUV"
  | "MUV"
  | "Coupe"
  | "Pickup";

export type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric" | "Hybrid";

export type Transmission = "Manual" | "Automatic";

export type UseCase = "city" | "family" | "highway" | "suv";

export type Priority =
  | "mileage"
  | "safety"
  | "performance"
  | "features"
  | "low-maintenance";

export interface ICar {
  _id: string;
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
  car: ICar;
  score: number;
  matchPercentage: number;
  reasons: string[];
  breakdown: ScoreBreakdown;
}

export interface RecommendationResponse {
  input: RecommendationInput;
  totalCandidates: number;
  recommendations: Recommendation[];
}
