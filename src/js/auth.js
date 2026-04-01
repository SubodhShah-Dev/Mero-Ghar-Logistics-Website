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
};

// ─────────────────────────────────────────────
// LOGIN HANDLER
// ─────────────────────────────────────────────
if (window.location.pathname.endsWith('login.html')) {
	document
		.getElementById('loginForm')
		.addEventListener('submit', function (e) {
			e.preventDefault();

			const email = document.getElementById('email').value.trim();
			const password = document.getElementById('password').value;
			const role = document.getElementById('role').value;

			// Find matching user
			const matchedUser = USERS.find(
				(u) =>
					u.email === email &&
					u.password === password &&
					u.role === role,
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
}

//=== SIGNUP HANDLER (optional, can be removed if not needed) ===
if (window.location.pathname.endsWith('signup.html')) {
	console.log('running');
	document
		.getElementById('signupForm')
		?.addEventListener('submit', function (e) {
			e.preventDefault();
			const username = document.getElementById('signupName').value.trim();
			const email = document.getElementById('signupEmail').value.trim();
			const password = document.getElementById('signupPassword').value;
			const confirmPassword = document.getElementById(
				'signupConfirmPassword',
			).value;
			const role = document.querySelector(
				'input[name="role"]:checked',
			)?.value;

			if (!username || !email || !password || !confirmPassword) {
				console.log('this is running');
				alert('Please fill in all fields.');
				return;
			}

			if (password !== confirmPassword) {
				console.log('no this is running');
				alert('Passwords do not match.');
				return;
			}

			USERS.push({ email, password, role: role || 'user' });

			// Here you would typically send a request to your backend to create the user
			// For now, we'll just redirect to the login page
			window.location.href = '/src/pages/login.html';
		});
	console.log('still running then y not going to login page');
}
