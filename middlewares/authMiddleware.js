const axios = require('axios');

const shopifyMiddleware = (endpoints) => async (req, res, next) => {
  try {
    if (!Array.isArray(endpoints)) {
      throw new Error(`Endpoints should be an array of strings.`);
    }

    const auth = {
      username: process.env.SHOPIFY_API_KEY,
      password: process.env.SHOPIFY_API_PASSWORD,
    };

    req.shopifyData = {};

    // Fetch data for each endpoint
    for (const endpoint of endpoints) {
      try {
        const shopifyUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/${endpoint}`;
        console.log(`Fetching data from ${endpoint}...`);
        const response = await axios.get(shopifyUrl, { auth });
        req.shopifyData[endpoint] = response.data;
        console.log(`Fetched data from ${endpoint}`);
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error.message);
      }
    }

    console.log("All data fetched successfully (or skipped failed endpoints)");

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in Shopify middleware:', error.message);
    return res.status(500).json({
      message: 'Error in Shopify middleware',
      error: error.message,
    });
  }
};

module.exports = shopifyMiddleware;
