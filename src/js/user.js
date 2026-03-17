// ── HOME PAGE RETURN ─────────────────────────────────
(function goHome() {
	const homeBtn = document.querySelector('#homeBtn');
	homeBtn.addEventListener('click', () => {
		window.location.href = 'index.html'; // Replace with your home page URL
	});
})();

// ── FORM STEPS ───────────────────────────────────────
let fCur = 1;
const fTotal = 5;
const fPW = { 1: '20%', 2: '40%', 3: '60%', 4: '80%', 5: '100%' };

function fGoTo(n) {
	if (n < 1 || n > fTotal) return;
	const cur = document.getElementById('fp' + fCur);
	if (cur) cur.classList.add('hidden');
	fCur = n;
	const next = document.getElementById('fp' + n);
	if (next) {
		next.classList.remove('hidden');
		next.classList.remove('panel-active');
		void next.offsetWidth;
		next.classList.add('panel-active');
	}
	document.getElementById('formProgress').style.width = fPW[n] || '100%';

	for (let i = 1; i <= fTotal; i++) {
		const el = document.getElementById('sc' + i);
		el.className =
			's-circle ' + (i < n ? 's-done' : i === n ? 's-active' : 's-idle');
		el.textContent = i < n ? '✓' : i;
	}

	[
		['cn12', 1],
		['cn23', 2],
		['cn34', 3],
		['cn45', 4],
	].forEach(([id, si]) => {
		const c = document.getElementById(id);
		c.classList.toggle('bg-forest-600', si < n);
		c.classList.toggle('bg-cream-300', si >= n);
	});

	for (let i = 1; i <= fTotal; i++) {
		const l = document.getElementById('fl' + i);
		l.classList.toggle('text-forest-800', i === n);
		l.classList.toggle('text-gray-400', i !== n);
	}

	document
		.getElementById('booking')
		.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function submitForm() {
	document.getElementById('fp5').classList.add('hidden');
	document.getElementById('fpConfirm').classList.remove('hidden');
	document.getElementById('formProgress').style.width = '100%';
	for (let i = 1; i <= fTotal; i++) {
		const el = document.getElementById('sc' + i);
		el.className = 's-circle s-done';
		el.textContent = '✓';
	}
	document.getElementById('bookId').textContent =
		Math.floor(10000 + Math.random() * 90000) +
		'-' +
		new Date().getFullYear();
	document
		.getElementById('booking')
		.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetForm() {
	document.getElementById('fpConfirm').classList.add('hidden');
	fCur = 1;
	fGoTo(1);
}

// ── ITEM CHIPS (tap toggle) ───────────────────────────
function tChip(el) {
	el.classList.toggle('on');
	const lbl = el.querySelector('.chip-lbl');
	if (lbl) lbl.style.color = el.classList.contains('on') ? '#f5a623' : '';
}

// Radio-style chips (home size, time slot)
document
	.querySelectorAll('label.item-chip input[type=radio]')
	.forEach((inp) => {
		inp.addEventListener('change', () => {
			const name = inp.name;
			document
				.querySelectorAll(`label.item-chip input[name="${name}"]`)
				.forEach((r) => {
					r.closest('label').classList.remove('on');
					const cl = r.closest('label').querySelector('.chip-lbl');
					if (cl) cl.style.color = '';
				});
			inp.closest('label').classList.add('on');
			const cl = inp.closest('label').querySelector('.chip-lbl');
			if (cl) cl.style.color = '#f5a623';
		});
	});

// ── VEHICLE SELECTION ─────────────────────────────────
function pickVeh(inp) {
	document
		.querySelectorAll('.v-card')
		.forEach((c) => c.classList.remove('chosen'));
	const c = inp.closest('label').querySelector('.v-card');
	if (c) c.classList.add('chosen');
}

// ── PAYMENT SELECTION ─────────────────────────────────
function pickPay(card) {
	document.querySelectorAll('.pay-card').forEach((c) => {
		c.classList.remove('picked');
		const d = c.querySelector('.pay-dot');
		if (d) {
			d.classList.remove('bg-saffron-400', 'border-forest-900');
			d.classList.add('border-cream-300');
		}
	});
	card.classList.add('picked');
	const d = card.querySelector('.pay-dot');
	if (d) {
		d.classList.add('bg-saffron-400', 'border-forest-900');
		d.classList.remove('border-cream-300');
	}
}

// ── DISTRICTS ─────────────────────────────────────────
const DISTRICTS = {
	1: [
		'Bhojpur',
		'Dhankuta',
		'Ilam',
		'Jhapa',
		'Khotang',
		'Morang',
		'Okhaldhunga',
		'Panchthar',
		'Sankhuwasabha',
		'Solukhumbu',
		'Sunsari',
		'Taplejung',
		'Terhathum',
		'Udayapur',
	],
	2: [
		'Bara',
		'Dhanusha',
		'Mahottari',
		'Parsa',
		'Rautahat',
		'Saptari',
		'Sarlahi',
		'Siraha',
	],
	3: [
		'Bhaktapur',
		'Chitwan',
		'Dhading',
		'Dolakha',
		'Kathmandu',
		'Kavrepalanchok',
		'Lalitpur',
		'Makwanpur',
		'Nuwakot',
		'Ramechhap',
		'Rasuwa',
		'Sindhuli',
		'Sindhupalchok',
	],
	4: [
		'Baglung',
		'Gorkha',
		'Kaski',
		'Lamjung',
		'Manang',
		'Mustang',
		'Myagdi',
		'Nawalpur',
		'Parbat',
		'Syangja',
		'Tanahun',
	],
	5: [
		'Arghakhanchi',
		'Banke',
		'Bardiya',
		'Dang',
		'Eastern Rukum',
		'Gulmi',
		'Kapilvastu',
		'Nawalparasi West',
		'Palpa',
		'Pyuthan',
		'Rolpa',
		'Rupandehi',
	],
	6: [
		'Dailekh',
		'Dolpa',
		'Humla',
		'Jajarkot',
		'Jumla',
		'Kalikot',
		'Mugu',
		'Salyan',
		'Surkhet',
		'Western Rukum',
	],
	7: [
		'Achham',
		'Baitadi',
		'Bajhang',
		'Bajura',
		'Dadeldhura',
		'Darchula',
		'Doti',
		'Kailali',
		'Kanchanpur',
	],
};

function loadDist(prefix) {
	const pVal = document.getElementById(prefix + 'Prov').value;
	const sel = document.getElementById(prefix + 'Dist');
	sel.innerHTML = '<option value="">— Select District —</option>';
	if (pVal && DISTRICTS[pVal]) {
		DISTRICTS[pVal].forEach((d) => {
			const o = document.createElement('option');
			o.value = d;
			o.textContent = d;
			sel.appendChild(o);
		});
	}
}
