import { Link } from "react-router-dom";
import { CarCard } from "../components/CarCard";
import { useShortlist } from "../context/shortlist-context";

export function ShortlistPage() {
  const { items, loading, error, clearShortlist } = useShortlist();

  if (loading) {
    return (
      <div className="page">
        <div className="empty">
          <h2>Loading your shortlist…</h2>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="empty">
          <h2>Your shortlist is empty</h2>
          <p>Add cars from the recommendations to compare them here.</p>
          <Link to="/recommended" className="btn btn--primary">
            View Recommended Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="page__header">
        <h1>My Shortlisted Cars</h1>
        <p>{items.length} car(s) saved.</p>
        <button
          type="button"
          className="btn btn--muted"
          onClick={() => void clearShortlist()}
        >
          Clear all
        </button>
      </section>

      {error && <p className="form__error">{error}</p>}

      <div className="grid">
        {items.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
    </div>
  );
}
