import React, { useEffect, useState, useRef } from "react";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import SelectCoins from "../components/ComparePage/SelectCoins";
import List from "../components/Dashboard/List";
import { get100Coins } from "../functions/get100Coins";
import { getCoinData } from "../functions/getCoinData";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";
import { settingCoinObject } from "../functions/settingCoinObject";

function Compare() {
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [crypto1, setCrypto1] = useState("bitcoin");
  const [crypto2, setCrypto2] = useState("ethereum");
  const [coin1Data, setCoin1Data] = useState({});
  const [coin2Data, setCoin2Data] = useState({});
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const abortRef = useRef(null);

  const abortPrevious = () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    return abortRef.current.signal;
  };

  useEffect(() => {
    getData();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const getData = async () => {
    setLoading(true);
    setError(false);
    const signal = abortPrevious();

    try {
      const [coins, data1, data2] = await Promise.all([
        get100Coins(signal),
        getCoinData(crypto1, null, signal),
        getCoinData(crypto2, null, signal),
      ]);

      if (signal?.aborted) return;
      if (!coins?.length) {
        setError(true);
        setLoading(false);
        return;
      }
      setAllCoins(coins);

      if (data1) settingCoinObject(data1, setCoin1Data);
      if (data2) settingCoinObject(data2, setCoin2Data);

      const [prices1, prices2] = await Promise.all([
        getPrices(crypto1, days, priceType, null, signal),
        getPrices(crypto2, days, priceType, null, signal),
      ]);

      if (signal?.aborted) return;
      if (prices1 && prices2) settingChartData(setChartData, prices1, prices2);
    } catch (e) {
      if (e?.name !== "AbortError") setError(true);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  const onCoinChange = async (e, isCoin2) => {
    setLoading(true);
    const signal = abortPrevious();
    const newCrypto = e.target.value;

    if (isCoin2) {
      setCrypto2(newCrypto);
      try {
        const [data2, prices1, prices2] = await Promise.all([
          getCoinData(newCrypto, null, signal),
          getPrices(crypto1, days, priceType, null, signal),
          getPrices(newCrypto, days, priceType, null, signal),
        ]);
        if (signal?.aborted) return;
        if (data2) settingCoinObject(data2, setCoin2Data);
        if (prices1 && prices2) settingChartData(setChartData, prices1, prices2);
      } catch (err) {
        if (err?.name !== "AbortError") setError(true);
      }
    } else {
      setCrypto1(newCrypto);
      try {
        const [data1, prices1, prices2] = await Promise.all([
          getCoinData(newCrypto, null, signal),
          getPrices(newCrypto, days, priceType, null, signal),
          getPrices(crypto2, days, priceType, null, signal),
        ]);
        if (signal?.aborted) return;
        if (data1) settingCoinObject(data1, setCoin1Data);
        if (prices1 && prices2) settingChartData(setChartData, prices1, prices2);
      } catch (err) {
        if (err?.name !== "AbortError") setError(true);
      }
    }
    if (!signal?.aborted) setLoading(false);
  };

  const handleDaysChange = async (e) => {
    const newDays = Number(e.target.value);
    setDays(newDays);
    setLoading(true);
    const signal = abortPrevious();

    try {
      const [prices1, prices2] = await Promise.all([
        getPrices(crypto1, newDays, priceType, null, signal),
        getPrices(crypto2, newDays, priceType, null, signal),
      ]);
      if (signal?.aborted) return;
      if (prices1 && prices2) settingChartData(setChartData, prices1, prices2);
    } catch (err) {
      if (err?.name !== "AbortError") setError(true);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  const handlePriceTypeChange = async (e) => {
    const newPriceType = e.target.value;
    setPriceType(newPriceType);
    setLoading(true);
    const signal = abortPrevious();

    try {
      const [prices1, prices2] = await Promise.all([
        getPrices(crypto1, days, newPriceType, null, signal),
        getPrices(crypto2, days, newPriceType, null, signal),
      ]);
      if (signal?.aborted) return;
      if (prices1 && prices2) settingChartData(setChartData, prices1, prices2);
    } catch (err) {
      if (err?.name !== "AbortError") setError(true);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  const ready = !loading && coin1Data?.id && coin2Data?.id && !error;

  return (
    <div>
      <Header />
      {error && (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--grey)" }}>
          Failed to load data. Check your connection or try again later.
        </div>
      )}
      {!ready && !error ? (
        <Loader />
      ) : ready ? (
        <>
          <SelectCoins
            allCoins={allCoins}
            crypto1={crypto1}
            crypto2={crypto2}
            onCoinChange={onCoinChange}
            days={days}
            handleDaysChange={handleDaysChange}
          />
          <div className="grey-wrapper">
            <List coin={coin1Data} />
          </div>
          <div className="grey-wrapper">
            <List coin={coin2Data} />
          </div>
          <div className="grey-wrapper">
            <ToggleComponents
              priceType={priceType}
              handlePriceTypeChange={handlePriceTypeChange}
            />
            <LineChart chartData={chartData} multiAxis={true} />
          </div>
          <Info title={coin1Data.name} desc={coin1Data.desc} />
          <Info title={coin2Data.name} desc={coin2Data.desc} />
        </>
      ) : null}
    </div>
  );
}

export default Compare;
