// ─────────────────────────────────────────────
// PAGE GUARD – add to all protected pages
// Usage: <script src="../js/guard.js" data-role="admin"></script>
// ─────────────────────────────────────────────
(function () {
	const session = JSON.parse(localStorage.getItem('meroGharUser') || 'null');
	const requiredRole = document.currentScript.getAttribute('data-role');

	if (!session || !session.loggedIn) {
		window.location.href = '/src/pages/login.html';
		return;
	}

	if (requiredRole && session.role !== requiredRole) {
		alert("Access denied: You don't have permission to view this page.");
		window.location.href = '/src/pages/login.html';
	}
})();
