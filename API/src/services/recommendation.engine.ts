import type { ICar } from "../models/car.model";
import type {
  Priority,
  Recommendation,
  RecommendationInput,
  ScoreBreakdown,
  UseCase,
} from "../types/recommendation";

const WEIGHTS = {
  useCase: 25,
  priorities: 35,
  bodyType: 12,
  fuelType: 12,
  transmission: 8,
  budgetFit: 8,
} as const;

const MAX_SCORE = Object.values(WEIGHTS).reduce((sum, w) => sum + w, 0);

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const round = (value: number, decimals = 1): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

/**
 * Converts a car's raw mileage (kmpl) into a 0-10 efficiency score.
 * Electric cars report 0 kmpl, so they are treated as highly efficient
 * on running cost instead of being penalised.
 */
function mileageScore(car: ICar): number {
  if (car.fuelType === "Electric") return 9.5;
  // Typical mass-market range is roughly 12-28 kmpl.
  return clamp(((car.mileage - 12) / (28 - 12)) * 10, 0, 10);
}

function safetyScore(car: ICar): number {
  return (car.safetyRating / 5) * 10;
}

/** Returns the 0-10 attribute score a given priority maps to. */
function priorityScore(car: ICar, priority: Priority): number {
  switch (priority) {
    case "mileage":
      return mileageScore(car);
    case "safety":
      return safetyScore(car);
    case "performance":
      return car.performanceScore;
    case "features":
      return car.featureScore;
    case "low-maintenance":
      return car.maintenanceScore;
    default:
      return 0;
  }
}

/** Returns the 0-10 score for how well the car fits the chosen use case. */
function useCaseScore(car: ICar, useCase: UseCase): number {
  switch (useCase) {
    case "city":
      return car.cityUseScore;
    case "family":
      return car.familyScore;
    case "highway":
      return car.highwayUseScore;
    case "suv": {
      const bodyBonus = car.bodyType === "SUV" ? 10 : 5;
      return (bodyBonus + car.highwayUseScore + car.performanceScore) / 3;
    }
    default:
      return 0;
  }
}

const PRIORITY_LABELS: Record<Priority, string> = {
  mileage: "fuel efficiency",
  safety: "safety",
  performance: "performance",
  features: "features",
  "low-maintenance": "low running/maintenance cost",
};

const USE_CASE_LABELS: Record<UseCase, string> = {
  city: "city driving",
  family: "family use",
  highway: "highway cruising",
  suv: "an SUV experience",
};

function scoreCar(
  car: ICar,
  input: RecommendationInput
): { breakdown: ScoreBreakdown; reasons: string[] } {
  const reasons: string[] = [];
  const breakdown: ScoreBreakdown = {
    useCase: 0,
    priorities: 0,
    bodyType: 0,
    fuelType: 0,
    transmission: 0,
    budgetFit: 0,
  };

  // Use case alignment
  if (input.useCase) {
    const raw = useCaseScore(car, input.useCase); // 0-10
    breakdown.useCase = (raw / 10) * WEIGHTS.useCase;
    if (raw >= 8) {
      reasons.push(
        `Excellent for ${USE_CASE_LABELS[input.useCase]} (${round(raw)}/10).`
      );
    } else if (raw >= 6.5) {
      reasons.push(
        `Well suited to ${USE_CASE_LABELS[input.useCase]} (${round(raw)}/10).`
      );
    }
  } else {
    breakdown.useCase = WEIGHTS.useCase * 0.6;
  }

  // Priorities (weight split evenly across the chosen priorities)
  const priorities = input.priorities ?? [];
  if (priorities.length > 0) {
    const perPriority = WEIGHTS.priorities / priorities.length;
    let earned = 0;
    for (const priority of priorities) {
      const raw = priorityScore(car, priority); // 0-10
      earned += (raw / 10) * perPriority;
      if (raw >= 8) {
        reasons.push(
          `Strong on ${PRIORITY_LABELS[priority]} (${round(raw)}/10), one of your priorities.`
        );
      }
    }
    breakdown.priorities = earned;
  } else {
    // No explicit priorities: reward all-round balance.
    const balance =
      (mileageScore(car) +
        safetyScore(car) +
        car.performanceScore +
        car.featureScore +
        car.maintenanceScore) /
      5;
    breakdown.priorities = (balance / 10) * WEIGHTS.priorities;
  }

  // Body type preference
  if (input.bodyType) {
    if (car.bodyType === input.bodyType) {
      breakdown.bodyType = WEIGHTS.bodyType;
      reasons.push(`Matches your preferred ${input.bodyType} body type.`);
    } else {
      breakdown.bodyType = 0;
    }
  } else {
    breakdown.bodyType = WEIGHTS.bodyType * 0.6;
  }

  // Fuel type preference
  if (input.fuelType) {
    if (car.fuelType === input.fuelType) {
      breakdown.fuelType = WEIGHTS.fuelType;
      reasons.push(`Runs on your preferred ${input.fuelType} fuel type.`);
    } else {
      breakdown.fuelType = 0;
    }
  } else {
    breakdown.fuelType = WEIGHTS.fuelType * 0.6;
  }

  // Transmission preference
  if (input.transmissionPreference) {
    if (car.transmission === input.transmissionPreference) {
      breakdown.transmission = WEIGHTS.transmission;
      reasons.push(
        `Comes with your preferred ${input.transmissionPreference} transmission.`
      );
    } else {
      breakdown.transmission = 0;
    }
  } else {
    breakdown.transmission = WEIGHTS.transmission * 0.6;
  }

  // Budget fit: reward cars within the window, penalise ones that stretch it.
  const { min = 0, max } = input.budgetRange;
  if (car.priceInLacs <= max) {
    // Full marks when within budget; a touch more when it isn't at the very top.
    const headroom = max > min ? (max - car.priceInLacs) / (max - min) : 1;
    breakdown.budgetFit = WEIGHTS.budgetFit * clamp(0.7 + 0.3 * headroom, 0, 1);
    reasons.push(
      `Priced at ₹${round(car.priceInLacs, 2)}L, within your budget.`
    );
  } else {
    // Over budget: the score decays and can go negative so that big
    // overshoots are pushed down the list rather than winning on other merits.
    const overBy = (car.priceInLacs - max) / max;
    breakdown.budgetFit = WEIGHTS.budgetFit * clamp(1 - overBy * 2, -1.5, 1);
    reasons.push(
      `Above your budget at ₹${round(car.priceInLacs, 2)}L (${round(
        overBy * 100,
        0
      )}% over) — included as a close alternative.`
    );
  }

  // Always surface a top safety rating, even if not a listed priority.
  if (car.safetyRating >= 5 && !priorities.includes("safety")) {
    reasons.push("Top 5-star safety rating.");
  }

  return { breakdown, reasons };
}

export interface RecommendationResult {
  totalCandidates: number;
  recommendations: Recommendation[];
}

export function recommendCars(
  cars: ICar[],
  input: RecommendationInput,
  limit = 3
): RecommendationResult {
  const seatingNeed = input.seatingNeed ?? 1;
  const budgetMax = input.budgetRange.max;

  // Hard constraints: seating capacity and a small budget tolerance (10%).
  let candidates = cars.filter(
    (car) =>
      car.seats >= seatingNeed && car.priceInLacs <= budgetMax * 1.1
  );

  // Relax the budget ceiling if we can't field enough candidates.
  if (candidates.length < limit) {
    candidates = cars.filter((car) => car.seats >= seatingNeed);
  }

  const scored: Recommendation[] = candidates.map((car) => {
    const { breakdown, reasons } = scoreCar(car, input);
    const score = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
    return {
      car: car as ICar & { _id: unknown },
      score: round(score),
      matchPercentage: round((score / MAX_SCORE) * 100),
      reasons,
      breakdown: {
        useCase: round(breakdown.useCase),
        priorities: round(breakdown.priorities),
        bodyType: round(breakdown.bodyType),
        fuelType: round(breakdown.fuelType),
        transmission: round(breakdown.transmission),
        budgetFit: round(breakdown.budgetFit),
      },
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return {
    totalCandidates: candidates.length,
    recommendations: scored.slice(0, limit),
  };
}
