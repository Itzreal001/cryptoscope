import React from "react";
import "../styles/about.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-card">
        <h1>About CryptoScope</h1>
        <p className="lead">A professional crypto dashboard and toolkit — track markets, convert values, and explore coin details in one place.</p>

        <div className="split">
          <section>
            <h3>Features</h3>
            <ul>
              <li>Live price feed for top cryptocurrencies (updated from CoinGecko)</li>
              <li>Crypto ↔ Crypto and Crypto ↔ Fiat converter with swap support</li>
              <li>Search, sort and filter on the dashboard for fast discovery</li>
              <li>Responsive, accessible UI designed for traders and enthusiasts</li>
            </ul>
          </section>

          <section>
            <h3>Tech & Data</h3>
            <ul>
              <li>React + React Router for client navigation</li>
              <li>CoinGecko public API for market data</li>
              <li>Optional server proxy available in <code>server/</code></li>
              <li>Open-source: adapt and extend the project for your needs</li>
            </ul>
          </section>
        </div>

        <div className="contact">
          <h3>Notes</h3>
          <p>This app uses public APIs and sample conversion rates for demo purposes. For production use, integrate a dedicated FX rates provider and add API key management on the server.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
