import { Request, Response } from "express";
import mongoose from "mongoose";
import Shortlist from "../models/shortlist.model";
import Car from "../models/car.model";

/**
 * POST /api/shortlist
 * Body: { sessionId: string, carId: string }
 * Saves a car to the given session's shortlist (idempotent).
 */
export const addToShortlist = async (req: Request, res: Response) => {
  const { sessionId, carId } = (req.body ?? {}) as {
    sessionId?: string;
    carId?: string;
  };

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ message: "sessionId is required." });
  }
  if (!carId || !mongoose.isValidObjectId(carId)) {
    return res.status(400).json({ message: "A valid carId is required." });
  }

  try {
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found." });
    }

    // upsert keeps it idempotent — shortlisting the same car twice is a no-op.
    const entry = await Shortlist.findOneAndUpdate(
      { sessionId, car: carId },
      { $setOnInsert: { sessionId, car: carId } },
      { upsert: true, returnDocument: "after" }
    ).populate("car");

    return res.status(200).json(entry);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding to shortlist", error });
  }
};

/**
 * GET /api/shortlist/:sessionId
 * Returns all cars shortlisted under the given session.
 */
export const getShortlist = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ message: "sessionId is required." });
  }

  try {
    const entries = await Shortlist.find({ sessionId })
      .sort({ createdAt: -1 })
      .populate("car");

    return res.status(200).json({
      sessionId,
      count: entries.length,
      cars: entries.map((e) => e.car),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching shortlist", error });
  }
};

/**
 * DELETE /api/shortlist
 * Body: { sessionId: string, carId: string }
 * Removes a car from the given session's shortlist.
 */
export const removeFromShortlist = async (req: Request, res: Response) => {
  const { sessionId, carId } = (req.body ?? {}) as {
    sessionId?: string;
    carId?: string;
  };

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ message: "sessionId is required." });
  }
  if (!carId || !mongoose.isValidObjectId(carId)) {
    return res.status(400).json({ message: "A valid carId is required." });
  }

  try {
    const result = await Shortlist.findOneAndDelete({ sessionId, car: carId });
    if (!result) {
      return res
        .status(404)
        .json({ message: "This car is not in the session's shortlist." });
    }
    return res.status(200).json({ message: "Removed from shortlist.", sessionId, carId });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error removing from shortlist", error });
  }
};
