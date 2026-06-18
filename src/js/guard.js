// ─────────────────────────────────────────────
// PAGE GUARD – add to all protected pages
// Usage: <script src="../js/guard.js" data-role="admin"></script>
// ─────────────────────────────────────────────
(function () {
	const session = safeParse(localStorage.getItem('meroGharUser'), null);
	const requiredRole = document.currentScript.getAttribute('data-role');

	if (!session || !session.loggedIn) {
		window.location.href = '/src/pages/login.html';
		return;
	}

	if (requiredRole && session.role !== requiredRole) {
		showToast("Access denied: You don't have permission to view this page.", 'red');
		setTimeout(function () {
			window.location.href = '/src/pages/login.html';
		}, 1500);
	}
})();
