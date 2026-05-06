import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import '../styles/alerts.css';

const Alerts = () => {
  const { alerts, coins, addAlert, removeAlert, toggleAlert } = useCrypto();
  const [isAddingAlert, setIsAddingAlert] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState('above');

  const handleAddAlert = (e) => {
    e.preventDefault();
    const coin = coins.find((c) => c.id === selectedCoin);
    if (coin && targetPrice) {
      addAlert(coin, targetPrice, condition);
      setIsAddingAlert(false);
      setSelectedCoin('');
      setTargetPrice('');
      setCondition('above');
    }
  };

  return (
    <div className="alerts-page">
      <div className="alerts-header">
        <h2>Price Alerts</h2>
        <button className="add-alert-btn" onClick={() => setIsAddingAlert(true)}>
          <span className="material-icons">add_alert</span>
          New Alert
        </button>
      </div>

      <div className="alerts-grid">
        {alerts.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">notifications_none</span>
            <h3>No active alerts</h3>
            <p>Set up price alerts to get notified of market movements</p>
            <button className="setup-btn" onClick={() => setIsAddingAlert(true)}>
              <span className="material-icons">add</span>
              Set Up Alert
            </button>
          </div>
        ) : (
          alerts.map((alert) => {
            const coin = coins.find((c) => c.id === alert.coinId);
            const currentPrice = coin?.current_price || 0;
            const priceDistance =
              ((alert.targetPrice - currentPrice) / currentPrice) * 100;

            return (
              <div key={alert.id} className="alert-card">
                <div className="alert-header">
                  <div className="alert-title">
                    <h3>{alert.coinName}</h3>
                    <span className="symbol">
                      {alert.coinSymbol.toUpperCase()}
                    </span>
                  </div>
                  <div className="alert-actions">
                    <button
                      className={`toggle-btn ${alert.isActive ? 'active' : ''}`}
                      onClick={() => toggleAlert(alert.id)}
                      title={alert.isActive ? 'Disable alert' : 'Enable alert'}
                    >
                      <span className="material-icons">
                        {alert.isActive
                          ? 'notifications_active'
                          : 'notifications_off'}
                      </span>
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => removeAlert(alert.id)}
                      title="Delete alert"
                    >
                      <span className="material-icons">close</span>
                    </button>
                  </div>
                </div>

                <div className="alert-details">
                  <div className="detail">
                    <span>Condition</span>
                    <strong>
                      Price {alert.condition} $
                      {alert.targetPrice.toLocaleString()}
                    </strong>
                  </div>
                  <div className="detail">
                    <span>Current Price</span>
                    <strong>${currentPrice.toLocaleString()}</strong>
                  </div>
                  <div className="detail">
                    <span>Distance</span>
                    <strong>{Math.abs(priceDistance).toFixed(2)}%</strong>
                  </div>
                  <div className="detail">
                    <span>Status</span>
                    <strong
                      className={alert.isActive ? 'active' : 'inactive'}
                    >
                      {alert.isActive ? 'Active' : 'Inactive'}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isAddingAlert && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create Price Alert</h3>
              <button
                className="close-btn"
                onClick={() => setIsAddingAlert(false)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={handleAddAlert}>
              <div className="form-group">
                <label>Select Coin</label>
                <select
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  required
                >
                  <option value="">Choose a coin...</option>
                  {coins.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Alert Condition</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="above"
                      checked={condition === 'above'}
                      onChange={(e) => setCondition(e.target.value)}
                    />
                    Price Above
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="below"
                      checked={condition === 'below'}
                      onChange={(e) => setCondition(e.target.value)}
                    />
                    Price Below
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Target Price (USD)</label>
                <input
                  type="number"
                  step="any"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Enter target price"
                  required
                />
              </div>

              <button type="submit" className="add-btn">
                <span className="material-icons">add_alert</span>
                Create Alert
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
