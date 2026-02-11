import { fetchCoinData } from "../api/coingecko";

export const getCoinData = (id, setError, signal) => {
  return fetchCoinData(id, signal)
    .then((data) => data ?? null)
    .catch((err) => {
      if (err.name === "AbortError") return null;
      console.error("getCoinData:", err.message);
      if (setError) setError(true);
      return null;
    });
};
