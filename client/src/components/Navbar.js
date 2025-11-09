import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const [theme, setTheme] = React.useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="logo">CryptoScope</h1>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/dashboard">
            <span className="material-icons">dashboard</span> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/portfolio">
            <span className="material-icons">account_balance_wallet</span> Portfolio
          </Link>
        </li>
        <li>
          <Link to="/watchlist">
            <span className="material-icons">star</span> Watchlist
          </Link>
        </li>
        <li>
          <Link to="/alerts">
            <span className="material-icons">notifications</span> Alerts
          </Link>
        </li>
        <li>
          <Link to="/converter">
            <span className="material-icons">currency_exchange</span> Converter
          </Link>
        </li>
        <li>
          <Link to="/about">
            <span className="material-icons">info</span> About
          </Link>
        </li>
      </ul>
      <div className="nav-right">
        <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
          <span className="material-icons">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
