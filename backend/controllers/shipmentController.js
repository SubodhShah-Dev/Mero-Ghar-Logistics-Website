import pool from '../config/db.js';

export const createShipment = async (req, res) => {
	try {
		console.log('=== CREATE SHIPMENT CALLED ===');
		console.log('Request body:', req.body);

		const {
			first_name,
			last_name,
			mobile_number,
			email,
			pickup_province,
			pickup_district,
			pickup_city,
			pickup_ward,
			pickup_floor,
			pickup_lane_access,
			drop_province,
			drop_district,
			drop_city,
			drop_ward,
			drop_floor,
			home_size,
			selected_items,
			fragile_items,
			vehicle_type,
			add_on_services,
			move_date,
			alternate_date,
			preferred_time_slot,
			move_reason,
			alternate_mobile,
			preferred_contact,
			payment_method,
			special_notes,
			how_found_us,
		} = req.body;

		const userId = req.headers['x-user-id'] || null;
		const booking_id = `MG-${Date.now()}`;

		// Let's do a simple insert first to test
		// Count: 33 columns, 33 values
		const [result] = await pool.execute(
			`INSERT INTO shipments (
                booking_id, 
                user_id, 
                first_name, 
                last_name, 
                mobile_number, 
                email,
                pickup_province, 
                pickup_district, 
                pickup_city, 
                pickup_ward, 
                pickup_floor, 
                pickup_lane_access,
                drop_province, 
                drop_district, 
                drop_city, 
                drop_ward, 
                drop_floor,
                home_size, 
                selected_items, 
                fragile_items,
                vehicle_type, 
                add_on_services,
                move_date, 
                alternate_date, 
                preferred_time_slot, 
                move_reason,
                alternate_mobile, 
                preferred_contact,
                payment_method, 
                special_notes, 
                how_found_us,
                approval_status, 
                status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				booking_id, // 1
				userId, // 2
				first_name, // 3
				last_name, // 4
				mobile_number, // 5
				email || null, // 6
				pickup_province || null, // 7
				pickup_district || null, // 8
				pickup_city || null, // 9
				pickup_ward || null, // 10
				pickup_floor || null, // 11
				pickup_lane_access || null, // 12
				drop_province || null, // 13
				drop_district || null, // 14
				drop_city || null, // 15
				drop_ward || null, // 16
				drop_floor || null, // 17
				home_size || null, // 18
				selected_items ? JSON.stringify(selected_items) : null, // 19
				fragile_items || null, // 20
				vehicle_type || null, // 21
				add_on_services ? JSON.stringify(add_on_services) : null, // 22
				move_date || null, // 23
				alternate_date || null, // 24
				preferred_time_slot || null, // 25
				move_reason || null, // 26
				alternate_mobile || null, // 27
				preferred_contact ? JSON.stringify(preferred_contact) : null, // 28
				payment_method || null, // 29
				special_notes || null, // 30
				how_found_us || null, // 31
				'pending', // 32 - approval_status
				'pending', // 33 - status
			],
		);

		console.log('Insert successful, ID:', result.insertId);

		res.status(201).json({
			success: true,
			message: 'Shipment created successfully',
			booking_id: booking_id,
			shipment_id: result.insertId,
		});
	} catch (error) {
		console.error('Error creating shipment:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to create shipment',
			error: error.message,
			code: error.code,
		});
	}
};

// Get all shipments
export const getAllShipments = async (req, res) => {
	try {
		const [rows] = await pool.execute(
			'SELECT * FROM shipments ORDER BY created_at DESC',
		);
		res.json({ success: true, shipments: rows });
	} catch (error) {
		console.error('Error fetching shipments:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch shipments',
		});
	}
};

// Get single shipment
export const getShipment = async (req, res) => {
	try {
		const [rows] = await pool.execute(
			'SELECT * FROM shipments WHERE id = ?',
			[req.params.id],
		);
		if (rows.length === 0) {
			return res
				.status(404)
				.json({ success: false, message: 'Shipment not found' });
		}
		res.json({ success: true, shipment: rows[0] });
	} catch (error) {
		console.error('Error fetching shipment:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch shipment',
		});
	}
};

// Get user shipments
export const getUserShipments = async (req, res) => {
	try {
		const [rows] = await pool.execute(
			'SELECT * FROM shipments WHERE user_id = ? ORDER BY created_at DESC',
			[req.params.userId],
		);
		res.json({ success: true, shipments: rows });
	} catch (error) {
		console.error('Error fetching user shipments:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch user shipments',
		});
	}
};

// Update shipment status
export const updateShipmentStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status, final_quote } = req.body;

		const shipmentId = parseInt(id);

		let query = 'UPDATE shipments SET status = ?';
		const params = [status];

		if (final_quote !== null && final_quote !== undefined) {
			query += ', final_quote = ?';
			params.push(final_quote);
		}

		query += ' WHERE id = ?';
		params.push(shipmentId);

		const [result] = await pool.execute(query, params);

		if (result.affectedRows === 0) {
			return res
				.status(404)
				.json({ success: false, message: 'Shipment not found' });
		}

		res.json({
			success: true,
			message: 'Shipment status updated successfully',
		});
	} catch (error) {
		console.error('Error updating shipment:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to update shipment status',
		});
	}
};
