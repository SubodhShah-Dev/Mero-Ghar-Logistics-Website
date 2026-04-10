import express from 'express';
import {
	getMyVendorProfile,
	updateMyVendorProfile,
	registerVendor,
	getVendorShipments,
	acceptShipment,
	startDelivery,
	completeDelivery,
	testVendorRoute,
	rejectShipment,
} from '../controllers/vendorController.js';

const router = express.Router();

router.get('/test', testVendorRoute);

// Make sure these routes are correctly defined
router.get('/profile', getMyVendorProfile);
router.put('/profile', updateMyVendorProfile);
router.post('/register', registerVendor);
router.get('/shipments', getVendorShipments);
router.put('/shipments/:id/accept', acceptShipment);
router.put('/shipments/:id/start', startDelivery);
router.put('/shipments/:id/complete', completeDelivery);
router.put('/shipments/:id/reject', rejectShipment);

export default router;
