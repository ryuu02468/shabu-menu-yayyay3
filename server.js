const express = require('express');
const path = require('path'); 
const app = express();

const PORT = process.env.PORT || 8080; 

app.use(express.json());

const rootDir = process.cwd();
app.use(express.static(rootDir));

// Smart function to try multiple filenames in case of server caching bugs
function sendHtmlFile(res, fileName) {
    // Try Option 1: Exact lowercase (e.g., customer.html)
    res.sendFile(path.join(rootDir, fileName.toLowerCase()), (err) => {
        if (err) {
            // Try Option 2: First letter capitalized (e.g., Kitchen.html)
            const capitalized = fileName.charAt(0).toUpperCase() + fileName.slice(1);
            res.sendFile(path.join(rootDir, capitalized), (err2) => {
                if (err2) {
                    // Try Option 3: Fallback for the previous 'ustomer.html' typo
                    res.sendFile(path.join(rootDir, 'ustomer.html'), (err3) => {
                        if (err3) {
                            res.status(404).send("Error: The server cannot find your HTML file in the repository layout.");
                        }
                    });
                }
            });
        }
    });
}

// Map the routes to the smart file checker
app.get('/', (req, res) => {
    sendHtmlFile(res, 'customer.html');
});

app.get('/customer', (req, res) => {
    sendHtmlFile(res, 'customer.html');
});

app.get('/kitchen', (req, res) => {
    sendHtmlFile(res, 'kitchen.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
