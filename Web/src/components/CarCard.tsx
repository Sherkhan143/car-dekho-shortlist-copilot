import type { ICar } from "../types";
import { useShortlist } from "../context/shortlist-context";

interface CarCardProps {
  car: ICar;
  matchPercentage?: number;
  reasons?: string[];
}

export function CarCard({ car, matchPercentage, reasons }: CarCardProps) {
  const { isShortlisted, toggleShortlist } = useShortlist();
  const shortlisted = isShortlisted(car._id);

  return (
    <article className="car-card">
      <div className="car-card__media">
        {car.imageUrl ? (
          <img src={car.imageUrl} alt={`${car.make} ${car.model}`} />
        ) : (
          <div className="car-card__placeholder">No image</div>
        )}
        {matchPercentage !== undefined && (
          <span className="car-card__match">{matchPercentage}% match</span>
        )}
      </div>

      <div className="car-card__body">
        <h3 className="car-card__title">
          {car.make} {car.model}
        </h3>
        <p className="car-card__variant">{car.variant}</p>

        <p className="car-card__price">₹{car.priceInLacs.toFixed(2)} L</p>

        <ul className="car-card__specs">
          <li>{car.bodyType}</li>
          <li>{car.fuelType}</li>
          <li>{car.transmission}</li>
          <li>{car.seats} seats</li>
          <li>{car.mileage} kmpl</li>
          <li>{car.safetyRating}★ safety</li>
        </ul>

        {reasons && reasons.length > 0 && (
          <ul className="car-card__reasons">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className={`btn ${shortlisted ? "btn--muted" : "btn--primary"}`}
          onClick={() => void toggleShortlist(car)}
        >
          {shortlisted ? "Remove from Shortlist" : "Add to Shortlist"}
        </button>
      </div>
    </article>
  );
}
