import express from 'express';
import {
	createShipment,
	getShipment,
	getAllShipments,
	getUserShipments,
	updateShipmentStatus,
} from '../controllers/shipmentController.js';

const router = express.Router();

// ✅ Specific routes first
router.post('/create', createShipment);
router.get('/all', getAllShipments);
router.get('/user/:userId', getUserShipments);

// ✅ Dynamic routes last
router.get('/:id', getShipment);
router.put('/:id/status', updateShipmentStatus);

export default router;
