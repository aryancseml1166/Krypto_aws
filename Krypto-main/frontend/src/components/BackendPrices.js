import React, { useEffect, useState } from "react";
import API from "../api";

function BackendPrices() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    API.get("/crypto/prices")
      .then((res) => {
        setPrices(res.data);
      })
      .catch((err) => {
        console.error("Price fetch error:", err);
      });
  }, []);

 return (
  <div style={{ padding: "20px" }}>
    <h2>Prices from Flask Backend</h2>

    {prices.map((coin) => (
      <div key={coin.id} style={{ marginBottom: "10px" }}>
        <span>
          {coin.id.toUpperCase()} : ${coin.price}
        </span>

        <button
          style={{ marginLeft: "10px" }}
          onClick={() => {
            API.post("/watchlist/add", { coin_id: coin.id })
              .then(() => alert(`${coin.id} added to watchlist`))
              .catch((err) => console.error(err));
          }}
        >
          Add to Watchlist
        </button>
      </div>
    ))}
  </div>
);
}

export default BackendPrices;
