import React, { useEffect, useState, useCallback } from "react";
import Button from "../components/Common/Button";
import Header from "../components/Common/Header";
import TabsComponent from "../components/Dashboard/Tabs";
import API from "../api";

function Watchlist() {

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Fetch coins from backend
  const getWatchlist = useCallback(async () => {
    try {

      const res = await API.get("/watchlist/all");
      const ids = res.data || [];

      if (ids.length === 0) {
        setCoins([]);
        setLoading(false);
        return;
      }

      const priceRes = await API.get("/crypto/prices");

      const filtered = priceRes.data.filter((coin) =>
        ids.includes(coin.id)
      );

      setCoins(filtered);
      setLoading(false);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getWatchlist();
  }, [getWatchlist]);

  return (
    <div>
      <Header />

      {loading ? (
        <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
          Loading Watchlist...
        </h2>
      ) : coins.length > 0 ? (
        <TabsComponent coins={coins} />
      ) : (
        <div>
          <h1 style={{ textAlign: "center" }}>
            Sorry, No Items In The Watchlist.
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "2rem",
            }}
          >
            <a href="/dashboard">
              <Button text="Dashboard" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
