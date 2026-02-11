import { fetchMarketChart } from "../api/coingecko";

export const getPrices = (id, days, priceType, setError, signal) => {
  return fetchMarketChart(id, days, priceType ?? "prices", signal)
    .then((data) => data ?? null)
    .catch((err) => {
      if (err.name === "AbortError") return null;
      console.error("getPrices:", err.message);
      if (setError) setError(true);
      return null;
    });
};
