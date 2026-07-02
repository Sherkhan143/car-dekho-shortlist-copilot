import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecommendationForm } from "../components/RecommendationForm";
import { fetchRecommendations } from "../services/api";
import { useRecommendation } from "../context/recommendation-context";
import type { RecommendationInput } from "../types";

export function HomePage() {
  const navigate = useNavigate();
  const { setResult } = useRecommendation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: RecommendationInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRecommendations(input);
      setResult(result);
      navigate("/recommended");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <h1>Not sure which car to buy?</h1>
        <p>
          Tell us a little about your needs and budget, and our copilot will
          shortlist the cars that fit you best.
        </p>
      </section>

      <section className="card">
        <h2>Find your perfect car</h2>
        <RecommendationForm onSubmit={handleSubmit} loading={loading} />
        {error && <p className="form__error">{error}</p>}
      </section>
    </div>
  );
}
