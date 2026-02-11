import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.REACT_APP_COINGECKO_API_KEY || "";

const coingecko = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    ...(API_KEY && { "x-cg-demo-api-key": API_KEY }),
  },
});

// Simple in-memory cache with TTL (ms) to reduce duplicate calls and avoid rate limits
const cache = new Map();
const CACHE_TTL = {
  list: 5 * 60 * 1000,      // 5 min for coin list
  coin: 3 * 60 * 1000,     // 3 min per coin
  prices: 2 * 60 * 1000,   // 2 min per (id, days, type)
};

function getCached(key, ttl) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data, ttl) {
  cache.set(key, { data, at: Date.now() });
}

/**
 * Fetch top 100 coins (cached)
 */
export async function fetchCoinList(signal) {
  const key = "coins:markets:100";
  const cached = getCached(key, CACHE_TTL.list);
  if (cached) return cached;
  const { data } = await coingecko.get(
    "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
    { signal }
  );
  setCache(key, data, CACHE_TTL.list);
  return data;
}

/**
 * Fetch single coin details (cached per id)
 */
export async function fetchCoinData(id, signal) {
  if (!id) return null;
  const key = `coin:${id}`;
  const cached = getCached(key, CACHE_TTL.coin);
  if (cached) return cached;
  const { data } = await coingecko.get(`/coins/${id}`, { signal });
  setCache(key, data, CACHE_TTL.coin);
  return data;
}

/**
 * Fetch market chart (prices / market_caps / total_volumes) (cached per id, days, type)
 */
export async function fetchMarketChart(id, days, priceType, signal) {
  if (!id) return null;
  const key = `chart:${id}:${days}:${priceType}`;
  const cached = getCached(key, CACHE_TTL.prices);
  if (cached) return cached;
  const { data } = await coingecko.get(
    `/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
    { signal }
  );
  let result = data?.prices;
  if (priceType === "market_caps") result = data?.market_caps;
  else if (priceType === "total_volumes") result = data?.total_volumes;
  setCache(key, result, CACHE_TTL.prices);
  return result;
}

export default coingecko;
