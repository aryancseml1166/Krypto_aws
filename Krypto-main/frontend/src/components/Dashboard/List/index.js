import React, { useState, useEffect } from "react";
import "./styles.css";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { convertNumber } from "../../../functions/convertNumber";
import { motion } from "framer-motion";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import API from "../../../api";

function List({ coin, delay, index }) {
  const [isCoinAdded, setIsCoinAdded] = useState(false);

  useEffect(() => {
    API.get("/watchlist/all").then(res => {
      if (res.data.includes(coin.id)) {
        setIsCoinAdded(true);
      }
    });
  }, [coin.id]);

  const handleWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {

      if (isCoinAdded) {
        await API.post("/watchlist/remove", { coin_id: coin.id });
        setIsCoinAdded(false);
      } else {
        await API.post("/watchlist/add", { coin_id: coin.id });
        setIsCoinAdded(true);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <a href={`/coin/${coin.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <motion.tr className="list-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: delay }}>
        <td className="td-rank">{index}</td>
        <td className="td-coin">
          <img src={coin.image} className="coin-image coin-image-td" alt="" />
          <div className="coin-info-inline">
            <p className="coin-symbol">{coin.symbol}</p>
            <p className="coin-name">{coin.name}</p>
          </div>
        </td>

        {coin.price_change_percentage_24h >= 0 ? (
          <td>
            <div className="price-chip">
              {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
            <TrendingUpRoundedIcon />
          </td>
        ) : (
          <td>
            <div className="price-chip red">
              {coin.price_change_percentage_24h.toFixed(2)}%
            </div>
            <TrendingDownRoundedIcon />
          </td>
        )}

        <td>${coin.current_price.toLocaleString()}</td>
        <td>{coin.total_volume.toLocaleString()}</td>
        <td>${convertNumber(coin.market_cap)}</td>

        <td className="td-watchlist" onClick={handleWatchlist}>
          {isCoinAdded ? <StarIcon /> : <StarOutlineIcon />}
        </td>

      </motion.tr>
    </a>
  );
}

export default List;
