import { useState } from "react";
import type {
  BodyType,
  FuelType,
  Priority,
  RecommendationInput,
  Transmission,
  UseCase,
} from "../types";

const BODY_TYPES: BodyType[] = [
  "Hatchback",
  "Sedan",
  "SUV",
  "MUV",
  "Coupe",
  "Pickup",
];
const FUEL_TYPES: FuelType[] = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const TRANSMISSIONS: Transmission[] = ["Manual", "Automatic"];
const USE_CASES: { value: UseCase; label: string }[] = [
  { value: "city", label: "City driving" },
  { value: "family", label: "Family use" },
  { value: "highway", label: "Highway cruising" },
  { value: "suv", label: "SUV experience" },
];
const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "mileage", label: "Fuel efficiency" },
  { value: "safety", label: "Safety" },
  { value: "performance", label: "Performance" },
  { value: "features", label: "Features" },
  { value: "low-maintenance", label: "Low maintenance" },
];

interface RecommendationFormProps {
  onSubmit: (input: RecommendationInput) => void;
  loading?: boolean;
}

export function RecommendationForm({
  onSubmit,
  loading,
}: RecommendationFormProps) {
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [bodyType, setBodyType] = useState<"" | BodyType>("");
  const [useCase, setUseCase] = useState<"" | UseCase>("");
  const [fuelType, setFuelType] = useState<"" | FuelType>("");
  const [transmission, setTransmission] = useState<"" | Transmission>("");
  const [seatingNeed, setSeatingNeed] = useState("");
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [error, setError] = useState<string | null>(null);

  const togglePriority = (value: Priority) => {
    setPriorities((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const max = Number(budgetMax);
    if (!budgetMax || Number.isNaN(max) || max <= 0) {
      setError("Please enter a valid maximum budget (in lacs).");
      return;
    }

    const min = budgetMin === "" ? undefined : Number(budgetMin);
    if (min !== undefined && (Number.isNaN(min) || min < 0)) {
      setError("Minimum budget must be a non-negative number.");
      return;
    }

    const input: RecommendationInput = {
      budgetRange: { min, max },
      bodyType: bodyType || undefined,
      useCase: useCase || undefined,
      fuelType: fuelType || undefined,
      transmissionPreference: transmission || undefined,
      seatingNeed: seatingNeed === "" ? undefined : Number(seatingNeed),
      priorities: priorities.length > 0 ? priorities : undefined,
    };

    onSubmit(input);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__grid">
        <label className="field">
          <span>
            Min budget (₹ Lacs) <em>optional</em>
          </span>
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 5"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
          />
        </label>

        <label className="field">
          <span>
            Max budget (₹ Lacs) <em>required</em>
          </span>
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 15"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Body type</span>
          <select
            value={bodyType}
            onChange={(e) => setBodyType(e.target.value as BodyType | "")}
          >
            <option value="">Any</option>
            {BODY_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Primary use case</span>
          <select
            value={useCase}
            onChange={(e) => setUseCase(e.target.value as UseCase | "")}
          >
            <option value="">Any</option>
            {USE_CASES.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Fuel type</span>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value as FuelType | "")}
          >
            <option value="">Any</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Transmission</span>
          <select
            value={transmission}
            onChange={(e) =>
              setTransmission(e.target.value as Transmission | "")
            }
          >
            <option value="">Any</option>
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>
            Seating need <em>optional</em>
          </span>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 5"
            value={seatingNeed}
            onChange={(e) => setSeatingNeed(e.target.value)}
          />
        </label>
      </div>

      <fieldset className="field field--priorities">
        <legend>What matters most to you? (pick any)</legend>
        <div className="chips">
          {PRIORITIES.map((p) => (
            <label
              key={p.value}
              className={`chip ${
                priorities.includes(p.value) ? "chip--active" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={priorities.includes(p.value)}
                onChange={() => togglePriority(p.value)}
              />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p className="form__error">{error}</p>}

      <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
        {loading ? "Finding cars…" : "Find my cars"}
      </button>
    </form>
  );
}
