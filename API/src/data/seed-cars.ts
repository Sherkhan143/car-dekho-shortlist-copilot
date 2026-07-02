import Car from "../models/car.model";
import { cars, type CarSeed } from "./cars.seed";
import { carImages } from "./car-images";

/**
 * Resolves a car's image URL. Precedence:
 *   1. an explicit imageUrl on the seed entry,
 *   2. a real image from the Wikimedia-sourced map (keyed by make + model),
 *   3. a generated placeholder as a last resort.
 */
function withImage(car: CarSeed) {
  const key = `${car.make} ${car.model}`;
  const label = encodeURIComponent(key);
  const imageUrl =
    car.imageUrl ??
    carImages[key] ??
    `https://placehold.co/600x400/1e293b/ffffff/png?text=${label}`;
  return { ...car, imageUrl };
}

/**
 * Clears the cars collection and inserts the seed data. Assumes an active
 * Mongoose connection. Returns the number of cars inserted.
 */
export async function seedCars(): Promise<number> {
  await Car.deleteMany({});
  const inserted = await Car.insertMany(cars.map(withImage));
  return inserted.length;
}

export default seedCars;
