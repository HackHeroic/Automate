const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const shopifyMiddleware = require('./middlewares/authMiddleware');
const { connectDb } = require('./database/config');
const orderRoutes = require('./routes/orderRelated');
dotenv.config();

const app = express();

// Endpoints to fetch from Shopify
const endpoints = ['products.json', 'shop.json','orders.json'];

app.use(express.json());
app.use(cors());
app.use(shopifyMiddleware(endpoints));


connectDb();

app.use('/order',orderRoutes);

// Route to test Shopify data
app.get('/', async (req, res) => {
  try {
    console.log("Fetched Shopify data:", req.shopifyData);
    res.json({ shopifyData: req.shopifyData });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: `Error getting all data` });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
