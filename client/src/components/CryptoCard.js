import React from "react";
import "../styles/dashboard.css";

function Sparkline({ data = [], width = 120, height = 36, color = "#29d0ff" }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const CryptoCard = ({ coin }) => {
  if (!coin) return null;
  const change = coin.price_change_percentage_24h;
  const up = change >= 0;
  const sparkData = coin.sparkline_in_7d?.price || [];

  return (
    <div className={`crypto-card pro ${up ? "up" : "down"}`}>
      <div className="card-top">
        <img src={coin.image} alt={coin.name} className="crypto-icon" />
        <div className="title">
          <div className="name">{coin.name}</div>
          <div className="symbol">{coin.symbol.toUpperCase()}</div>
        </div>
      </div>

      <div className="card-body">
        <div className="price">${coin.current_price?.toLocaleString()}</div>
        <div className={`change-badge ${up ? "up" : "down"}`}>{change?.toFixed(2)}%</div>
      </div>

      <div className="meta">
        <div className="spark">
          {sparkData.length ? <Sparkline data={sparkData.slice(-50)} /> : <div className="no-spark">—</div>}
        </div>
        <div className="stats">
          <div className="stat">
            <div className="label">Market Cap</div>
            <div className="value">${coin.market_cap?.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="label">24h Vol</div>
            <div className="value">${coin.total_volume?.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
