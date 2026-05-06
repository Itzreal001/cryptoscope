import React, { useState, useMemo } from 'react';
import { useCrypto } from '../context/CryptoContext';
import '../styles/watchlist.css';

const Watchlist = () => {
  const { watchlist, coins, addToWatchlist, removeFromWatchlist } = useCrypto();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingCoin, setIsAddingCoin] = useState(false);

  const watchlistCoins = useMemo(() => {
    return watchlist.map(item => {
      const coin = coins.find(c => c.id === item.id);
      return {
        ...item,
        currentPrice: coin?.current_price || 0,
        priceChange24h: coin?.price_change_percentage_24h || 0,
        image: coin?.image
      };
    });
  }, [watchlist, coins]);

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h2>My Watchlist</h2>
        <div className="search-bar">
          <span className="material-icons">search</span>
          <input
            type="text"
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="watchlist-grid">
        {watchlist.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">star_outline</span>
            <h3>Your watchlist is empty</h3>
            <p>Add coins to track their prices and stay updated</p>
            <button className="add-btn" onClick={() => setIsAddingCoin(true)}>
              <span className="material-icons">add</span>
              Add Coins
            </button>
          </div>
        ) : (
          <>
            {watchlistCoins.map(coin => (
              <div key={coin.id} className="coin-card">
                <div className="coin-header">
                  <div className="coin-info">
                    {coin.image && <img src={coin.image} alt={coin.name} className="coin-icon" />}
                    <div className="coin-name">
                      <h3>{coin.name}</h3>
                      <span className="symbol">{coin.symbol.toUpperCase()}</span>
                    </div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromWatchlist(coin.id)}
                    title="Remove from watchlist"
                  >
                    <span className="material-icons">close</span>
                  </button>
                </div>
                <div className="coin-price">
                  <div className="current-price">
                    ${coin.currentPrice.toLocaleString()}
                  </div>
                  <div className={`price-change ${coin.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
                    <span className="material-icons">
                      {coin.priceChange24h >= 0 ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                    {Math.abs(coin.priceChange24h).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
            <button className="add-coin-card" onClick={() => setIsAddingCoin(true)}>
              <span className="material-icons">add_circle_outline</span>
              <span>Add More Coins</span>
            </button>
          </>
        )}

        {isAddingCoin && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add Coins to Watchlist</h3>
                <button className="close-btn" onClick={() => setIsAddingCoin(false)}>
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="coin-search">
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="coin-list">
                {coins
                  .filter(coin => 
                    !watchlist.some(w => w.id === coin.id) &&
                    (coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(coin => (
                    <div key={coin.id} className="coin-list-item" onClick={() => {
                      addToWatchlist(coin);
                      setSearchQuery('');
                    }}>
                      <div className="coin-list-info">
                        <img src={coin.image} alt={coin.name} />
                        <div>
                          <h4>{coin.name}</h4>
                          <span>{coin.symbol.toUpperCase()}</span>
                        </div>
                      </div>
                      <button className="add-to-watchlist">
                        <span className="material-icons">add</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;