import React, { useEffect, useMemo, useState } from "react";
import "../styles/dashboard.css";
import CryptoCard from "../components/CryptoCard";

const COINGECKO_MARKETS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true";

const SORT_OPTIONS = [
  { id: "market_cap", label: "Market Cap" },
  { id: "price", label: "Price" },
  { id: "change", label: "24h %" },
  { id: "name", label: "Name" },
];

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [onlyGainers, setOnlyGainers] = useState(false);

  const fetchCoins = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(COINGECKO_MARKETS);
      const data = await res.json();
      setCoins(data || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load coins. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const filtered = useMemo(() => {
    let list = coins.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
    }
    if (onlyGainers) list = list.filter((c) => c.price_change_percentage_24h > 0);

    switch (sortBy) {
      case "price":
        list.sort((a, b) => b.current_price - a.current_price);
        break;
      case "change":
        list.sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0));
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // market cap
        list.sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));
    }

    return list;
  }, [coins, query, sortBy, onlyGainers]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Top Cryptocurrencies</h2>
          <p className="muted">Live prices, market caps and 24h changes. Data from CoinGecko.</p>
        </div>

        <div className="controls">
          <input
            placeholder="Search by name or symbol"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search"
          />

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                Sort: {s.label}
              </option>
            ))}
          </select>

          <label className="toggle">
            <input type="checkbox" checked={onlyGainers} onChange={(e) => setOnlyGainers(e.target.checked)} />
            <span>Gainers only</span>
          </label>

          <button className="refresh" onClick={fetchCoins} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="crypto-grid">
        {filtered.map((coin) => (
          <CryptoCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
