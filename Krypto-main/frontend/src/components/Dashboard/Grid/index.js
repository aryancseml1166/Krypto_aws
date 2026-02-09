import React, { useState, useEffect } from "react";
import "./styles.css";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { motion } from "framer-motion";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import API from "../../../api";
import { useNavigate } from "react-router-dom";

function Grid({ coin, delay }) {

  const navigate = useNavigate();
  const [isCoinAdded, setIsCoinAdded] = useState(false);

  // ⭐ CHECK WATCHLIST FROM BACKEND
  useEffect(() => {
    API.get("/watchlist/all").then(res => {
      if (res.data.includes(coin.id)) {
        setIsCoinAdded(true);
      }
    });
  }, [coin.id]);

  const handleWatchlist = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {

      if (isCoinAdded) {
        await API.post("/watchlist/remove", { coin_id: coin.id });
        setIsCoinAdded(false);
      } else {
        await API.post("/watchlist/add", { coin_id: coin.id });
        setIsCoinAdded(true);
        alert(`${coin.name} added to watchlist`);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      onClick={() => navigate(`/coin/${coin.id}`)}
      className={`grid ${coin.price_change_percentage_24h < 0 && "grid-red"}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
    >

      <div className="img-flex">
        <img src={coin.image} className="coin-image" />

        <div className="icon-flex">
          <div className="info-flex">
            <p className="coin-symbol">{coin.symbol}</p>
            <p className="coin-name">{coin.name}</p>
          </div>

          <div className="watchlist-icon" onClick={handleWatchlist}>
            {isCoinAdded ? <StarIcon /> : <StarOutlineIcon />}
          </div>
        </div>
      </div>

      {coin.price_change_percentage_24h >= 0 ? (
        <div className="chip-flex">
          <div className="price-chip">
            {coin.price_change_percentage_24h.toFixed(2)}%
          </div>
          <TrendingUpRoundedIcon />
        </div>
      ) : (
        <div className="chip-flex">
          <div className="price-chip red">
            {coin.price_change_percentage_24h.toFixed(2)}%
          </div>
          <TrendingDownRoundedIcon />
        </div>
      )}

      <p className={coin.price_change_percentage_24h >= 0 ? "current-price" : "current-price-red"}>
        ${coin.current_price.toLocaleString()}
      </p>

      <p className="coin-name">
        Total Volume : {coin.total_volume.toLocaleString()}
      </p>

      <p className="coin-name">
        Market Capital : ${coin.market_cap.toLocaleString()}
      </p>

    </motion.div>
  );
}

export default Grid;
