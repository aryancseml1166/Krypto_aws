import { fetchCoinList } from "../api/coingecko";

export const get100Coins = (signal) => {
  return fetchCoinList(signal)
    .then((data) => data)
    .catch((err) => {
      if (err.name === "AbortError") return undefined;
      console.error("get100Coins:", err.message);
      return undefined;
    });
};
