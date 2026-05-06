import axios from "axios";

export const getTopCryptos = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
          sparkline: false,
        },
      }
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching crypto data:", error.message);
    res.status(500).json({ error: "Failed to fetch crypto prices" });
  }
};
