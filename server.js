const express = require('express');
const path = require('path'); 
const app = express();

const PORT = process.env.PORT || 8080; 

app.use(express.json());

const rootDir = process.cwd();
app.use(express.static(rootDir));

// Global array to store orders temporarily in the server memory
let globalOrders = [];

// API ENDPOINT 1: Customers use this to send orders to the server
app.post('/api/orders', (req, res) => {
    const { table, items } = req.body;
    
    if (!table || !items || Object.keys(items).length === 0) {
        return res.status(400).json({ success: false, message: "Invalid order data" });
    }

    const newOrder = {
        id: Date.now().toString(), // Unique order ID
        table: table,
        items: items,
        timestamp: new Date().toLocaleTimeString(),
        status: "pending"
    };

    globalOrders.push(newOrder);
    console.log(`[Order Received] Table ${table} placed an order.`);
    res.status(200).json({ success: true, order: newOrder });
});

// API ENDPOINT 2: Kitchen dashboard pulls fresh active orders from here
app.get('/api/orders', (req, res) => {
    res.json(globalOrders);
});

// API ENDPOINT 3: Kitchen clears an order when completed
app.post('/api/orders/complete', (req, res) => {
    const { orderId } = req.body;
    globalOrders = globalOrders.filter(order => order.id !== orderId);
    res.json({ success: true });
});

// Smart function to try multiple filenames in case of server caching bugs
function sendHtmlFile(res, fileName) {
    res.sendFile(path.join(rootDir, fileName.toLowerCase()), (err) => {
        if (err) {
            const capitalized = fileName.charAt(0).toUpperCase() + fileName.slice(1);
            res.sendFile(path.join(rootDir, capitalized), (err2) => {
                if (err2) {
                    res.sendFile(path.join(rootDir, 'ustomer.html'), (err3) => {
                        if (err3) {
                            res.status(404).send("Error: The server cannot find your HTML file.");
                        }
                    });
                }
            });
        }
    });
}

// Map the HTML routes
app.get('/', (req, res) => sendHtmlFile(res, 'customer.html'));
app.get('/customer', (req, res) => sendHtmlFile(res, 'customer.html'));
app.get('/kitchen', (req, res) => sendHtmlFile(res, 'kitchen.html'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
