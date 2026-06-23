// ── NAVBAR SCROLL ─────────────────────────────────────
window.addEventListener('scroll', () => {
	var navbar = document.getElementById('navbar');
	if (navbar) {
		navbar.style.boxShadow =
			window.scrollY > 20 ? '0 4px 30px rgba(0,0,0,0.4)' : 'none';
	}
}, { passive: true });

// ── MOBILE MENU ───────────────────────────────────────
window.toggleMenu = function () {
	var menu = document.getElementById('mobileMenu');
	if (menu) menu.classList.toggle('open');
};

// ── FAQ ───────────────────────────────────────────────
window.toggleFaq = function (btn) {
	if (!btn) return;
	var body = btn.nextElementSibling;
	var chev = btn.querySelector('.faq-chevron');
	if (!body || !chev) return;
	var isOpen = body.classList.contains('open');
	document.querySelectorAll('.faq-body').forEach(function (b) { b.classList.remove('open'); });
	document.querySelectorAll('.faq-chevron').forEach(function (c) { c.classList.remove('rotated'); });
	if (!isOpen) {
		body.classList.add('open');
		chev.classList.add('rotated');
	}
};
