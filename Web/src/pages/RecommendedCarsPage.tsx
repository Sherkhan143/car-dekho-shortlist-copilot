import { Link } from "react-router-dom";
import { CarCard } from "../components/CarCard";
import { useRecommendation } from "../context/recommendation-context";

export function RecommendedCarsPage() {
  const { result } = useRecommendation();

  if (!result || result.recommendations.length === 0) {
    return (
      <div className="page">
        <div className="empty">
          <h2>No recommendations yet</h2>
          <p>Fill in the form on the home page to get car suggestions.</p>
          <Link to="/" className="btn btn--primary">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page__header">
        <h1>Recommended Cars</h1>
        <p>
          Showing {result.recommendations.length} of {result.totalCandidates}{" "}
          matching cars, ranked by how well they fit your needs.
        </p>
        <Link to="/" className="btn btn--muted">
          Edit preferences
        </Link>
      </section>

      <div className="grid">
        {result.recommendations.map((rec) => (
          <CarCard
            key={rec.car._id}
            car={rec.car}
            matchPercentage={rec.matchPercentage}
            reasons={rec.reasons}
          />
        ))}
      </div>
    </div>
  );
}
