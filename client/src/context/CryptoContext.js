import React, { createContext, useContext, useState, useEffect } from 'react';

const CryptoContext = createContext();

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};

export const CryptoProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('portfolio');
    return saved ? JSON.parse(saved) : [];
  });

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Fetch coin data
  const fetchCoins = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=true'
      );
      const data = await response.json();
      setCoins(data);
    } catch (err) {
      setError('Failed to fetch coin data. Please try again later.');
    }
    setLoading(false);
  };

  // Portfolio management
  const addToPortfolio = (coin, amount, buyPrice) => {
    setPortfolio(prev => {
      const existing = prev.find(item => item.id === coin.id);
      if (existing) {
        return prev.map(item =>
          item.id === coin.id
            ? {
                ...item,
                amount: Number(item.amount) + Number(amount),
                avgBuyPrice: (item.avgBuyPrice * item.amount + buyPrice * amount) / (item.amount + amount)
              }
            : item
        );
      }
      return [...prev, { 
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        amount: Number(amount),
        avgBuyPrice: Number(buyPrice),
        addedAt: new Date().toISOString()
      }];
    });
  };

  const removeFromPortfolio = (coinId) => {
    setPortfolio(prev => prev.filter(item => item.id !== coinId));
  };

  // Watchlist management
  const addToWatchlist = (coin) => {
    setWatchlist(prev => {
      if (prev.some(item => item.id === coin.id)) return prev;
      return [...prev, {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        addedAt: new Date().toISOString()
      }];
    });
  };

  const removeFromWatchlist = (coinId) => {
    setWatchlist(prev => prev.filter(item => item.id !== coinId));
  };

  // Alert management
  const addAlert = (coin, targetPrice, condition) => {
    setAlerts(prev => [...prev, {
      id: Date.now().toString(),
      coinId: coin.id,
      coinSymbol: coin.symbol,
      coinName: coin.name,
      targetPrice: Number(targetPrice),
      condition, // 'above' or 'below'
      createdAt: new Date().toISOString(),
      isActive: true
    }]);
  };

  const removeAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const toggleAlert = (alertId) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, isActive: !alert.isActive }
          : alert
      )
    );
  };

  // Check price alerts
  useEffect(() => {
    if (!coins.length || !alerts.length) return;

    const activeAlerts = alerts.filter(alert => alert.isActive);
    if (!activeAlerts.length) return;

    activeAlerts.forEach(alert => {
      const coin = coins.find(c => c.id === alert.coinId);
      if (!coin) return;

      const currentPrice = coin.current_price;
      const shouldNotify =
        (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && currentPrice <= alert.targetPrice);

      if (shouldNotify && Notification.permission === 'granted') {
        new Notification(`Price Alert: ${coin.symbol.toUpperCase()}`, {
          body: `${coin.name} has reached ${currentPrice} USD`,
          icon: coin.image
        });
        toggleAlert(alert.id); // Deactivate the alert after triggering
      }
    });
  }, [coins, alerts]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Auto-refresh coin data
  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const value = {
    coins,
    loading,
    error,
    portfolio,
    watchlist,
    alerts,
    addToPortfolio,
    removeFromPortfolio,
    addToWatchlist,
    removeFromWatchlist,
    addAlert,
    removeAlert,
    toggleAlert,
    fetchCoins
  };

  return <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>;
};