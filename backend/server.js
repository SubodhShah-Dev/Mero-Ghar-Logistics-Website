import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import shipmentRoute from './routes/shipmentRoute.js';
import adminShipmentRoute from './routes/adminShipmentRoute.js';
import vendorRoute from './routes/vendorRoute.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes - ORDER MATTERS! More specific routes first
app.use('/api/auth', authRoute);
app.use('/api/shipment', shipmentRoute);
app.use('/api/admin', adminShipmentRoute);
app.use('/api/vendor', vendorRoute);

// Test route to check if server is running
app.get('/api/test', (req, res) => {
	res.json({ message: 'API is working!' });
});

app.get('/', (req, res) => {
	res.json('Server running');
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(`Available routes:`);
	console.log(`  - POST /api/auth/register`);
	console.log(`  - POST /api/auth/login`);
	console.log(`  - GET  /api/vendor/profile`);
	console.log(`  - POST /api/vendor/register`);
	console.log(`  - GET  /api/vendor/shipments`);
});
