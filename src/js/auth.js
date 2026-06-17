// ==================================================
// MeroGhar Authentication System
// ==================================================

console.log('MeroGhar Auth System Loaded');
const BASEURL = API_BASE_URL;

// Role → redirect path mapping
const ROLE_ROUTES = {
	user: '/src/pages/user.html',
	admin: '/src/pages/admin.html',
	vendor: '/src/pages/vendor.html',
};

//==================
// For Fetching Data
//==================
async function fetchData(url, req, httpMethod, contentType) {
	console.log(`Fetching: ${BASEURL}${url}`);
	console.log('Request data:', req);

	try {
		const response = await fetch(`${BASEURL}${url}`, {
			method: httpMethod,
			headers: {
				'Content-Type': contentType,
			},
			body: JSON.stringify(req),
		});

		const data = await response.json();
		console.log('Response from server:', data);
		console.log('Response OK:', response.ok);

		return { ok: response.ok, ...data };
	} catch (error) {
		console.error('Fetch error:', error);
		return { ok: false, message: error.message };
	}
}

// ==================================================
// LOGIN HANDLER
// ==================================================
document.addEventListener('DOMContentLoaded', function () {
	console.log('DOM loaded, checking for login form...');
	const loginForm = document.getElementById('loginForm');

	if (loginForm) {
		console.log('Login page detected, setting up handler');

		loginForm.addEventListener('submit', async function (e) {
			e.preventDefault();

			const email = document.getElementById('email')?.value.trim();
			const password = document.getElementById('password')?.value;
			const role = document.getElementById('role')?.value;

			console.log('Login attempt with:', { email, role });

			if (!email || !password) {
				alert('Please enter email and password');
				return;
			}

			try {
				// Sending correct format that backend expects
				const res = await fetchData(
					'/api/auth/login',
					{
						email: email, // ✅ Correct field name
						password: password, // ✅ Correct field name
						role: role, // ✅ Optional field
					},
					'POST',
					'application/json',
				);

				console.log('Login response:', res);

				if (!res.ok) {
					alert(res.message || 'Login failed');
					return;
				}

				// Check if user data exists in response
				if (!res.user) {
					console.error('No user data in response:', res);
					alert('Login failed: No user data received');
					return;
				}

				// Store user data (backend sends: id, name, email, role)
				const userData = {
					id: res.user.id,
					name: res.user.name,
					email: res.user.email,
					role: res.user.role,
					loggedIn: true,
				};

				localStorage.setItem('meroGharUser', JSON.stringify(userData));
				console.log('Stored user data:', userData);

				console.log('User role:', res.user.role);
				console.log('Redirecting to:', ROLE_ROUTES[res.user.role]);

				// Redirect based on role
				const redirectPath =
					ROLE_ROUTES[res.user.role] || '/src/pages/user.html';
				window.location.href = redirectPath;
			} catch (err) {
				console.error('Login error:', err);
				alert('Server error. Try again.');
			}
		});
	}
});

// ==================================================
// SIGNUP HANDLER
// ==================================================
document.addEventListener('DOMContentLoaded', function () {
	const signupForm = document.getElementById('signupForm');

	if (signupForm) {
		console.log('Signup page detected');

		signupForm.addEventListener('submit', async function (e) {
			e.preventDefault();

			const name = document.getElementById('signupName')?.value.trim();
			const email = document.getElementById('signupEmail')?.value.trim();
			const password = document.getElementById('signupPassword')?.value;
			const confirmPassword = document.getElementById(
				'signupConfirmPassword',
			)?.value;
			const phone = document.getElementById('phone')?.value;
			const role =
				document.querySelector('input[name="role"]:checked')?.value ||
				'user';

			console.log('Signup attempt:', { name, email, role });

			// Validation
			if (!name || !email || !password || !confirmPassword) {
				alert('Please fill in all fields.');
				return;
			}

			if (password !== confirmPassword) {
				alert('Passwords do not match.');
				return;
			}

			if (password.length < 6) {
				alert('Password must be at least 6 characters long.');
				return;
			}

			try {
				// Sending correct format that backend expects
				const res = await fetchData(
					'/api/auth/register',
					{
						name: name, // ✅ Correct field name (not 'username')
						email: email, // ✅ Correct field name
						password: password, // ✅ Correct field name
						role: role, // ✅ Correct field name,
						phone: phone,
					},
					'POST',
					'application/json',
				);

				console.log('Register response:', res);

				if (!res.ok) {
					alert(res.message || 'Signup failed');
					return;
				}

				alert('Signup successful! Please login.');
				window.location.href = '/src/pages/login.html';
			} catch (err) {
				console.error('Signup error:', err);
				alert('Server error. Try again.');
			}
		});
	}
});

// ==================================================
// LOGOUT FUNCTION
// ==================================================
window.logout = function () {
	localStorage.removeItem('meroGharUser');
	console.log('User logged out');
	window.location.href = '/src/pages/login.html';
};

// ==================================================
// CHECK AUTH STATUS
// ==================================================
window.checkAuth = function () {
	const user = JSON.parse(localStorage.getItem('meroGharUser') || '{}');
	if (!user.loggedIn) {
		console.log('User not authenticated, redirecting to login');
		window.location.href = '/src/pages/login.html';
		return null;
	}
	console.log('Authenticated user:', user);
	return user;
};

// ==================================================
// GET AUTH HEADERS FOR API CALLS
// ==================================================
window.getAuthHeaders = function () {
	const user = JSON.parse(localStorage.getItem('meroGharUser') || '{}');
	return {
		'Content-Type': 'application/json',
		Authorization: user.loggedIn ? `Bearer ${user.id}` : '',
	};
};

console.log('Authentication system ready');
