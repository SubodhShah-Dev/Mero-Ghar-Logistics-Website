// ── DATA ──
const BOOKINGS = [
	{
		id: '#MG-4821',
		customer: 'Sita Rai',
		route: 'Kathmandu → Pokhara',
		date: '27 Mar',
		status: 'In Transit',
		amount: 4500,
		phone: '+977-9841-001',
	},
	{
		id: '#MG-4820',
		customer: 'Bikash Thapa',
		route: 'Lalitpur → Bhaktapur',
		date: '27 Mar',
		status: 'Delivered',
		amount: 1200,
		phone: '+977-9851-002',
	},
	{
		id: '#MG-4819',
		customer: 'Priya Shrestha',
		route: 'Biratnagar → Dharan',
		date: '26 Mar',
		status: 'Pending',
		amount: 2800,
		phone: '+977-9801-003',
	},
	{
		id: '#MG-4818',
		customer: 'Rohan Karki',
		route: 'Chitwan → Butwal',
		date: '26 Mar',
		status: 'Delivered',
		amount: 3100,
		phone: '+977-9811-004',
	},
	{
		id: '#MG-4817',
		customer: 'Mina Lama',
		route: 'Pokhara → Kathmandu',
		date: '25 Mar',
		status: 'Cancelled',
		amount: 4500,
		phone: '+977-9821-005',
	},
	{
		id: '#MG-4816',
		customer: 'Arjun Tamang',
		route: 'Janakpur → Kathmandu',
		date: '25 Mar',
		status: 'In Transit',
		amount: 5200,
		phone: '+977-9841-006',
	},
	{
		id: '#MG-4815',
		customer: 'Nisha Gurung',
		route: 'Dharan → Itahari',
		date: '24 Mar',
		status: 'Delivered',
		amount: 900,
		phone: '+977-9851-007',
	},
	{
		id: '#MG-4814',
		customer: 'Dev Pandey',
		route: 'Pokhara → Lumbini',
		date: '24 Mar',
		status: 'Pending',
		amount: 3800,
		phone: '+977-9801-008',
	},
	{
		id: '#MG-4813',
		customer: 'Sunita KC',
		route: 'Kathmandu → Chitwan',
		date: '23 Mar',
		status: 'In Transit',
		amount: 2200,
		phone: '+977-9811-009',
	},
];
const CUSTOMERS = [
	{
		name: 'Sita Rai',
		email: 'sita@email.com',
		phone: '+977-9841-001',
		bookings: 7,
		joined: 'Jan 2024',
		status: 'Active',
	},
	{
		name: 'Bikash Thapa',
		email: 'bikash@email.com',
		phone: '+977-9851-002',
		bookings: 4,
		joined: 'Mar 2024',
		status: 'Active',
	},
	{
		name: 'Priya Shrestha',
		email: 'priya@email.com',
		phone: '+977-9801-003',
		bookings: 2,
		joined: 'Jun 2024',
		status: 'Active',
	},
	{
		name: 'Rohan Karki',
		email: 'rohan@email.com',
		phone: '+977-9811-004',
		bookings: 9,
		joined: 'Nov 2023',
		status: 'Active',
	},
	{
		name: 'Mina Lama',
		email: 'mina@email.com',
		phone: '+977-9821-005',
		bookings: 1,
		joined: 'Feb 2025',
		status: 'Inactive',
	},
	{
		name: 'Arjun Tamang',
		email: 'arjun@email.com',
		phone: '+977-9841-006',
		bookings: 5,
		joined: 'Apr 2024',
		status: 'Active',
	},
];

let sortState = { col: null, dir: 1 };
let bookFilter = 'all',
	dashFilter = 'all';

// ── PILL HTML ──
function pillHtml(status) {
	const map = {
		Delivered: 'pd',
		'In Transit': 'pt',
		Pending: 'pp',
		Cancelled: 'pc',
		Active: 'pd',
		Inactive: 'pc',
	};
	return `<span class="pill ${map[status] || 'pp'}">${status}</span>`;
}

// ── RENDER DASH TABLE ──
function renderDashTable(filter, search) {
	const tbody = document.getElementById('dash-tbody');
	let data = BOOKINGS.slice(0, 6);
	if (filter && filter !== 'all')
		data = data.filter((r) => r.status === filter);
	if (search)
		data = data.filter(
			(r) =>
				r.customer.toLowerCase().includes(search) ||
				r.id.includes(search),
		);
	if (!data.length) {
		tbody.innerHTML = `<tr><td colspan="6" class="no-results">No bookings found</td></tr>`;
		return;
	}
	tbody.innerHTML = data
		.map(
			(r) => `
    <tr onclick="toggleDetail('d-${r.id.replace('#', '')}')">
      <td class="m">${r.id}</td><td class="b">${r.customer}</td>
      <td>${r.route}</td><td>${r.date}</td>
      <td>${pillHtml(r.status)}</td><td class="b">Rs ${r.amount.toLocaleString()}</td>
    </tr>
    <tr class="row-detail" id="d-${r.id.replace('#', '')}">
      <td colspan="6"><div class="rd-inner">
        <div class="rd-item"><div class="rd-lbl">Phone</div><div class="rd-val">${r.phone}</div></div>
        <div class="rd-item"><div class="rd-lbl">Full Route</div><div class="rd-val">${r.route}</div></div>
        <div class="rd-item"><div class="rd-lbl">Status</div><div class="rd-val">${r.status}</div></div>
        <div class="rd-item"><div class="rd-lbl">Amount</div><div class="rd-val">Rs ${r.amount.toLocaleString()}</div></div>
        <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
          <button class="btn-ghost btn-sm" onclick="event.stopPropagation();toast('Booking updated','gold')">Update Status</button>
          <button class="btn btn-sm" onclick="event.stopPropagation();toast('Details copied','green')">Copy ID</button>
        </div>
      </div></td>
    </tr>`,
		)
		.join('');
}

// ── RENDER BOOKINGS TABLE ──
function renderBookTable(filter, search) {
	const tbody = document.getElementById('book-tbody');
	let data = [...BOOKINGS];
	if (filter && filter !== 'all')
		data = data.filter((r) => r.status === filter);
	if (search)
		data = data.filter(
			(r) =>
				r.customer.toLowerCase().includes(search.toLowerCase()) ||
				r.id.toLowerCase().includes(search.toLowerCase()),
		);
	if (sortState.col) {
		data.sort((a, b) => {
			let av = a[sortState.col],
				bv = b[sortState.col];
			if (sortState.col === 'amount') {
				av = Number(av);
				bv = Number(bv);
			}
			return av > bv ? sortState.dir : av < bv ? -sortState.dir : 0;
		});
	}
	if (!data.length) {
		tbody.innerHTML = `<tr><td colspan="7" class="no-results">No bookings found</td></tr>`;
		return;
	}
	tbody.innerHTML = data
		.map(
			(r) => `
    <tr onclick="toggleDetail('bd-${r.id.replace('#', '')}')">
      <td class="m">${r.id}</td><td class="b">${r.customer}</td>
      <td>${r.route}</td><td>${r.date}</td>
      <td>${pillHtml(r.status)}</td><td class="b">Rs ${r.amount.toLocaleString()}</td>
      <td><div style="display:flex;gap:6px" onclick="event.stopPropagation()">
        <button class="btn-ghost btn-sm" onclick="toast('Status updated','gold')">Edit</button>
        <button class="btn btn-sm" onclick="deleteBooking('${r.id}')">Delete</button>
      </div></td>
    </tr>
    <tr class="row-detail" id="bd-${r.id.replace('#', '')}">
      <td colspan="7"><div class="rd-inner">
        <div class="rd-item"><div class="rd-lbl">Customer Phone</div><div class="rd-val">${r.phone}</div></div>
        <div class="rd-item"><div class="rd-lbl">Route</div><div class="rd-val">${r.route}</div></div>
        <div class="rd-item"><div class="rd-lbl">Current Status</div><div class="rd-val">${r.status}</div></div>
        <div class="rd-item"><div class="rd-lbl">Booking Amount</div><div class="rd-val">Rs ${r.amount.toLocaleString()}</div></div>
      </div></td>
    </tr>`,
		)
		.join('');
}

// ── RENDER CUSTOMERS ──
function renderCustomers(search) {
	const tbody = document.getElementById('cust-tbody');
	let data = [...CUSTOMERS];
	if (search)
		data = data.filter((r) =>
			r.name.toLowerCase().includes(search.toLowerCase()),
		);
	tbody.innerHTML = data
		.map(
			(r) => `
    <tr>
      <td class="b">${r.name}</td><td>${r.email}</td>
      <td>${r.phone}</td><td>${r.bookings}</td>
      <td>${r.joined}</td><td>${pillHtml(r.status)}</td>
    </tr>`,
		)
		.join('');
}

// ── TOGGLE ROW DETAIL ──
function toggleDetail(id) {
	const row = document.getElementById(id);
	if (!row) return;
	row.classList.toggle('open');
}

// ── DELETE BOOKING ──
function deleteBooking(id) {
	const idx = BOOKINGS.findIndex((b) => b.id === id);
	if (idx > -1) {
		BOOKINGS.splice(idx, 1);
		renderBookTable(
			bookFilter,
			document.getElementById('book-search').value,
		);
	}
	toast('Booking removed', 'red');
	document.getElementById('pending-count').textContent = BOOKINGS.filter(
		(b) => b.status === 'Pending',
	).length;
}

// ── SORT ──
function setupSort(tableId, renderFn) {
	document
		.querySelectorAll(`#${tableId} thead th[data-col]`)
		.forEach((th) => {
			th.addEventListener('click', () => {
				const col = th.dataset.col;
				if (sortState.col === col) sortState.dir *= -1;
				else {
					sortState.col = col;
					sortState.dir = 1;
				}
				document
					.querySelectorAll(`#${tableId} thead th`)
					.forEach((h) => h.classList.remove('sorted'));
				th.classList.add('sorted');
				th.querySelector('.sort-ic').textContent =
					sortState.dir === 1 ? '↑' : '↓';
				renderFn();
			});
		});
}

// ── CHIP FILTER ──
function setupChips(groupId, renderFn, searchId) {
	document
		.getElementById(groupId)
		.querySelectorAll('.chip')
		.forEach((c) => {
			c.addEventListener('click', () => {
				document
					.getElementById(groupId)
					.querySelectorAll('.chip')
					.forEach((x) => x.classList.remove('on'));
				c.classList.add('on');
				const f = c.dataset.filter;
				if (groupId === 'dash-chips') dashFilter = f;
				if (groupId === 'book-chips') bookFilter = f;
				const search = searchId
					? document.getElementById(searchId).value
					: '';
				renderFn(f, search);
			});
		});
}

// ── CHARTS ──
let sparkChart, revChart;
function drawSparkChart(days) {
	const labels = [],
		data = [];
	const base = [12, 18, 9, 22, 15, 27, 19, 14, 25, 11, 20, 17, 23, 8, 16];
	for (let i = days - 1; i >= 0; i--) {
		const d = new Date();
		d.setDate(d.getDate() - i);
		labels.push(
			d.toLocaleDateString('en-GB', {
				day: 'numeric',
				month: 'short',
			}),
		);
		data.push(base[i % base.length] + Math.floor(Math.random() * 5));
	}
	const lblEl = document.getElementById('chart-labels');
	const step = Math.ceil(days / 6);
	lblEl.innerHTML = labels
		.filter((_, i) => i % step === 0 || i === labels.length - 1)
		.map((l) => `<span>${l}</span>`)
		.join('');
	const ctx = document.getElementById('spark-chart').getContext('2d');
	if (sparkChart) sparkChart.destroy();
	sparkChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					data,
					borderColor: '#f8c06a',
					borderWidth: 2,
					pointRadius: 0,
					tension: 0.4,
					fill: true,
					backgroundColor: (ctx2) => {
						const g = ctx2.chart.ctx.createLinearGradient(
							0,
							0,
							0,
							130,
						);
						g.addColorStop(0, 'rgba(248,192,106,0.25)');
						g.addColorStop(1, 'rgba(248,192,106,0)');
						return g;
					},
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false },
				tooltip: {
					callbacks: {
						label: (v) => `${v.raw} bookings`,
					},
					backgroundColor: '#16261d',
					titleColor: '#eef2ee',
					bodyColor: 'rgba(238,242,238,.6)',
					borderColor: 'rgba(248,192,106,.3)',
					borderWidth: 1,
					padding: 10,
					displayColors: false,
				},
			},
			scales: {
				x: { display: false },
				y: { display: false },
			},
		},
	});
}
function drawRevChart() {
	const ctx = document.getElementById('rev-chart').getContext('2d');
	if (revChart) revChart.destroy();
	const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
	const vals = [280000, 310000, 295000, 340000, 380000, 420000];
	revChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: months,
			datasets: [
				{
					data: vals,
					backgroundColor: 'rgba(248,192,106,0.25)',
					borderColor: '#f8c06a',
					borderWidth: 1.5,
					borderRadius: 6,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false },
				tooltip: {
					callbacks: {
						label: (v) => `Rs ${(v.raw / 1000).toFixed(0)}k`,
					},
					backgroundColor: '#16261d',
					titleColor: '#eef2ee',
					bodyColor: 'rgba(238,242,238,.6)',
					borderColor: 'rgba(248,192,106,.3)',
					borderWidth: 1,
					padding: 10,
					displayColors: false,
				},
			},
			scales: {
				x: {
					ticks: {
						color: 'rgba(238,242,238,.35)',
						font: { family: 'var(--mono)', size: 11 },
					},
					grid: { display: false },
					border: { display: false },
				},
				y: {
					ticks: {
						color: 'rgba(238,242,238,.35)',
						font: { family: 'var(--mono)', size: 11 },
						callback: (v) => `${v / 1000}k`,
					},
					grid: { color: 'rgba(255,255,255,.05)' },
					border: { display: false },
				},
			},
		},
	});
}

// ── CHART RANGE ──
document
	.getElementById('chart-range')
	.querySelectorAll('.chip')
	.forEach((c) => {
		c.addEventListener('click', () => {
			document
				.getElementById('chart-range')
				.querySelectorAll('.chip')
				.forEach((x) => x.classList.remove('on'));
			c.classList.add('on');
			drawSparkChart(Number(c.dataset.range));
		});
	});

// ── PAGE NAV ──
function goPage(name) {
	document
		.querySelectorAll('.page')
		.forEach((p) => p.classList.remove('active'));
	document
		.querySelectorAll('.nav-a')
		.forEach((a) => a.classList.remove('on'));
	const pg = document.getElementById('page-' + name);
	if (pg) pg.classList.add('active');
	const na = document.querySelector(`.nav-a[data-page="${name}"]`);
	if (na) na.classList.add('on');
	document.getElementById('page-title').textContent =
		{
			dash: 'Dashboard',
			bookings: 'Bookings',
			customers: 'Customers',
			vendors: 'Vendors',
			revenue: 'Revenue',
			settings: 'Settings',
		}[name] || name;
	if (name === 'revenue') setTimeout(drawRevChart, 100);
}
document.querySelectorAll('.nav-a[data-page]').forEach((a) => {
	a.addEventListener('click', (e) => {
		e.preventDefault();
		goPage(a.dataset.page);
	});
});

// ── GLOBAL SEARCH ──
document.getElementById('global-search').addEventListener('input', (e) => {
	const v = e.target.value.toLowerCase();
	if (!v) {
		renderDashTable(dashFilter, '');
		return;
	}
	goPage('dash');
	renderDashTable('all', v);
	document
		.getElementById('dash-chips')
		.querySelectorAll('.chip')
		.forEach((c) => c.classList.toggle('on', c.dataset.filter === 'all'));
	dashFilter = 'all';
});

// ── BOOKINGS SEARCH ──
document.getElementById('book-search').addEventListener('input', (e) => {
	renderBookTable(bookFilter, e.target.value);
});

// ── CUSTOMER SEARCH ──
document.getElementById('cust-search').addEventListener('input', (e) => {
	renderCustomers(e.target.value);
});

// ── MODALS ──
function openNewBooking() {
	document.getElementById('modal-new').classList.add('open');
}
function closeModal(id) {
	document.getElementById(id).classList.remove('open');
}
document.querySelectorAll('.overlay').forEach((o) => {
	o.addEventListener('click', (e) => {
		if (e.target === o) o.classList.remove('open');
	});
});

function submitBooking() {
	const name = document.getElementById('nb-name').value.trim();
	const from = document.getElementById('nb-from').value.trim();
	const to = document.getElementById('nb-to').value.trim();
	const amt = document.getElementById('nb-amount').value;
	if (!name || !from || !to) {
		toast('Please fill all required fields', 'red');
		return;
	}
	const newId = `#MG-${4822 + BOOKINGS.length}`;
	BOOKINGS.unshift({
		id: newId,
		customer: name,
		route: `${from} → ${to}`,
		date: '27 Mar',
		status: 'Pending',
		amount: Number(amt) || 0,
		phone: '—',
	});
	closeModal('modal-new');
	toast(`Booking ${newId} created`, 'green');
	renderDashTable(dashFilter, '');
	renderBookTable(bookFilter, '');
	document.getElementById('pending-count').textContent = BOOKINGS.filter(
		(b) => b.status === 'Pending',
	).length;
	[
		'nb-name',
		'nb-phone',
		'nb-from',
		'nb-to',
		'nb-amount',
		'nb-notes',
	].forEach((id) => {
		const el = document.getElementById(id);
		if (el) el.value = '';
	});
}

// ── TOAST ──
function toast(msg, color = 'gold') {
	const colors = {
		gold: getComputedStyle(document.documentElement)
			.getPropertyValue('--gold')
			.trim(),
		green: '#4caf7d',
		red: '#e05e5e',
		blue: '#5e9fe0',
	};
	const wrap = document.getElementById('toast-wrap');
	const el = document.createElement('div');
	el.className = 'toast';
	el.innerHTML = `<span class="toast-dot" style="background:${colors[color] || colors.gold}"></span>${msg}`;
	wrap.appendChild(el);
	setTimeout(() => {
		el.classList.add('out');
		setTimeout(() => el.remove(), 220);
	}, 2800);
}

// ── NOTIFICATIONS ──
document.getElementById('notif-btn').addEventListener('click', () => {
	document.getElementById('notif-dot').style.display = 'none';
	toast('3 new bookings pending approval', 'gold');
});

// ── COUNTERS ──
[
	{ id: 'sv1', target: 1248 },
	{ id: 'sv2', target: 986 },
	{ id: 'sv3', target: 47 },
	{
		id: 'sv4',
		target: 420000,
		fmt: (v) => (v / 100000).toFixed(1) + 'L',
	},
].forEach(({ id, target, fmt }) => {
	let cur = 0;
	const el = document.getElementById(id);
	const step = Math.ceil(target / 55);
	const f = fmt || ((v) => v.toLocaleString());
	const tick = () => {
		cur = Math.min(cur + step, target);
		el.textContent = f(cur);
		if (cur < target) requestAnimationFrame(tick);
	};
	setTimeout(tick, 200);
});

// ── BAR ANIMATIONS ──
setTimeout(() => {
	document.querySelectorAll('.m-fill').forEach((el) => {
		el.style.width = el.dataset.w + '%';
	});
}, 400);

// ── INIT ──
renderDashTable('all', '');
renderBookTable('all', '');
renderCustomers('');
setupChips('dash-chips', (f, s) => renderDashTable(f, s), null);
setupChips('book-chips', (f, s) => renderBookTable(f, s), 'book-search');
setupSort('book-table', () =>
	renderBookTable(bookFilter, document.getElementById('book-search').value),
);
drawSparkChart(7);
