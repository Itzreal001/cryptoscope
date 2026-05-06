import React, { useState, useMemo } from 'react';
import { useCrypto } from '../context/CryptoContext';
import '../styles/portfolio.css';

const Portfolio = () => {
  const { portfolio, coins, addToPortfolio, removeFromPortfolio } = useCrypto();
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const totalValue = useMemo(() => {
    return portfolio.reduce((total, asset) => {
      const coin = coins.find(c => c.id === asset.id);
      if (!coin) return total;
      const currentValue = coin.current_price * asset.amount;
      return total + currentValue;
    }, 0);
  }, [portfolio, coins]);

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <h2>Portfolio Tracker</h2>
        <div className="portfolio-stats">
          <div className="stat-card">
            <h3>Total Value</h3>
            <div className="value">${totalValue.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      <div className="portfolio-grid">
        {portfolio.map(asset => {
          const coin = coins.find(c => c.id === asset.id);
          const currentPrice = coin?.current_price || 0;
          const currentValue = currentPrice * asset.amount;
          const profitLoss = currentValue - (asset.avgBuyPrice * asset.amount);
          const profitLossPercent = ((currentPrice - asset.avgBuyPrice) / asset.avgBuyPrice) * 100;

          return (
            <div key={asset.id} className="asset-card">
              <div className="asset-header">
                <div className="asset-title">
                  <h3>{coin?.name || asset.name}</h3>
                  <span className="symbol">{asset.symbol.toUpperCase()}</span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => removeFromPortfolio(asset.id)}
                  title="Remove asset"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="asset-details">
                <div className="detail">
                  <span>Amount</span>
                  <strong>{asset.amount.toLocaleString()}</strong>
                </div>
                <div className="detail">
                  <span>Avg. Buy Price</span>
                  <strong>${asset.avgBuyPrice.toLocaleString()}</strong>
                </div>
                <div className="detail">
                  <span>Current Price</span>
                  <strong>${currentPrice.toLocaleString()}</strong>
                </div>
                <div className="detail">
                  <span>Value</span>
                  <strong>${currentValue.toLocaleString()}</strong>
                </div>
                <div className="detail profit-loss">
                  <span>Profit/Loss</span>
                  <strong className={profitLoss >= 0 ? 'profit' : 'loss'}>
                    ${Math.abs(profitLoss).toLocaleString()} ({profitLossPercent.toFixed(2)}%)
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
        
        {isAddingAsset ? (
          <div className="asset-card add-form">
            <div className="asset-header">
              <h3>Add New Asset</h3>
              <button className="close-btn" onClick={() => setIsAddingAsset(false)}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const coin = coins.find(c => c.id === selectedCoin);
              if (coin && amount && buyPrice) {
                addToPortfolio(coin, amount, buyPrice);
                setIsAddingAsset(false);
                setSelectedCoin('');
                setAmount('');
                setBuyPrice('');
              }
            }}>
              <div className="form-group">
                <label>Select Coin</label>
                <select 
                  value={selectedCoin} 
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  required
                >
                  <option value="">Choose a coin...</option>
                  {coins.map(coin => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="form-group">
                <label>Buy Price (USD)</label>
                <input
                  type="number"
                  step="any"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="Enter buy price"
                  required
                />
              </div>
              <button type="submit" className="add-btn">
                <span className="material-icons">add</span>
                Add Asset
              </button>
            </form>
          </div>
        ) : (
          <button className="add-asset-card" onClick={() => setIsAddingAsset(true)}>
            <span className="material-icons">add_circle_outline</span>
            <span>Add Asset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Portfolio;