import express from 'express';
import {
	getPendingShipmentsList,
	getShipmentsByStatus,
	approveShipmentRequest,
	rejectShipmentRequest,
} from '../controllers/adminShipmentController.js';
import {
	getVendors,
	updateVendorStatusCtrl,
	getActiveVendorsList,
} from '../controllers/vendorController.js';

const router = express.Router();

router.get('/shipments/pending', getPendingShipmentsList);
router.get('/shipments/status/:status', getShipmentsByStatus);
router.put('/shipments/:id/approve', approveShipmentRequest);
router.put('/shipments/:id/reject', rejectShipmentRequest);
router.get('/vendors', getVendors);
router.get('/vendors/active', getActiveVendorsList);
router.put('/vendors/:id/status', updateVendorStatusCtrl);

export default router;
