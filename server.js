const express = require('express');
const path = require('path'); 
const app = express();

// Render automatically assigns a port via process.env.PORT. Falls back to 8080 locally.
const PORT = process.env.PORT || 8080; 

app.use(express.json());

// Serve all static assets (CSS, client-side JS, images) from your root folder
app.use(express.static(path.join(__dirname, '.')));

// 1. CUSTOMER ROUTE: When someone visits the main link (or /customer)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'customer.html'));
});

app.get('/customer', (req, res) => {
    res.sendFile(path.join(__dirname, 'customer.html'));
});

// 2. KITCHEN ROUTE: When the kitchen staff visits /kitchen
app.get('/kitchen', (req, res) => {
    res.sendFile(path.join(__dirname, 'kitchen.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
