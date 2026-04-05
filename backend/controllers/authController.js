import {
	createUser,
	findUserByEmail,
	verifyPassword,
	getAllUsers,
} from '../models/authModel.js';

export const registerUser = async (req, res) => {
	try {
		const { name, email, password, role, phone } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Name, email, and password are required',
			});
		}

		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'User already exists',
			});
		}

		const newUser = await createUser({
			name,
			email,
			password,
			role,
			phone,
		});

		res.status(201).json({
			success: true,
			message: 'User successfully registered',
			user: newUser,
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({
			success: false,
			message: 'Server error',
			error: error.message,
		});
	}
};

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: 'Email and password required',
			});
		}

		const user = await findUserByEmail(email);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		const isValid = await verifyPassword(password, user.password);
		if (!isValid) {
			return res.status(401).json({
				success: false,
				message: 'Invalid password',
			});
		}

		const { password: _, ...userWithoutPassword } = user;

		res.json({
			success: true,
			message: 'Login successful',
			user: userWithoutPassword,
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({
			success: false,
			message: 'Server error',
		});
	}
};

export const getUsers = async (req, res) => {
	try {
		const users = await getAllUsers();
		res.json({
			success: true,
			users,
		});
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({
			success: false,
			message: 'Server error',
		});
	}
};
