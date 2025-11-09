import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import Alerts from "./pages/Alerts";
import Converter from "./pages/Converter";
import About from "./pages/About";
import "./styles/global.css";
import { CryptoProvider } from './context/CryptoContext';

function App() {
  // Initialize theme from localStorage or default to dark
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <CryptoProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </CryptoProvider>
  );
}

export default App;
