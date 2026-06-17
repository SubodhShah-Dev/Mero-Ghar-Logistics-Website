// ── NAVBAR SCROLL ─────────────────────────────────────
window.addEventListener('scroll', () => {
	document.getElementById('navbar').style.boxShadow =
		window.scrollY > 20 ? '0 4px 30px rgba(0,0,0,0.4)' : 'none';
});

// ── MOBILE MENU ───────────────────────────────────────
window.toggleMenu = function () {
	document.getElementById('mobileMenu').classList.toggle('open');
};

// ── FAQ ───────────────────────────────────────────────
window.toggleFaq = function (btn) {
	const body = btn.nextElementSibling;
	const chev = btn.querySelector('.faq-chevron');
	const isOpen = body.classList.contains('open');
	document
		.querySelectorAll('.faq-body')
		.forEach((b) => b.classList.remove('open'));
	document
		.querySelectorAll('.faq-chevron')
		.forEach((c) => c.classList.remove('rotated'));
	if (!isOpen) {
		body.classList.add('open');
		chev.classList.add('rotated');
	}
}
