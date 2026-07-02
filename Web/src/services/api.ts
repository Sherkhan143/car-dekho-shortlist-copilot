import type {
  ICar,
  RecommendationInput,
  RecommendationResponse,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && (data.message as string)) ||
      `Request failed with status ${res.status}`;
    const errors: string[] | undefined = data?.errors;
    throw new Error(errors?.length ? `${message} ${errors.join(" ")}` : message);
  }

  return data as T;
}

export async function fetchAllCars(): Promise<ICar[]> {
  const res = await fetch(`${API_BASE_URL}/cars/all`);
  return handleResponse<ICar[]>(res);
}

export async function fetchRecommendations(
  input: RecommendationInput
): Promise<RecommendationResponse> {
  const res = await fetch(`${API_BASE_URL}/cars/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handleResponse<RecommendationResponse>(res);
}

interface ShortlistResponse {
  sessionId: string;
  count: number;
  cars: ICar[];
}

export async function fetchShortlist(sessionId: string): Promise<ICar[]> {
  const res = await fetch(`${API_BASE_URL}/shortlist/${sessionId}`);
  const data = await handleResponse<ShortlistResponse>(res);
  return data.cars;
}

export async function addShortlistItem(
  sessionId: string,
  carId: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/shortlist/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, carId }),
  });
  await handleResponse<unknown>(res);
}

export async function removeShortlistItem(
  sessionId: string,
  carId: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/shortlist/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, carId }),
  });
  await handleResponse<unknown>(res);
}
