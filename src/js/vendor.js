// ==================================================
// VENDOR PORTAL - COMPLETE WORKING VERSION
// ==================================================

const BASEURL = 'http://localhost:5000';
let currentPage = 'overview';
let vendorData = null;
let vehicles = [];
let jobs = [];
let statusCheckInterval = null;

// ==================================================
// AUTHENTICATION
// ==================================================

function checkAuth() {
	const user = JSON.parse(localStorage.getItem('meroGharUser') || '{}');
	if (!user.loggedIn || user.role !== 'vendor') {
		window.location.href = '/src/pages/login.html';
		return null;
	}
	return user;
}

function logout() {
	if (confirm('Are you sure you want to logout?')) {
		localStorage.removeItem('meroGharUser');
		toast('Logged out successfully', 'green');
		setTimeout(() => {
			window.location.href = '/src/pages/login.html';
		}, 500);
	}
}

// ==================================================
// API FUNCTIONS
// ==================================================

async function fetchAPI(url, options = {}) {
	// Get user from localStorage
	const user = JSON.parse(localStorage.getItem('meroGharUser') || '{}');
	console.log('FetchAPI - User from localStorage:', user);

	const headers = {
		'Content-Type': 'application/json',
		...options.headers,
	};

	// Add user ID to headers if available
	if (user.id) {
		headers['X-User-Id'] = user.id.toString();
		console.log('FetchAPI - Adding X-User-Id header:', user.id);
	} else {
		console.log('FetchAPI - No user ID found in localStorage');
	}

	try {
		const response = await fetch(`${BASEURL}${url}`, {
			...options,
			headers,
		});
		const data = await response.json();
		console.log('FetchAPI - Response:', data);
		return { ok: response.ok, ...data };
	} catch (error) {
		console.error('FetchAPI - Error:', error);
		return { ok: false, message: error.message };
	}
}

// ==================================================
// VENDOR PROFILE MANAGEMENT
// ==================================================

async function checkVendorProfile() {
	const user = JSON.parse(localStorage.getItem('meroGharUser') || '{}');
	console.log('checkVendorProfile - User:', user);

	if (!user.id) {
		console.log('No user ID found, redirecting to login');
		window.location.href = '/src/pages/login.html';
		return;
	}

	console.log('Fetching vendor profile for user ID:', user.id);

	const result = await fetchAPI('/api/vendor/profile');
	console.log('Vendor profile result:', result);

	if (result.ok && result.vendor) {
		vendorData = result.vendor;
		console.log('Vendor data received:', vendorData);

		if (vendorData.status === 'active') {
			showApprovedDashboard();
			await loadFleet();
			await loadJobs();
			updateStats();
			goPage('overview');
			if (statusCheckInterval) clearInterval(statusCheckInterval);
		} else if (vendorData.status === 'pending') {
			showPendingState();
			startStatusCheck();
		}
	} else {
		console.log('No vendor profile found, showing registration form');
		showRegistrationForm();
	}
}

function showRegistrationForm() {
	document.getElementById('vendor-reg-form').style.display = 'block';
	document.getElementById('vendor-pending-state').style.display = 'none';
	document.getElementById('dashboard-content').style.display = 'none';
	document.getElementById('vendor-profile-card').style.display = 'none';
}

function showPendingState() {
	document.getElementById('vendor-reg-form').style.display = 'none';
	document.getElementById('vendor-pending-state').style.display = 'block';
	document.getElementById('dashboard-content').style.display = 'none';
	document.getElementById('vendor-profile-card').style.display = 'none';
}

function showApprovedDashboard() {
	document.getElementById('vendor-reg-form').style.display = 'none';
	document.getElementById('vendor-pending-state').style.display = 'none';
	document.getElementById('dashboard-content').style.display = 'block';
	document.getElementById('vendor-profile-card').style.display = 'block';

	// Update profile card
	document.getElementById('vendor-name-display').textContent =
		vendorData.business_name || vendorData.name;
	document.getElementById('vendor-region-display').textContent =
		vendorData.service_region || 'Kathmandu Valley';
	const initials = (vendorData.business_name || vendorData.name)
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
	document.getElementById('vendor-avatar').textContent = initials;
	document.getElementById('vendor-rating').textContent =
		(vendorData.rating || 0) + '★';
	document.getElementById('vendor-fleet').textContent = vehicles.length;
	document.getElementById('vendor-jobs').textContent =
		vendorData.total_jobs || 0;
}

function startStatusCheck() {
	if (statusCheckInterval) clearInterval(statusCheckInterval);
	statusCheckInterval = setInterval(async () => {
		const result = await fetchAPI('/api/vendor/profile');
		if (result.ok && result.vendor && result.vendor.status === 'active') {
			clearInterval(statusCheckInterval);
			toast(
				'Your vendor account has been approved! Refreshing...',
				'green',
			);
			setTimeout(() => location.reload(), 2000);
		}
	}, 30000);
}

window.checkStatusManually = async function () {
	toast('Checking status...', 'gold');
	const result = await fetchAPI('/api/vendor/profile');
	if (result.ok && result.vendor && result.vendor.status === 'active') {
		toast('Your account has been approved! Refreshing...', 'green');
		setTimeout(() => location.reload(), 1500);
	} else {
		toast('Still pending approval', 'blue');
	}
};

async function submitVendorRegistration() {
	const user = JSON.parse(localStorage.getItem('meroGharUser') || '{}');
	const business_name = document
		.getElementById('vendor-business-name')
		?.value.trim();
	const owner_name = document
		.getElementById('vendor-owner-name')
		?.value.trim();
	const phone = document.getElementById('vendor-phone')?.value.trim();
	const service_region = document.getElementById(
		'vendor-service-region',
	)?.value;
	const address = document.getElementById('vendor-address')?.value.trim();

	if (!business_name || !owner_name || !phone || !service_region) {
		toast('Please fill all required fields', 'red');
		return;
	}

	const result = await fetchAPI('/api/vendor/register', {
		method: 'POST',
		body: JSON.stringify({
			user_id: user.id,
			business_name,
			owner_name,
			phone,
			email: user.email,
			service_region,
			address,
		}),
	});

	if (result.ok) {
		toast('Vendor registration submitted for admin approval!', 'green');
		setTimeout(() => location.reload(), 2000);
	} else {
		toast(result.message || 'Registration failed', 'red');
	}
}

async function updateVendorProfile() {
	const business_name = document
		.getElementById('profile-business-name')
		?.value.trim();
	const owner_name = document
		.getElementById('profile-owner-name')
		?.value.trim();
	const phone = document.getElementById('profile-phone')?.value.trim();
	const service_region = document
		.getElementById('profile-region')
		?.value.trim();
	const address = document.getElementById('profile-address')?.value.trim();

	const result = await fetchAPI('/api/vendor/profile', {
		method: 'PUT',
		body: JSON.stringify({
			business_name,
			owner_name,
			phone,
			service_region,
			address,
		}),
	});

	if (result.ok) {
		toast('Profile updated successfully!', 'green');
		await checkVendorProfile();
	} else {
		toast('Failed to update profile', 'red');
	}
}

// ==================================================
// FLEET MANAGEMENT
// ==================================================

function openAddVehicle() {
	document.getElementById('modal-add-vehicle')?.classList.remove('hidden');
}

function closeModal(id) {
	document.getElementById(id)?.classList.add('hidden');
}

async function addVehicle() {
	const name = document.getElementById('vehicle-name')?.value.trim();
	const plate = document.getElementById('vehicle-plate')?.value.trim();
	const type = document.getElementById('vehicle-type')?.value;
	const driver = document.getElementById('vehicle-driver')?.value.trim();

	if (!name || !plate || !driver) {
		toast('Please fill required fields', 'red');
		return;
	}

	const newVehicle = {
		id: Date.now(),
		name,
		plate,
		type,
		driver,
		status: 'Available',
		lastJob: '—',
	};
	vehicles.unshift(newVehicle);
	saveFleet();
	renderFleet();
	renderFleetList();
	updateStats();
	closeModal('modal-add-vehicle');
	toast(`${name} added to fleet`, 'green');

	[
		'vehicle-name',
		'vehicle-plate',
		'vehicle-type',
		'vehicle-capacity',
		'vehicle-driver',
		'vehicle-driver-phone',
	].forEach((id) => {
		const el = document.getElementById(id);
		if (el) el.value = '';
	});
}

function removeVehicle(vehicleId) {
	if (confirm('Remove this vehicle?')) {
		const index = vehicles.findIndex((v) => v.id == vehicleId);
		if (index > -1) {
			const name = vehicles[index].name;
			vehicles.splice(index, 1);
			saveFleet();
			renderFleet();
			renderFleetList();
			updateStats();
			toast(`${name} removed from fleet`, 'red');
		}
	}
}

function updateVehicleStatus(vehicleId, status) {
	const vehicle = vehicles.find((v) => v.id == vehicleId);
	if (vehicle) {
		vehicle.status = status;
		saveFleet();
		renderFleet();
		renderFleetList();
		toast(`${vehicle.name} status updated to ${status}`, 'gold');
	}
}

function loadFleet() {
	const savedFleet = localStorage.getItem('vendorFleet');
	if (savedFleet) {
		vehicles = JSON.parse(savedFleet);
	} else {
		vehicles = [
			{
				id: 1,
				name: 'Tata 407',
				plate: 'BA 1 KA 2233',
				type: 'Mini Truck',
				driver: 'Hari Bahadur',
				status: 'Available',
				lastJob: '—',
			},
			{
				id: 2,
				name: 'Ashok Leyland',
				plate: 'BA 2 JA 4455',
				type: 'Large Truck',
				driver: 'Suresh Magar',
				status: 'Available',
				lastJob: '—',
			},
		];
	}
	renderFleet();
	renderFleetList();
}

function saveFleet() {
	localStorage.setItem('vendorFleet', JSON.stringify(vehicles));
}

function renderFleet() {
	const container = document.getElementById('fleet-grid');
	if (!container) return;
	if (vehicles.length === 0) {
		container.innerHTML =
			'<div class="col-span-2 text-center py-8 text-[rgba(238,242,238,0.5)]">No vehicles</div>';
		return;
	}
	container.innerHTML = vehicles
		.map(
			(v) => `
        <div class="bg-[#16261d] border border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden">
            <div class="p-4 border-b border-[rgba(255,255,255,0.07)] flex justify-between items-start">
                <div><div class="font-semibold">${v.name}</div><div class="text-xs font-mono text-[#f8c06a]">${v.plate}</div></div>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-mono ${v.status === 'Available' ? 'bg-[rgba(76,175,125,0.15)] text-[#4caf7d]' : 'bg-[rgba(248,192,106,0.15)] text-[#f8c06a]'}">${v.status}</span>
            </div>
            <div class="p-4 space-y-2"><div class="flex justify-between text-sm"><span class="text-[rgba(238,242,238,0.5)]">Type:</span><span>${v.type}</span></div><div class="flex justify-between text-sm"><span class="text-[rgba(238,242,238,0.5)]">Driver:</span><span>${v.driver}</span></div></div>
            <div class="p-4 border-t border-[rgba(255,255,255,0.07)] flex gap-2">
                <select onchange="updateVehicleStatus(${v.id}, this.value)" class="flex-1 bg-[#1d3327] border border-[rgba(255,255,255,0.07)] rounded-lg px-3 py-1.5 text-xs"><option value="Available" ${v.status === 'Available' ? 'selected' : ''}>Available</option><option value="On Route" ${v.status === 'On Route' ? 'selected' : ''}>On Route</option><option value="Maintenance" ${v.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option></select>
                <button onclick="removeVehicle(${v.id})" class="bg-[rgba(224,94,94,0.15)] text-[#e05e5e] px-3 py-1.5 rounded-lg text-xs">Remove</button>
            </div>
        </div>
    `,
		)
		.join('');
}

function renderFleetList() {
	const container = document.getElementById('fleet-list');
	if (!container) return;
	if (vehicles.length === 0) {
		container.innerHTML =
			'<div class="p-4 text-center text-[rgba(238,242,238,0.5)]">No vehicles in fleet</div>';
		return;
	}
	container.innerHTML = `<div class="overflow-x-auto"><table class="w-full"><thead class="border-b border-[rgba(255,255,255,0.07)]"><tr class="text-left text-[10px] font-mono text-[rgba(238,242,238,0.28)] uppercase"><th class="px-5 py-3">Vehicle</th><th class="px-5 py-3">Plate</th><th class="px-5 py-3">Type</th><th class="px-5 py-3">Driver</th><th class="px-5 py-3">Status</th></tr></thead><tbody>${vehicles.map((v) => `<tr class="border-b border-[rgba(255,255,255,0.05)]"><td class="px-5 py-3 font-medium">${v.name}</td><td class="px-5 py-3 font-mono text-xs">${v.plate}</td><td class="px-5 py-3">${v.type}</td><td class="px-5 py-3">${v.driver}</td><td class="px-5 py-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-mono ${v.status === 'Available' ? 'bg-[rgba(76,175,125,0.15)] text-[#4caf7d]' : 'bg-[rgba(248,192,106,0.15)] text-[#f8c06a]'}">${v.status}</span></td></tr>`).join('')}</tbody></table></div>`;
}

// ==================================================
// JOBS MANAGEMENT
// ==================================================

async function loadJobs() {
	const result = await fetchAPI('/api/vendor/shipments');
	if (result.ok && result.shipments) {
		jobs = result.shipments;
		renderJobs();
		renderNewJobsList();
		renderRecentCompletions();
		updateStats();
	}
}

function renderJobs() {
	const container = document.getElementById('jobs-grid');
	if (!container) return;
	const activeJobs = jobs.filter(
		(j) =>
			j.status === 'pending' ||
			j.status === 'accepted' ||
			j.status === 'in_transit',
	);
	if (activeJobs.length === 0) {
		container.innerHTML =
			'<div class="col-span-2 text-center py-8 text-[rgba(238,242,238,0.5)]">No assigned jobs</div>';
		return;
	}
	container.innerHTML = activeJobs
		.map(
			(job) => `
        <div class="bg-[#16261d] border border-[rgba(255,255,255,0.07)] rounded-xl p-4">
            <div class="flex justify-between items-start mb-3"><span class="text-xs font-mono text-[rgba(238,242,238,0.28)]">${job.booking_id || `#MG-${job.id}`}</span><span class="px-2 py-0.5 rounded-full text-[10px] font-mono ${job.status === 'pending' ? 'bg-[rgba(240,120,64,0.15)] text-[#f07840]' : job.status === 'accepted' ? 'bg-[rgba(76,175,125,0.15)] text-[#4caf7d]' : 'bg-[rgba(248,192,106,0.15)] text-[#f8c06a]'}">${job.status || 'Pending'}</span></div>
            <div class="font-semibold text-sm mb-1">${job.pickup_district} → ${job.drop_district}</div>
            <div class="text-xs text-[rgba(238,242,238,0.5)] mb-2">${job.customer_name}</div>
            <div class="flex gap-3 text-xs text-[rgba(238,242,238,0.4)] mb-3"><span>📅 ${job.move_date}</span><span>💰 Rs ${(job.final_quote || 0).toLocaleString()}</span></div>
            <div class="flex gap-2">
                ${job.status === 'pending' ? `<button onclick="acceptJob(${job.id})" class="flex-1 bg-[rgba(76,175,125,0.15)] text-[#4caf7d] border border-[rgba(76,175,125,0.25)] px-3 py-1.5 rounded-lg text-sm">Accept</button><button onclick="declineJob(${job.id})" class="flex-1 bg-[rgba(224,94,94,0.15)] text-[#e05e5e] border border-[rgba(224,94,94,0.25)] px-3 py-1.5 rounded-lg text-sm">Decline</button>` : job.status === 'accepted' ? `<button onclick="startDelivery(${job.id})" class="w-full bg-[#f8c06a] text-[#0b1510] px-3 py-1.5 rounded-lg text-sm font-semibold">Start Delivery</button>` : job.status === 'in_transit' ? `<button onclick="completeDelivery(${job.id})" class="w-full bg-[#4caf7d] text-white px-3 py-1.5 rounded-lg text-sm font-semibold">Complete Delivery</button>` : ''}
            </div>
        </div>
    `,
		)
		.join('');
}

async function acceptJob(jobId) {
	const result = await fetchAPI(`/api/vendor/shipments/${jobId}/accept`, {
		method: 'PUT',
	});
	if (result.ok) {
		toast('Job accepted!', 'green');
		await loadJobs();
	}
}

async function declineJob(jobId) {
	if (confirm('Decline this job?')) {
		toast('Job declined', 'red');
		await loadJobs();
	}
}

async function startDelivery(jobId) {
	const result = await fetchAPI(`/api/vendor/shipments/${jobId}/start`, {
		method: 'PUT',
	});
	if (result.ok) {
		toast('Delivery started!', 'gold');
		await loadJobs();
	}
}

async function completeDelivery(jobId) {
	const result = await fetchAPI(`/api/vendor/shipments/${jobId}/complete`, {
		method: 'PUT',
	});
	if (result.ok) {
		toast('Delivery completed!', 'green');
		await loadJobs();
		if (vendorData) {
			vendorData.total_jobs++;
			document.getElementById('vendor-jobs').textContent =
				vendorData.total_jobs;
		}
	}
}

function renderNewJobsList() {
	const container = document.getElementById('new-jobs-list');
	if (!container) return;
	const newJobs = jobs.filter((j) => j.status === 'pending');
	const badge = document.getElementById('new-jobs-badge');
	const jobBadge = document.getElementById('job-badge');
	if (badge) {
		if (newJobs.length > 0) {
			badge.classList.remove('hidden');
			badge.textContent = `${newJobs.length} new`;
			if (jobBadge) {
				jobBadge.classList.remove('hidden');
				jobBadge.textContent = newJobs.length;
			}
		} else {
			badge.classList.add('hidden');
			if (jobBadge) jobBadge.classList.add('hidden');
		}
	}
	if (newJobs.length === 0) {
		container.innerHTML =
			'<div class="p-5 text-center text-[rgba(238,242,238,0.5)]">No new job requests</div>';
		return;
	}
	container.innerHTML = newJobs
		.map(
			(job) =>
				`<div class="p-4 hover:bg-[rgba(248,192,106,0.05)]"><div class="flex justify-between items-start"><div><div class="font-medium text-sm">${job.pickup_district} → ${job.drop_district}</div><div class="text-xs text-[rgba(238,242,238,0.5)] mt-1">${job.customer_name} · ${job.move_date}</div></div><div class="text-right"><div class="text-[#f8c06a] font-semibold">Rs ${(job.final_quote || 0).toLocaleString()}</div><button onclick="acceptJob(${job.id})" class="mt-2 bg-[rgba(76,175,125,0.15)] text-[#4caf7d] px-3 py-1 rounded-lg text-xs">Accept</button></div></div></div>`,
		)
		.join('');
}

function renderRecentCompletions() {
	const container = document.getElementById('recent-completions');
	if (!container) return;
	const completedJobs = jobs
		.filter((j) => j.status === 'delivered' || j.status === 'completed')
		.slice(0, 5);
	if (completedJobs.length === 0) {
		container.innerHTML =
			'<div class="p-4 text-center text-[rgba(238,242,238,0.5)]">No completed jobs</div>';
		return;
	}
	container.innerHTML = `<div class="overflow-x-auto"><table class="w-full"><thead class="border-b border-[rgba(255,255,255,0.07)]"><tr class="text-left text-[10px] font-mono text-[rgba(238,242,238,0.28)] uppercase"><th class="px-5 py-3">Job ID</th><th class="px-5 py-3">Route</th><th class="px-5 py-3">Earned</th><th class="px-5 py-3">Date</th></tr></thead><tbody>${completedJobs.map((job) => `<tr class="border-b border-[rgba(255,255,255,0.05)]"><td class="px-5 py-3 text-sm font-mono">${job.booking_id}</td><td class="px-5 py-3 text-sm">${job.pickup_district} → ${job.drop_district}</td><td class="px-5 py-3 text-sm text-[#4caf7d]">+Rs ${(job.final_quote || 0).toLocaleString()}</td><td class="px-5 py-3 text-sm">${job.move_date}</td></tr>`).join('')}</tbody></table></div>`;
}

// ==================================================
// UI HELPERS
// ==================================================

function updateStats() {
	const activeJobs = jobs.filter(
		(j) => j.status === 'accepted' || j.status === 'in_transit',
	).length;
	const totalEarned = jobs
		.filter((j) => j.status === 'delivered' || j.status === 'completed')
		.reduce((sum, j) => sum + (j.final_quote || 0), 0);
	const completedCount = jobs.filter(
		(j) => j.status === 'delivered' || j.status === 'completed',
	).length;
	document.getElementById('active-jobs').textContent = activeJobs;
	document.getElementById('fleet-size').textContent = vehicles.length;
	document.getElementById('vendor-fleet').textContent = vehicles.length;
	document.getElementById('earn-total').textContent =
		`Rs ${(totalEarned / 1000).toFixed(0)}k`;
	document.getElementById('earn-jobs').textContent = completedCount;
	document.getElementById('month-earning').textContent =
		`Rs ${Math.floor(totalEarned / 12).toLocaleString()}`;
	document.getElementById('earn-pending').textContent =
		`Rs ${(jobs.filter((j) => j.status === 'pending').length * 3000).toLocaleString()}`;
}

function goPage(page) {
	currentPage = page;
	const pages = [
		'overview',
		'jobs',
		'fleet',
		'earnings',
		'profile',
		'support',
	];
	pages.forEach((p) => {
		const el = document.getElementById(`page-${p}`);
		if (el) el.style.display = 'none';
	});
	const selectedPage = document.getElementById(`page-${page}`);
	if (selectedPage) selectedPage.style.display = 'block';
	document.querySelectorAll('.nav-link').forEach((link) => {
		link.classList.remove('bg-[rgba(248,192,106,0.1)]', 'text-[#f8c06a]');
		if (link.getAttribute('data-page') === page)
			link.classList.add('bg-[rgba(248,192,106,0.1)]', 'text-[#f8c06a]');
	});
	const titles = {
		overview: 'Overview',
		jobs: 'Assigned Jobs',
		fleet: 'My Fleet',
		earnings: 'Earnings',
		profile: 'Profile & Docs',
		support: 'Help & Support',
	};
	document.getElementById('page-title').textContent = titles[page] || page;
	if (page === 'profile' && vendorData) {
		document.getElementById('profile-business-name').value =
			vendorData.business_name || '';
		document.getElementById('profile-owner-name').value =
			vendorData.owner_name || '';
		document.getElementById('profile-phone').value = vendorData.phone || '';
		document.getElementById('profile-region').value =
			vendorData.service_region || '';
		document.getElementById('profile-address').value =
			vendorData.address || '';
	}
}

function showNotifications() {
	const pendingJobs = jobs.filter((j) => j.status === 'pending').length;
	if (pendingJobs > 0) {
		toast(`You have ${pendingJobs} new job requests!`, 'gold');
		goPage('jobs');
	} else {
		toast('No new notifications', 'blue');
	}
}

function toggleOnline() {
	console.log('toggleOnline called');

	const statusSpan = document.getElementById('online-status');
	const dotSpan = document.getElementById('online-dot');
	const toggleBtn = document.getElementById('online-toggle-btn');
	const toggleKnob = document.getElementById('online-toggle-knob');

	if (!statusSpan) {
		console.error('online-status element not found');
		return;
	}

	const isOnline = statusSpan.textContent === 'Online & Available';

	if (isOnline) {
		// Going OFFLINE - Gray, Knob LEFT
		statusSpan.textContent = 'Offline';
		if (dotSpan) dotSpan.style.backgroundColor = '#9ca3af';
		if (toggleBtn) toggleBtn.style.backgroundColor = '#6b7280';
		if (toggleKnob) toggleKnob.style.transform = 'translateX(0px)';
		toast('You are now offline', 'red');
	} else {
		// Going ONLINE - Green, Knob RIGHT
		statusSpan.textContent = 'Online & Available';
		if (dotSpan) dotSpan.style.backgroundColor = '#4caf7d';
		if (toggleBtn) toggleBtn.style.backgroundColor = '#2d5a3d';
		if (toggleKnob) toggleKnob.style.transform = 'translateX(16px)';
		toast('You are now online', 'green');
	}
}

// Initialize toggle state when page loads
function initializeToggleState() {
	const statusSpan = document.getElementById('online-status');
	const dotSpan = document.getElementById('online-dot');
	const toggleBtn = document.getElementById('online-toggle-btn');
	const toggleKnob = document.getElementById('online-toggle-knob');

	if (!statusSpan) return;

	const isOnline = statusSpan.textContent === 'Online & Available';

	if (isOnline) {
		if (dotSpan) dotSpan.style.backgroundColor = '#4caf7d';
		if (toggleBtn) toggleBtn.style.backgroundColor = '#2d5a3d';
		if (toggleKnob) toggleKnob.style.transform = 'translateX(16px)';
	} else {
		if (dotSpan) dotSpan.style.backgroundColor = '#9ca3af';
		if (toggleBtn) toggleBtn.style.backgroundColor = '#6b7280';
		if (toggleKnob) toggleKnob.style.transform = 'translateX(0px)';
	}
}

// Call initialization when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
	initializeToggleState();
});

function submitSupportTicket() {
	const subject = document.getElementById('support-subject')?.value;
	const message = document.getElementById('support-message')?.value;
	if (!subject || !message) {
		toast('Please fill subject and message', 'red');
		return;
	}
	toast('Ticket submitted!', 'green');
	document.getElementById('support-subject').value = '';
	document.getElementById('support-message').value = '';
}

function toast(msg, color = 'gold') {
	const colors = {
		gold: '#f8c06a',
		green: '#4caf7d',
		red: '#e05e5e',
		blue: '#5e9fe0',
	};
	const container = document.getElementById('toast-container');
	if (!container) return;
	const el = document.createElement('div');
	el.className =
		'bg-[#16261d] border border-[rgba(248,192,106,0.3)] rounded-lg px-4 py-3 text-sm flex items-center gap-2 mb-2';
	el.innerHTML = `<span class="w-1.5 h-1.5 rounded-full" style="background:${colors[color] || colors.gold}"></span>${msg}`;
	container.appendChild(el);
	setTimeout(() => {
		el.style.opacity = '0';
		el.style.transform = 'translateX(10px)';
		setTimeout(() => el.remove(), 200);
	}, 2800);
}

// ==================================================
// INITIALIZATION
// ==================================================

document.addEventListener('DOMContentLoaded', async () => {
	const user = checkAuth();
	if (!user) return;
	await checkVendorProfile();
});

// Make functions global
window.goPage = goPage;
window.logout = logout;
window.openAddVehicle = openAddVehicle;
window.closeModal = closeModal;
window.addVehicle = addVehicle;
window.removeVehicle = removeVehicle;
window.updateVehicleStatus = updateVehicleStatus;
window.acceptJob = acceptJob;
window.declineJob = declineJob;
window.startDelivery = startDelivery;
window.completeDelivery = completeDelivery;
window.showNotifications = showNotifications;
window.toggleOnline = toggleOnline;
window.submitVendorRegistration = submitVendorRegistration;
window.updateVendorProfile = updateVendorProfile;
window.submitSupportTicket = submitSupportTicket;
window.checkStatusManually = checkStatusManually;
