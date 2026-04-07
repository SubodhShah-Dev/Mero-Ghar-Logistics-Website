import express from 'express';
import pool from '../config/db.js';
import { processDummyPayment } from '../services/dummyPaymentService.js';

const router = express.Router();

router.post(
	'/dummy/process',
	express.urlencoded({ extended: true }),
	async (req, res) => {
		console.log('=== DUMMY PAYMENT POST ===');
		console.log('Request body:', req.body);

		const result = await processDummyPayment(req.body);

		if (result.success) {
			try {
				await pool.execute(
					`UPDATE shipments SET payment_status = 'paid', status = 'confirmed' WHERE transaction_id = ?`,
					[result.transaction_id],
				);
				console.log(
					'✅ Database updated for transaction:',
					result.transaction_id,
				);
			} catch (dbError) {
				console.error('DB update error:', dbError);
			}

			// Send a clean success page (no redirect to avoid CORS)
			const frontendUrl =
				process.env.FRONTEND_URL || 'http://localhost:5173';
			res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Successful - MeroGhar</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        background: linear-gradient(135deg, #0b1510 0%, #1a371a 100%);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        padding: 20px;
                    }
                    .success-card {
                        background: #111d16;
                        border-radius: 24px;
                        border: 1px solid rgba(76,175,125,0.4);
                        padding: 48px 40px;
                        max-width: 480px;
                        width: 100%;
                        text-align: center;
                        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
                        animation: fadeIn 0.4s ease;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.98); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .checkmark {
                        width: 80px;
                        height: 80px;
                        background: #4caf7d;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 24px;
                        font-size: 48px;
                    }
                    h2 {
                        color: #4caf7d;
                        font-size: 28px;
                        margin-bottom: 12px;
                    }
                    p {
                        color: rgba(238,242,238,0.7);
                        margin-bottom: 24px;
                        line-height: 1.5;
                    }
                    .booking-id {
                        background: #16261d;
                        padding: 12px;
                        border-radius: 12px;
                        font-family: monospace;
                        font-size: 14px;
                        color: #f8c06a;
                        margin: 20px 0;
                        word-break: break-all;
                    }
                    .btn-group {
                        display: flex;
                        gap: 12px;
                        justify-content: center;
                        margin-top: 20px;
                    }
                    .btn {
                        background: #f8c06a;
                        color: #0b1510;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 12px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        text-decoration: none;
                        display: inline-block;
                    }
                    .btn-outline {
                        background: transparent;
                        border: 1px solid rgba(248,192,106,0.3);
                        color: #f8c06a;
                    }
                    .btn:hover { opacity: 0.85; }
                </style>
            </head>
            <body>
                <div class="success-card">
                    <div class="checkmark">✅</div>
                    <h2>Payment Successful!</h2>
                    <p>Your booking has been confirmed. A coordinator will contact you within 2 hours.</p>
                    <div class="booking-id">Booking ID: ${result.transaction_id}</div>
                    <div class="btn-group">
                        <button class="btn" onclick="window.location.href='${frontendUrl}/src/pages/user.html'">Go to Dashboard</button>
                        <button class="btn btn-outline" onclick="window.location.href='${frontendUrl}'">Home</button>
                    </div>
                </div>
                <script>localStorage.setItem('lastBookingId', '${result.transaction_id}');</script>
            </body>
            </html>
        `);
		} else {
			const frontendUrl =
				process.env.FRONTEND_URL || 'http://localhost:5173';
			res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Failed - MeroGhar</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Arial, sans-serif;
                        background: linear-gradient(135deg, #0b1510 0%, #1a371a 100%);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        padding: 20px;
                    }
                    .error-card {
                        background: #111d16;
                        border-radius: 24px;
                        border: 1px solid rgba(224,94,94,0.4);
                        padding: 48px 40px;
                        max-width: 480px;
                        width: 100%;
                        text-align: center;
                    }
                    .error-icon {
                        width: 80px;
                        height: 80px;
                        background: #e05e5e;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 24px;
                        font-size: 48px;
                    }
                    h2 { color: #e05e5e; margin-bottom: 12px; }
                    .message { background: #16261d; padding: 12px; border-radius: 12px; margin: 20px 0; color: #e05e5e; }
                    button {
                        background: #f8c06a;
                        color: #0b1510;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 12px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                    }
                </style>
            </head>
            <body>
                <div class="error-card">
                    <div class="error-icon">❌</div>
                    <h2>Payment Failed</h2>
                    <div class="message">${result.message || 'Something went wrong. Please try again.'}</div>
                    <button onclick="window.location.href='${frontendUrl}/src/pages/booking.html'">Try Again</button>
                </div>
            </body>
            </html>
        `);
		}
	},
);

export default router;
