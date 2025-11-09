import React, { useEffect, useMemo, useState } from "react";
import "../styles/converter.css";

const COINGECKO_MARKETS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false";

const FIAT_OPTIONS = [
  { id: "usd", name: "USD", symbol: "$" },
  { id: "eur", name: "EUR", symbol: "€" },
  { id: "gbp", name: "GBP", symbol: "£" },
];

function formatNumber(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "–";
  if (Math.abs(n) >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return n.toPrecision(6);
}

const Converter = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fromType, setFromType] = useState("coin"); // 'coin' or 'fiat'
  const [toType, setToType] = useState("fiat");

  const [fromCoin, setFromCoin] = useState(null);
  const [toCoin, setToCoin] = useState(null);

  const [fromFiat, setFromFiat] = useState(FIAT_OPTIONS[0].id);
  const [toFiat, setToFiat] = useState(FIAT_OPTIONS[0].id);

  const [amount, setAmount] = useState(1);

  useEffect(() => {
    let aborted = false;
    setLoading(true);
    setError("");
    fetch(COINGECKO_MARKETS)
      .then((r) => r.json())
      .then((data) => {
        if (aborted) return;
        setCoins(data || []);
        setLoading(false);
        // default selections
        if (data && data.length > 0) {
          setFromCoin(data[0].id);
          setToCoin(data[1] ? data[1].id : data[0].id);
        }
      })
      .catch((e) => {
        if (aborted) return;
        setError("Unable to load coin data. Try again later.");
        setLoading(false);
      });
    return () => {
      aborted = true;
    };
  }, []);

  const coinMap = useMemo(() => {
    const m = {};
    coins.forEach((c) => (m[c.id] = c));
    return m;
  }, [coins]);

  const getPriceInUSD = (id) => {
    if (!id) return null;
    const c = coinMap[id];
    return c ? c.current_price : null;
  };

  // conversion logic: support coin↔coin, coin↔fiat, fiat↔fiat
  const result = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    // coin -> coin
    if (fromType === "coin" && toType === "coin") {
      const fromPrice = getPriceInUSD(fromCoin);
      const toPrice = getPriceInUSD(toCoin);
      if (fromPrice === null || toPrice === null) return null;
      const converted = (amt * fromPrice) / toPrice;
      return { value: converted, unit: coinMap[toCoin]?.symbol?.toUpperCase() || toCoin };
    }

    // coin -> fiat
    if (fromType === "coin" && toType === "fiat") {
      const fromPrice = getPriceInUSD(fromCoin);
      if (fromPrice === null) return null;
      // CoinGecko returned prices are in USD; for demo we'll convert USD->selected fiat using simple ratios
      const usdValue = amt * fromPrice;
      // naive conversion rates (for UX) — in production use a forex API. We'll approximate using static rates.
      const rates = { usd: 1, eur: 0.91, gbp: 0.78 };
      const converted = usdValue * (rates[toFiat] || 1);
      return { value: converted, unit: toFiat.toUpperCase() };
    }

    // fiat -> coin
    if (fromType === "fiat" && toType === "coin") {
      const toPrice = getPriceInUSD(toCoin);
      if (toPrice === null) return null;
      const rates = { usd: 1, eur: 0.91, gbp: 0.78 };
      const usdValue = amt * (rates[fromFiat] || 1);
      const converted = usdValue / toPrice;
      return { value: converted, unit: coinMap[toCoin]?.symbol?.toUpperCase() || toCoin };
    }

    // fiat -> fiat
    if (fromType === "fiat" && toType === "fiat") {
      const rates = { usd: 1, eur: 0.91, gbp: 0.78 };
      const converted = amt * ((rates[toFiat] || 1) / (rates[fromFiat] || 1));
      return { value: converted, unit: toFiat.toUpperCase() };
    }

    return null;
  }, [amount, fromType, toType, fromCoin, toCoin, fromFiat, toFiat, coinMap]);

  const handleSwap = () => {
    // swap types and selections
    setFromType((prev) => {
      const newFromType = toType;
      setToType(prev);
      return newFromType;
    });
    // swap selections
    setFromCoin((prevCoin) => {
      setToCoin(prevCoin);
      return toCoin;
    });
    setFromFiat((prev) => {
      setToFiat(prev);
      return fromFiat;
    });
  };

  return (
    <div className="converter-page">
      <div className="converter-card">
        <h2>Crypto & Fiat Converter</h2>
        <p className="muted">Convert between cryptocurrencies and fiat currencies quickly.</p>

        {loading ? (
          <div className="loader">Loading coins…</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="converter-grid">
            <div className="column">
              <label>From</label>
              <div className="row">
                <select value={fromType} onChange={(e) => setFromType(e.target.value)}>
                  <option value="coin">Cryptocurrency</option>
                  <option value="fiat">Fiat</option>
                </select>
                {fromType === "coin" ? (
                  <select value={fromCoin || ""} onChange={(e) => setFromCoin(e.target.value)}>
                    {coins.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.symbol.toUpperCase()})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select value={fromFiat} onChange={(e) => setFromFiat(e.target.value)}>
                    {FIAT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="column amount-col">
              <label>Amount</label>
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="amount-input"
              />
              <button className="swap-btn" onClick={handleSwap} title="Swap from/to">
                ⇅ Swap
              </button>
            </div>

            <div className="column">
              <label>To</label>
              <div className="row">
                <select value={toType} onChange={(e) => setToType(e.target.value)}>
                  <option value="coin">Cryptocurrency</option>
                  <option value="fiat">Fiat</option>
                </select>
                {toType === "coin" ? (
                  <select value={toCoin || ""} onChange={(e) => setToCoin(e.target.value)}>
                    {coins.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.symbol.toUpperCase()})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select value={toFiat} onChange={(e) => setToFiat(e.target.value)}>
                    {FIAT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="result-box">
          <div className="result-label">Result</div>
          <div className="result-value">
            {result ? (
              <>
                <strong>{formatNumber(result.value)}</strong>
                <span className="unit"> {result.unit}</span>
              </>
            ) : (
              <span className="muted">—</span>
            )}
          </div>
          <div className="helper">
            {fromType === "coin" && (
              <small>
                1 {coinMap[fromCoin]?.symbol?.toUpperCase()} = ${formatNumber(getPriceInUSD(fromCoin))} USD
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
