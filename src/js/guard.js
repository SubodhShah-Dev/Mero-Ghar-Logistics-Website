// ─────────────────────────────────────────────
// PAGE GUARD – add to all protected pages
// Usage: <script src="../js/guard.js" data-role="admin"></script>
// ─────────────────────────────────────────────
(function () {
	const session = JSON.parse(localStorage.getItem('meroGharUser') || 'null');
	const requiredRole = document.currentScript.getAttribute('data-role');

	if (!session || !session.loggedIn) {
		// Not logged in → back to login
		window.location.href = '/login.html';
		return;
	}

	if (requiredRole && session.role !== requiredRole) {
		// Wrong role → back to login
		alert("Access denied: You don't have permission to view this page.");
		window.location.href = '/login.html';
	}
})();
