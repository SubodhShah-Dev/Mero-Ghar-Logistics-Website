// ── AUTH CHECK AND LOGOUT FOR USER (ADD AT VERY TOP OF user.js) ──
function checkAuth() {
	const user = JSON.parse(localStorage.getItem('meroGharUser') || '{}');
	if (!user.loggedIn) {
		window.location.href = '/src/pages/login.html';
		return null;
	}
	return user;
}

function logout() {
	if (confirm('Are you sure you want to logout?')) {
		localStorage.removeItem('meroGharUser');
		alert('Logged out successfully');
		window.location.href = '/src/pages/login.html';
	}
}

function addLogoutButton() {
	const homeBtn = document.getElementById('homeBtn');
	if (homeBtn && !document.getElementById('user-logout-btn')) {
		const logoutBtn = document.createElement('button');
		logoutBtn.id = 'user-logout-btn';
		logoutBtn.textContent = 'Logout';
		logoutBtn.className =
			'bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 rounded-sm transition-all ml-3';
		logoutBtn.onclick = logout;
		homeBtn.parentNode.appendChild(logoutBtn);
	}
}

// Check auth when page loads
document.addEventListener('DOMContentLoaded', () => {
	const user = checkAuth();
	if (user) {
		addLogoutButton();
		const userNameSpan = document.createElement('span');
		userNameSpan.textContent = `Welcome, ${user.name}`;
		userNameSpan.className = 'text-forest-700 font-semibold mr-3';
		const homeBtn = document.getElementById('homeBtn');
		if (homeBtn) {
			homeBtn.parentNode.insertBefore(userNameSpan, homeBtn);
		}
	}
});

// ── HOME PAGE RETURN ─────────────────────────────────
(function goHome() {
	const homeBtn = document.querySelector('#homeBtn');
	if (homeBtn) {
		homeBtn.addEventListener('click', () => {
			window.location.href = 'index.html';
		});
	}
})();

// ── FORM STEPS ───────────────────────────────────────
let fCur = 1;
const fTotal = 5;
const fPW = { 1: '20%', 2: '40%', 3: '60%', 4: '80%', 5: '100%' };

// Validation rules for each step
const stepValidations = {
	1: function () {
		// Pickup location validation
		const puProv = document.getElementById('puProv')?.value;
		const puDist = document.getElementById('puDist')?.value;
		const puCity = document.querySelectorAll('#fp1 input[type="text"]')[0]
			?.value;
		const puWard = document.querySelectorAll('#fp1 input[type="text"]')[1]
			?.value;

		// Drop location validation
		const drProv = document.getElementById('drProv')?.value;
		const drDist = document.getElementById('drDist')?.value;
		const drCity = document.querySelectorAll('#fp1 input[type="text"]')[2]
			?.value;
		const drWard = document.querySelectorAll('#fp1 input[type="text"]')[3]
			?.value;

		if (!puProv) {
			alert('Please select pickup province');
			return false;
		}
		if (!puDist || puDist === '— Select District —') {
			alert('Please select pickup district');
			return false;
		}
		if (!puCity) {
			alert('Please enter pickup city/municipality');
			return false;
		}
		if (!puWard) {
			alert('Please enter pickup ward/locality');
			return false;
		}
		if (!drProv) {
			alert('Please select drop province');
			return false;
		}
		if (!drDist || drDist === '— Select District —') {
			alert('Please select drop district');
			return false;
		}
		if (!drCity) {
			alert('Please enter drop city/municipality');
			return false;
		}
		if (!drWard) {
			alert('Please enter drop ward/locality');
			return false;
		}
		return true;
	},

	2: function () {
		// Check if home size is selected
		const homeSize = document.querySelector('input[name="hSize"]:checked');
		if (!homeSize) {
			alert('Please select your home size');
			return false;
		}
		return true;
	},

	3: function () {
		// Check if vehicle is selected
		const vehicle = document.querySelector('input[name="veh"]:checked');
		if (!vehicle) {
			alert('Please select a vehicle type');
			return false;
		}
		return true;
	},

	4: function () {
		// Check if move date is selected
		const moveDate = document.querySelectorAll('#fp4 input[type="date"]')[0]
			?.value;
		const timeSlot = document.querySelector('input[name="tSlot"]:checked');

		if (!moveDate) {
			alert('Please select your move date');
			return false;
		}
		if (!timeSlot) {
			alert('Please select your preferred time slot');
			return false;
		}
		return true;
	},

	5: function () {
		// Contact information validation
		const firstName = document.querySelectorAll(
			'#fp5 input[type="text"]',
		)[0]?.value;
		const lastName = document.querySelectorAll('#fp5 input[type="text"]')[1]
			?.value;
		const mobile = document.querySelectorAll('#fp5 input[type="tel"]')[0]
			?.value;
		const termsAccepted = document.querySelector(
			'#fp5 input[type="checkbox"]',
		)?.checked;

		if (!firstName) {
			alert('Please enter your first name');
			return false;
		}
		if (!lastName) {
			alert('Please enter your last name');
			return false;
		}
		if (!mobile || mobile.length < 10) {
			alert('Please enter a valid mobile number (at least 10 digits)');
			return false;
		}
		if (!termsAccepted) {
			alert('Please accept the Terms of Service and Privacy Policy');
			return false;
		}
		return true;
	},
};

function fGoTo(n) {
	if (n < 1 || n > fTotal) return;

	// Validate current step before moving forward
	if (n > fCur) {
		if (!stepValidations[fCur] || !stepValidations[fCur]()) {
			return;
		}
	}

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
		if (i < n) {
			el.className = 's-circle s-done';
			el.textContent = '✓';
		} else if (i === n) {
			el.className = 's-circle s-active';
			el.textContent = i;
		} else {
			el.className = 's-circle s-idle';
			el.textContent = i;
		}
	}

	[
		['cn12', 1],
		['cn23', 2],
		['cn34', 3],
		['cn45', 4],
	].forEach(([id, si]) => {
		const c = document.getElementById(id);
		if (c) {
			c.classList.toggle('bg-forest-600', si < n);
			c.classList.toggle('bg-cream-300', si >= n);
		}
	});

	for (let i = 1; i <= fTotal; i++) {
		const l = document.getElementById('fl' + i);
		if (l) {
			l.classList.toggle('text-forest-800', i === n);
			l.classList.toggle('text-gray-400', i !== n);
		}
	}

	document
		.getElementById('booking')
		?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Updated submitForm to actually send data to backend
async function submitForm() {
	// Validate step 5 before submitting
	if (!stepValidations[5]()) {
		return;
	}

	try {
		// Collect all form data
		const shipmentData = collectFormData();

		// Get logged in user from localStorage
		const user = JSON.parse(localStorage.getItem('meroGharUser') || '{}');
		if (user.id) {
			shipmentData.user_id = user.id;
		}

		console.log('Submitting shipment data:', shipmentData);

		// Send to backend
		const response = await fetch(
			'http://localhost:5000/api/shipment/create',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(shipmentData),
			},
		);

		const result = await response.json();

		if (!response.ok) {
			alert(
				result.message || 'Failed to submit booking. Please try again.',
			);
			return;
		}

		// Show success message
		document.getElementById('fp5').classList.add('hidden');
		document.getElementById('fpConfirm').classList.remove('hidden');
		document.getElementById('formProgress').style.width = '100%';

		for (let i = 1; i <= fTotal; i++) {
			const el = document.getElementById('sc' + i);
			el.className = 's-circle s-done';
			el.textContent = '✓';
		}

		// Display booking ID from server
		document.getElementById('bookId').textContent =
			result.booking_id ||
			Math.floor(10000 + Math.random() * 90000) +
				'-' +
				new Date().getFullYear();

		document
			.getElementById('booking')
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	} catch (error) {
		console.error('Error submitting form:', error);
		alert(
			'Failed to submit booking. Please check your connection and try again.',
		);
	}
}

// Function to collect all form data
function collectFormData() {
	// Pickup Location
	const pickupCityInput = document.querySelectorAll(
		'#fp1 input[type="text"]',
	)[0];
	const pickupWardInput = document.querySelectorAll(
		'#fp1 input[type="text"]',
	)[1];
	const pickupFloorSelect = document.querySelectorAll('#fp1 select')[1];
	const pickupLaneRadio = document.querySelector(
		'input[name="puLane"]:checked',
	);

	// Drop Location
	const dropCityInput = document.querySelectorAll(
		'#fp1 input[type="text"]',
	)[2];
	const dropWardInput = document.querySelectorAll(
		'#fp1 input[type="text"]',
	)[3];
	const dropFloorSelect = document.querySelectorAll('#fp1 select')[2];

	// Home Size
	const homeSizeSelected = document.querySelector(
		'input[name="hSize"]:checked',
	);
	let homeSize = '';
	if (homeSizeSelected) {
		const homeSizeLabel = homeSizeSelected
			.closest('label')
			?.querySelector('.chip-lbl');
		if (homeSizeLabel) {
			const sizeText = homeSizeLabel.innerText;
			if (sizeText.includes('1 Room')) homeSize = '1_room';
			else if (sizeText.includes('2 BHK')) homeSize = '2_bhk';
			else if (sizeText.includes('3 BHK')) homeSize = '3_bhk';
			else if (sizeText.includes('Large House')) homeSize = 'large_house';
		}
	}

	// Selected Items
	const selectedItems = [];
	document.querySelectorAll('#fp2 .item-chip.on').forEach((chip) => {
		const itemLabel = chip.querySelector('.chip-lbl');
		if (itemLabel) {
			selectedItems.push(itemLabel.innerText);
		}
	});

	// Fragile Items
	const fragileTextarea = document.querySelector('#fp2 textarea');

	// Vehicle
	const vehicleSelected = document.querySelector('input[name="veh"]:checked');
	let vehicleType = '';
	if (vehicleSelected) {
		const vehicleCard = vehicleSelected
			.closest('label')
			?.querySelector('.v-card');
		const vehicleTitle = vehicleCard?.querySelector('.font-semibold');
		if (vehicleTitle) {
			const vehicleText = vehicleTitle.innerText.toLowerCase();
			if (vehicleText.includes('cargo tempo'))
				vehicleType = 'cargo_tempo';
			else if (vehicleText.includes('tata ace')) vehicleType = 'tata_ace';
			else if (vehicleText.includes('mini truck'))
				vehicleType = 'mini_truck_407';
			else if (vehicleText.includes('large truck'))
				vehicleType = 'large_truck';
			else if (vehicleText.includes('recommend'))
				vehicleType = 'recommend';
		}
	}

	// Add-on Services
	const addOnServices = [];
	document
		.querySelectorAll('#fp3 input[type="checkbox"]:checked')
		.forEach((checkbox) => {
			const serviceText = checkbox
				.closest('label')
				?.querySelector('p:first-child')?.innerText;
			if (serviceText) {
				if (serviceText.includes('Packing'))
					addOnServices.push('packing');
				if (serviceText.includes('Disassembly'))
					addOnServices.push('disassembly');
				if (serviceText.includes('Porter'))
					addOnServices.push('porter');
				if (serviceText.includes('Insurance'))
					addOnServices.push('insurance');
			}
		});

	// Schedule
	const moveDateInput = document.querySelectorAll(
		'#fp4 input[type="date"]',
	)[0];
	const alternateDateInput = document.querySelectorAll(
		'#fp4 input[type="date"]',
	)[1];
	const timeSlotSelected = document.querySelector(
		'input[name="tSlot"]:checked',
	);
	let timeSlot = '';
	if (timeSlotSelected) {
		const slotLabel = timeSlotSelected
			.closest('label')
			?.querySelector('.chip-lbl');
		if (slotLabel) {
			const slotText = slotLabel.innerText.toLowerCase();
			if (slotText.includes('early morning')) timeSlot = 'early_morning';
			else if (
				slotText.includes('morning') &&
				!slotText.includes('early')
			)
				timeSlot = 'morning';
			else if (slotText.includes('afternoon')) timeSlot = 'afternoon';
			else if (slotText.includes('flexible')) timeSlot = 'flexible';
		}
	}

	const moveReasonSelect = document.querySelector('#fp4 select');

	// Contact
	const firstNameInput = document.querySelectorAll(
		'#fp5 input[type="text"]',
	)[0];
	const lastNameInput = document.querySelectorAll(
		'#fp5 input[type="text"]',
	)[1];
	const mobileInput = document.querySelectorAll('#fp5 input[type="tel"]')[0];
	const alternateMobileInput = document.querySelectorAll(
		'#fp5 input[type="tel"]',
	)[1];
	const emailInput = document.querySelector('#fp5 input[type="email"]');

	// Preferred Contact
	const preferredContact = [];
	document
		.querySelectorAll('#fp5 .flex-wrap input[type="checkbox"]:checked')
		.forEach((checkbox) => {
			const contactText = checkbox.parentElement.innerText.trim();
			if (contactText.includes('Phone')) preferredContact.push('phone');
			if (contactText.includes('Viber')) preferredContact.push('viber');
			if (contactText.includes('WhatsApp'))
				preferredContact.push('whatsapp');
			if (contactText.includes('Email')) preferredContact.push('email');
		});

	// Payment Method
	const paymentSelected = document.querySelector('.pay-card.picked');
	let paymentMethod = '';
	if (paymentSelected) {
		const paymentText = paymentSelected.querySelector(
			'.text-xs.font-semibold',
		)?.innerText;
		if (paymentText) paymentMethod = paymentText;
	}

	// How found us
	const howFoundSelect = document.querySelectorAll('#fp5 select')[1];

	// Special Notes
	const specialNotesTextarea = document.querySelector('#fp4 textarea');

	return {
		pickup_province: document.getElementById('puProv')?.value || '',
		pickup_district: document.getElementById('puDist')?.value || '',
		pickup_city: pickupCityInput?.value || '',
		pickup_ward: pickupWardInput?.value || '',
		pickup_floor: pickupFloorSelect?.value || '',
		pickup_lane_access: pickupLaneRadio?.parentElement?.innerText.includes(
			'Wide road',
		)
			? 'wide_road'
			: pickupLaneRadio?.parentElement?.innerText.includes('Narrow lane')
				? 'narrow_lane'
				: 'steps_only',

		drop_province: document.getElementById('drProv')?.value || '',
		drop_district: document.getElementById('drDist')?.value || '',
		drop_city: dropCityInput?.value || '',
		drop_ward: dropWardInput?.value || '',
		drop_floor: dropFloorSelect?.value || '',

		home_size: homeSize,
		selected_items: selectedItems,
		fragile_items: fragileTextarea?.value || '',

		vehicle_type: vehicleType,
		add_on_services: addOnServices,

		move_date: moveDateInput?.value || '',
		alternate_date: alternateDateInput?.value || '',
		preferred_time_slot: timeSlot,
		move_reason: moveReasonSelect?.value || '',

		first_name: firstNameInput?.value || '',
		last_name: lastNameInput?.value || '',
		mobile_number: mobileInput?.value || '',
		alternate_mobile: alternateMobileInput?.value || '',
		email: emailInput?.value || '',
		preferred_contact: preferredContact,

		payment_method: paymentMethod,
		special_notes: specialNotesTextarea?.value || '',
		how_found_us: howFoundSelect?.value || '',
	};
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
document.addEventListener('DOMContentLoaded', function () {
	document
		.querySelectorAll('label.item-chip input[type=radio]')
		.forEach((inp) => {
			inp.addEventListener('change', () => {
				const name = inp.name;
				document
					.querySelectorAll(`label.item-chip input[name="${name}"]`)
					.forEach((r) => {
						r.closest('label').classList.remove('on');
						const cl = r
							.closest('label')
							.querySelector('.chip-lbl');
						if (cl) cl.style.color = '';
					});
				inp.closest('label').classList.add('on');
				const cl = inp.closest('label').querySelector('.chip-lbl');
				if (cl) cl.style.color = '#f5a623';
			});
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
	if (sel) {
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
}
