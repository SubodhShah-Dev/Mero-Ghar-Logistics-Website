// ─────────────────────────────────────────────
// MOCK USER DATABASE (replace with real API later)
// ─────────────────────────────────────────────
const USERS = [
	{ email: 'user@meroghar.com', password: 'user123', role: 'user' },
	{ email: 'admin@meroghar.com', password: 'admin123', role: 'admin' },
	{ email: 'vendor@meroghar.com', password: 'vendor123', role: 'vendor' },
	{ email: 'manager@meroghar.com', password: 'manager123', role: 'manager' },
];

// Role → redirect path mapping
const ROLE_ROUTES = {
	user: '/src/pages/user.html',
	admin: '/src/pages/admin.html',
	vendor: '/src/pages/vendor.html',
	manager: '/src/pages/manager.html',
};

// ─────────────────────────────────────────────
// LOGIN HANDLER
// ─────────────────────────────────────────────
document.getElementById('loginForm').addEventListener('submit', function (e) {
	e.preventDefault();

	const email = document.getElementById('email').value.trim();
	const password = document.getElementById('password').value;
	const role = document.getElementById('role').value;

	// Find matching user
	const matchedUser = USERS.find(
		(u) => u.email === email && u.password === password && u.role === role,
	);

	if (!matchedUser) {
		alert('Invalid email or password or role.');
		return;
	}

	// ✅ Store session in localStorage
	localStorage.setItem(
		'meroGharUser',
		JSON.stringify({
			email: matchedUser.email,
			role: matchedUser.role,
			loggedIn: true,
		}),
	);

	// ✅ Redirect based on role
	window.location.href = ROLE_ROUTES[matchedUser.role];
});
