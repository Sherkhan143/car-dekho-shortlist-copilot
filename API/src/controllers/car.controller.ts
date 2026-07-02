import { Request, Response } from "express";
import Car from "../models/car.model";
import { recommendCars } from "../services/recommendation.engine";
import type {
  Priority,
  RecommendationInput,
  UseCase,
} from "../types/recommendation";

const BODY_TYPES = ["Hatchback", "Sedan", "SUV", "MUV", "Coupe", "Pickup"];
const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const TRANSMISSIONS = ["Manual", "Automatic"];
const USE_CASES: UseCase[] = ["city", "family", "highway", "suv"];
const PRIORITIES: Priority[] = [
  "mileage",
  "safety",
  "performance",
  "features",
  "low-maintenance",
];

export const getCars = async (_req: Request, res: Response) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars", error });
  }
};

/**
 * Validates the recommendation form payload and returns either the parsed
 * input or a list of human-readable errors.
 */
function parseInput(
  body: unknown
): { input: RecommendationInput } | { errors: string[] } {
  const errors: string[] = [];
  const data = (body ?? {}) as Record<string, unknown>;

  const budget = (data.budgetRange ?? {}) as Record<string, unknown>;
  const max = Number(budget.max);
  if (!budget || Number.isNaN(max) || max <= 0) {
    errors.push("budgetRange.max is required and must be a positive number.");
  }
  const min =
    budget.min === undefined || budget.min === null
      ? undefined
      : Number(budget.min);
  if (min !== undefined && (Number.isNaN(min) || min < 0)) {
    errors.push("budgetRange.min must be a non-negative number.");
  }

  if (data.bodyType !== undefined && !BODY_TYPES.includes(String(data.bodyType))) {
    errors.push(`bodyType must be one of: ${BODY_TYPES.join(", ")}.`);
  }
  if (data.fuelType !== undefined && !FUEL_TYPES.includes(String(data.fuelType))) {
    errors.push(`fuelType must be one of: ${FUEL_TYPES.join(", ")}.`);
  }
  if (
    data.transmissionPreference !== undefined &&
    !TRANSMISSIONS.includes(String(data.transmissionPreference))
  ) {
    errors.push(`transmissionPreference must be one of: ${TRANSMISSIONS.join(", ")}.`);
  }
  if (data.useCase !== undefined && !USE_CASES.includes(data.useCase as UseCase)) {
    errors.push(`useCase must be one of: ${USE_CASES.join(", ")}.`);
  }

  let priorities: Priority[] | undefined;
  if (data.priorities !== undefined) {
    if (!Array.isArray(data.priorities)) {
      errors.push("priorities must be an array.");
    } else {
      const invalid = data.priorities.filter(
        (p) => !PRIORITIES.includes(p as Priority)
      );
      if (invalid.length > 0) {
        errors.push(
          `priorities may only contain: ${PRIORITIES.join(", ")}.`
        );
      } else {
        priorities = data.priorities as Priority[];
      }
    }
  }

  let seatingNeed: number | undefined;
  if (data.seatingNeed !== undefined && data.seatingNeed !== null) {
    seatingNeed = Number(data.seatingNeed);
    if (Number.isNaN(seatingNeed) || seatingNeed < 1) {
      errors.push("seatingNeed must be a number of at least 1.");
    }
  }

  if (errors.length > 0) return { errors };

  return {
    input: {
      budgetRange: { min, max },
      bodyType: data.bodyType as RecommendationInput["bodyType"],
      useCase: data.useCase as UseCase | undefined,
      fuelType: data.fuelType as RecommendationInput["fuelType"],
      priorities,
      seatingNeed,
      transmissionPreference:
        data.transmissionPreference as RecommendationInput["transmissionPreference"],
    },
  };
}

export const recommend = async (req: Request, res: Response) => {
  const parsed = parseInput(req.body);
  if ("errors" in parsed) {
    return res.status(400).json({ message: "Invalid input", errors: parsed.errors });
  }

  try {
    const cars = await Car.find().lean();
    const result = recommendCars(cars, parsed.input);

    if (result.recommendations.length === 0) {
      return res.status(404).json({
        message: "No cars matched your requirements. Try widening your budget or seating needs.",
        input: parsed.input,
      });
    }

    return res.status(200).json({
      input: parsed.input,
      totalCandidates: result.totalCandidates,
      recommendations: result.recommendations,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error generating recommendations", error });
  }
};
