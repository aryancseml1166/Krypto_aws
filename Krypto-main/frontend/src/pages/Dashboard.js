import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
import Loader from "../components/Common/Loader";
import Search from "../components/Dashboard/Search";
import TabsComponent from "../components/Dashboard/Tabs";
import PaginationComponent from "../components/Dashboard/Pagination";
import TopButton from "../components/Common/TopButton";
import Footer from "../components/Common/Footer/footer";
import { get100Coins } from "../functions/get100Coins";
import "./Dashboard.css";

function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [paginatedCoins, setPaginatedCoins] = useState([]);

  useEffect(() => {
    // Get 100 Coins
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    try {
      const data = await get100Coins();
      if (data?.length) {
        setCoins(data);
        setPaginatedCoins(data.slice(0, 10));
      }
    } catch (e) {
      console.error("Dashboard getData:", e?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  // var filteredCoins = coins.filter((coin) => {
  //   if (
  //     coin.name.toLowerCase().includes(search.trim().toLowerCase()) ||
  //     coin.symbol.toLowerCase().includes(search.trim().toLowerCase())
  //   ) {
  //     return coin;
  //   }
  // });

  var filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    // Value = new page number
    var initialCount = (value - 1) * 10;
    setPaginatedCoins(coins.slice(initialCount, initialCount + 10));
  };

  return (
    <>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard-page">
          <header className="dashboard-header">
            <h1 className="dashboard-title">Market</h1>
            <p className="dashboard-subtitle">Top 100 coins by market cap · real-time data</p>
          </header>
          <Search search={search} handleChange={handleChange} />
          <div className="dashboard-content">
            <TabsComponent
              coins={search ? filteredCoins : paginatedCoins}
              setSearch={setSearch}
            />
            {!search && (
              <PaginationComponent
                page={page}
                handlePageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      )}
      <TopButton />
      <Footer />
    </>
  );
}

export default Dashboard;

// coins == 100 coins

// PaginatedCoins -> Page 1 - coins.slice(0,10)
// PaginatedCoins -> Page 2 = coins.slice(10,20)
// PaginatedCoins -> Page 3 = coins.slice(20,30)
// .
// .
// PaginatedCoins -> Page 10 = coins.slice(90,100)

// PaginatedCoins -> Page X , then initial Count = (X-1)*10
// coins.slice(initialCount,initialCount+10)
