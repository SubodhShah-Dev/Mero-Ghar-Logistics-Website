// ── DATA ──
const JOBS = [
	{
		id: '#JB-901',
		route: 'Kathmandu → Pokhara',
		customer: 'Sita Rai',
		date: '27 Mar',
		time: '09:00 AM',
		amount: 4500,
		weight: '2 tonnes',
		type: 'Household',
		status: 'New',
		vehicle: 'BA 1 KA 2233',
		notes: '3rd floor, no lift',
	},
	{
		id: '#JB-900',
		route: 'Lalitpur → Bhaktapur',
		customer: 'Bikash Thapa',
		date: '27 Mar',
		time: '11:30 AM',
		amount: 1200,
		weight: '0.5 tonnes',
		type: 'Single Item',
		status: 'New',
		vehicle: 'BA 2 JA 4455',
		notes: 'Daytime delivery only',
	},
	{
		id: '#JB-899',
		route: 'Kathmandu → Chitwan',
		customer: 'Sunita KC',
		date: '26 Mar',
		time: '08:00 AM',
		amount: 3800,
		weight: '3 tonnes',
		type: 'Household',
		status: 'In Transit',
		vehicle: 'BA 1 KA 2233',
		notes: '',
	},
	{
		id: '#JB-898',
		route: 'Bhaktapur → Biratnagar',
		customer: 'Dev Pandey',
		date: '26 Mar',
		time: '07:00 AM',
		amount: 5200,
		weight: '4 tonnes',
		type: 'Office',
		status: 'Accepted',
		vehicle: 'BA 3 PA 8899',
		notes: 'Heavy machinery, need crane',
	},
	{
		id: '#JB-897',
		route: 'Pokhara → Kathmandu',
		customer: 'Mina Lama',
		date: '25 Mar',
		time: '10:00 AM',
		amount: 4200,
		weight: '2.5 tonnes',
		type: 'Household',
		status: 'Completed',
		vehicle: 'BA 2 JA 4455',
		notes: '',
	},
	{
		id: '#JB-896',
		route: 'Janakpur → Kathmandu',
		customer: 'Arjun Tamang',
		date: '24 Mar',
		time: '06:00 AM',
		amount: 5800,
		weight: '5 tonnes',
		type: 'Household',
		status: 'Completed',
		vehicle: 'BA 1 KA 2233',
		notes: '',
	},
	{
		id: '#JB-895',
		route: 'Pokhara → Lumbini',
		customer: 'Nisha Gurung',
		date: '23 Mar',
		time: '07:30 AM',
		amount: 6200,
		weight: '6 tonnes',
		type: 'Office',
		status: 'Completed',
		vehicle: 'BA 4 GA 6677',
		notes: '',
	},
];

let FLEET = [
	{
		id: 'f1',
		name: 'Tata 407',
		plate: 'BA 1 KA 2233',
		type: 'Mini Truck',
		cap: '2',
		driver: 'Hari Bahadur',
		status: 'On Route',
		lastJob: '#JB-899',
	},
	{
		id: 'f2',
		name: 'Ashok Leyland',
		plate: 'BA 2 JA 4455',
		type: 'Large Truck',
		cap: '5',
		driver: 'Suresh Magar',
		status: 'Available',
		lastJob: '#JB-897',
	},
	{
		id: 'f3',
		name: 'Mahindra Bolero',
		plate: 'BA 3 PA 8899',
		type: 'Pickup Van',
		cap: '1',
		driver: 'Kamal Tamang',
		status: 'Available',
		lastJob: '#JB-898',
	},
	{
		id: 'f4',
		name: 'Tata LPT 1618',
		plate: 'BA 4 GA 6677',
		type: 'Container',
		cap: '8',
		driver: 'Dipak Shrestha',
		status: 'Maintenance',
		lastJob: '#JB-895',
	},
	{
		id: 'f5',
		name: 'Swaraj Mazda',
		plate: 'BA 5 CHA 1122',
		type: 'Tempo',
		cap: '1.5',
		driver: 'Nayan Rai',
		status: 'Available',
		lastJob: '#JB-893',
	},
];

const PAYOUTS = [
	{
		label: 'March payout — 12 jobs',
		date: '25 Mar 2026',
		amount: 'Rs 62,400',
		color: 'green',
	},
	{
		label: 'February payout — 10 jobs',
		date: '25 Feb 2026',
		amount: 'Rs 55,200',
		color: 'green',
	},
	{
		label: 'January payout — 14 jobs',
		date: '25 Jan 2026',
		amount: 'Rs 71,800',
		color: 'green',
	},
	{
		label: 'December payout — 8 jobs',
		date: '25 Dec 2025',
		amount: 'Rs 44,100',
		color: 'green',
	},
	{
		label: 'Festival bonus payout',
		date: '15 Oct 2025',
		amount: 'Rs 8,000',
		color: 'gold',
	},
];

// ── PILL ──
const PC = {
	Available: 'pAv',
	'On Route': 'pOn',
	Maintenance: 'pMt',
	New: 'pNw',
	Accepted: 'pAv',
	'In Transit': 'pOn',
	Completed: 'pCo',
	Rejected: 'pRj',
};
const pill = (s) => `<span class="pill ${PC[s] || 'pMt'}">${s}</span>`;

// ── VEHICLE SVG ──
const vico = () =>
	`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`;

// ── RENDER INCOMING ──
function renderIncoming() {
	const el = document.getElementById('incoming-list');
	const items = JOBS.filter((j) => j.status === 'New');
	const badge = document.getElementById('incoming-badge');
	badge.textContent = items.length ? `${items.length} new` : 'None';
	const nb = document.getElementById('new-badge');
	nb.textContent = items.length || '';
	nb.style.display = items.length ? '' : 'none';
	const dot = document.getElementById('notif-dot');
	dot.style.display = items.length ? '' : 'none';
	if (!items.length) {
		el.innerHTML = `<p style="padding:28px 22px;color:var(--dim);font-size:13px;text-align:center">No new requests right now.<br>Check back soon.</p>`;
		return;
	}
	el.innerHTML = items
		.map(
			(j) => `
    <div class="pi" style="border-bottom:1px solid var(--bdim)">
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:14px;color:var(--text)">${j.route}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:2px">${j.customer} · ${j.weight} · ${j.date}, ${j.time}</div>
        ${j.notes ? `<div style="font-size:11px;color:var(--dim);margin-top:3px">${j.notes}</div>` : ''}
      </div>
      <div style="font-family:var(--mono);font-size:13px;font-weight:600;color:var(--gold);margin:0 10px">Rs ${j.amount.toLocaleString()}</div>
      <div style="display:flex;gap:6px;flex-shrink:0">
        <button class="btn-g" onclick="acceptJob('${j.id}')">Accept</button>
        <button class="btn-r" onclick="declineJob('${j.id}')">Decline</button>
      </div>
    </div>`,
		)
		.join('');
}

// ── RENDER COMPLETIONS ──
function renderCompletions() {
	const el = document.getElementById('completions-tb');
	const items = JOBS.filter((j) => j.status === 'Completed').slice(0, 5);
	if (!items.length) {
		el.innerHTML = `<tr><td colspan="4" class="empty">No completed jobs yet</td></tr>`;
		return;
	}
	el.innerHTML = items
		.map(
			(j) => `
    <tr>
      <td class="m">${j.id}</td>
      <td class="b" style="max-width:150px;overflow:hidden;text-overflow:ellipsis">${j.route}</td>
      <td style="color:var(--green);font-family:var(--mono);font-size:12px;font-weight:600">+Rs ${j.amount.toLocaleString()}</td>
      <td>${j.date}</td>
    </tr>`,
		)
		.join('');
}

// ── RENDER FLEET STRIP ──
function renderFleetStrip() {
	const el = document.getElementById('fleet-strip');
	el.innerHTML = FLEET.map(
		(v) => `
    <tr onclick="goPage('fleet')">
      <td class="b">${v.name}</td>
      <td class="m">${v.plate}</td>
      <td>${v.type}</td>
      <td>${v.driver}</td>
      <td>${pill(v.status)}</td>
      <td class="m">${v.lastJob}</td>
    </tr>`,
	).join('');
}

// ── RENDER JOBS ──
let jobFilter = 'all';
function renderJobs(f) {
	if (f) jobFilter = f;
	const el = document.getElementById('jobs-grid');
	let data = [...JOBS];
	if (jobFilter !== 'all') data = data.filter((j) => j.status === jobFilter);
	if (!data.length) {
		el.innerHTML = `<p style="padding:28px;color:var(--dim);font-size:13px;grid-column:1/-1;text-align:center">No jobs in this category.</p>`;
		return;
	}
	el.innerHTML = data
		.map(
			(j) => `
    <div class="jcard${j.status === 'New' ? ' isnew' : ''}">
      <div class="jc-badge">${pill(j.status)}</div>
      <div class="jc-id">${j.id}</div>
      <div class="jc-route">${j.route}</div>
      <div class="jc-cust">${j.customer} · ${j.type}</div>
      <div class="jc-meta">
        <div class="jcm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${j.date}, ${j.time}</div>
        <div class="jcm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${j.weight}</div>
        <div class="jcm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>${j.vehicle}</div>
      </div>
      ${j.notes ? `<div class="jc-note">${j.notes}</div>` : ''}
      <div class="jc-foot">
        <span class="jc-amount">Rs ${j.amount.toLocaleString()}</span>
        <div class="jc-acts">
          ${
				j.status === 'New'
					? `<button class="btn-g" onclick="acceptJob('${j.id}')">Accept</button><button class="btn-r" onclick="declineJob('${j.id}')">Decline</button>`
					: j.status === 'Accepted'
						? `<button class="btn btn-sm" onclick="startJob('${j.id}')">Start Trip</button>`
						: j.status === 'In Transit'
							? `<button class="btn btn-sm" onclick="completeJob('${j.id}')">Mark Delivered</button>`
							: `<button class="btn-ghost bgsm" onclick="toast('Receipt downloaded','green')">Receipt</button>`
			}
        </div>
      </div>
    </div>`,
		)
		.join('');
}

// ── JOB ACTIONS ──
function acceptJob(id) {
	const j = JOBS.find((x) => x.id === id);
	if (!j) return;
	j.status = 'Accepted';
	toast(`${id} accepted`, 'green');
	refresh();
}
function declineJob(id) {
	const j = JOBS.find((x) => x.id === id);
	if (!j) return;
	j.status = 'Rejected';
	toast(`${id} declined`, 'red');
	refresh();
}
function startJob(id) {
	const j = JOBS.find((x) => x.id === id);
	if (!j) return;
	j.status = 'In Transit';
	toast(`Trip started — ${id}`, 'gold');
	renderJobs();
	updateKPIs();
}
function completeJob(id) {
	const j = JOBS.find((x) => x.id === id);
	if (!j) return;
	j.status = 'Completed';
	const done = JOBS.filter((x) => x.status === 'Completed').length;
	document.getElementById('sb-done').textContent = done;
	document.getElementById('kv-done').textContent = done;
	toast(`${id} marked as delivered`, 'green');
	refresh();
}

// ── RENDER FLEET ──
let fleetFilter = 'all';
function renderFleet(f) {
	if (f) fleetFilter = f;
	const el = document.getElementById('fleet-grid');
	let data = [...FLEET];
	if (fleetFilter !== 'all')
		data = data.filter((v) => v.status === fleetFilter);
	if (!data.length) {
		el.innerHTML = `<p style="padding:28px;color:var(--dim);font-size:13px;grid-column:1/-1;text-align:center">No vehicles in this category.</p>`;
		return;
	}
	el.innerHTML = data
		.map(
			(v) => `
    <div class="vcard">
      <div class="vc-head">
        <div class="vc-ico">${vico()}</div>
        <div class="vc-info"><div class="vc-name">${v.name}</div><div class="vc-plate">${v.plate}</div></div>
        ${pill(v.status)}
      </div>
      <div class="vc-body">
        <div class="vr"><span class="vr-l">Type</span><span class="vr-v">${v.type}</span></div>
        <div class="vr"><span class="vr-l">Capacity</span><span class="vr-v">${v.cap} tonnes</span></div>
        <div class="vr"><span class="vr-l">Driver</span><span class="vr-v">${v.driver}</span></div>
        <div class="vr"><span class="vr-l">Last Job</span><span class="vr-v" style="font-family:var(--mono);font-size:11px;color:var(--dim)">${v.lastJob}</span></div>
      </div>
      <div class="vc-foot">
        ${
			v.status === 'Maintenance'
				? `<button class="btn-g" style="flex:1" onclick="setVStatus('${v.id}','Available')">Mark Available</button>`
				: v.status === 'Available'
					? `<button class="btn-ghost bgsm" style="flex:1" onclick="setVStatus('${v.id}','Maintenance')">Send for Maintenance</button>`
					: `<button class="btn-ghost bgsm" style="flex:1" onclick="toast('Vehicle is currently on a job','gold')">Currently on job</button>`
		}
        <button class="btn-r" onclick="removeVehicle('${v.id}')">Remove</button>
      </div>
    </div>`,
		)
		.join('');
}

function setVStatus(id, status) {
	const v = FLEET.find((x) => x.id === id);
	if (!v) return;
	v.status = status;
	renderFleet();
	renderFleetStrip();
	updateKPIs();
	toast(`${v.name} → ${status}`, 'green');
}
function removeVehicle(id) {
	const idx = FLEET.findIndex((x) => x.id === id);
	if (idx < 0) return;
	const n = FLEET[idx].name;
	FLEET.splice(idx, 1);
	renderFleet();
	renderFleetStrip();
	updateKPIs();
	document.getElementById('sb-fleet').textContent = FLEET.length;
	toast(`${n} removed from fleet`, 'red');
}

// ── UPDATE KPIs ──
function updateKPIs() {
	const active = JOBS.filter(
		(j) => j.status === 'Accepted' || j.status === 'In Transit',
	).length;
	const newCount = JOBS.filter((j) => j.status === 'New').length;
	document.getElementById('kv-active').textContent = active;
	document.getElementById('kv-active-sub').textContent =
		`${newCount} new request${newCount !== 1 ? 's' : ''}`;
	document.getElementById('kv-fleet').textContent = FLEET.length;
	const avail = FLEET.filter((v) => v.status === 'Available').length;
	document.getElementById('kv-fleet-sub').textContent = `${avail} available`;
	document.getElementById('sb-fleet').textContent = FLEET.length;
}

// ── RENDER PAYOUTS ──
function renderPayouts() {
	const el = document.getElementById('plist');
	el.innerHTML = PAYOUTS.map(
		(p) => `
    <div class="pi">
      <div class="pi-ico" style="background:${p.color === 'gold' ? 'rgba(248,192,106,.12)' : 'rgba(76,175,125,.12)'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="${p.color === 'gold' ? '#f8c06a' : '#4caf7d'}" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <div class="pi-body"><div class="pi-lbl">${p.label}</div><div class="pi-date">${p.date}</div></div>
      <div class="pi-amt" style="color:${p.color === 'gold' ? 'var(--gold)' : 'var(--green)'}">+${p.amount}</div>
    </div>`,
	).join('');
}

// ── EARN CHART ──
let earnChart;
function drawEarnChart(months) {
	const m6 = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
	const m12 = [
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
		'Jan',
		'Feb',
		'Mar',
	];
	const d6 = [38000, 42000, 36000, 50000, 55000, 68500];
	const d12 = [
		22000, 28000, 31000, 25000, 34000, 40000, 38000, 42000, 36000, 50000,
		55000, 68500,
	];
	const labels = months === 12 ? m12 : m6,
		data = months === 12 ? d12 : d6;
	const ctx = document.getElementById('earn-chart').getContext('2d');
	if (earnChart) earnChart.destroy();
	earnChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels,
			datasets: [
				{
					data,
					borderColor: '#f8c06a',
					borderWidth: 2,
					pointRadius: 3,
					pointBackgroundColor: '#f8c06a',
					tension: 0.4,
					fill: true,
					backgroundColor: (c) => {
						const g = c.chart.ctx.createLinearGradient(
							0,
							0,
							0,
							200,
						);
						g.addColorStop(0, 'rgba(248,192,106,0.22)');
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
						label: (v) => `Rs ${v.raw.toLocaleString()}`,
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
document
	.getElementById('earn-chips')
	.querySelectorAll('.chip')
	.forEach((c) => {
		c.addEventListener('click', () => {
			document
				.getElementById('earn-chips')
				.querySelectorAll('.chip')
				.forEach((x) => x.classList.remove('on'));
			c.classList.add('on');
			drawEarnChart(Number(c.dataset.r));
		});
	});

// ── ONLINE TOGGLE ──
let isOnline = true;
function toggleOnline() {
	isOnline = !isOnline;
	const sw = document.getElementById('sw'),
		dot = document.getElementById('ol-dot'),
		txt = document.getElementById('ol-txt');
	sw.classList.toggle('on', isOnline);
	dot.className = 'ol-dot ' + (isOnline ? 'on' : 'off');
	txt.textContent = isOnline ? 'Online & Available' : 'Offline';
	toast(
		isOnline ? 'You are now online' : 'You are now offline',
		isOnline ? 'green' : 'red',
	);
}

// ── PAGE NAV ──
const TITLES = {
	overview: 'Overview',
	jobs: 'Assigned Jobs',
	fleet: 'My Fleet',
	earnings: 'Earnings',
	profile: 'Profile & Docs',
	support: 'Help & Support',
};
const SUBS = {
	overview: 'Welcome back, Ram Logistics · Friday 27 Mar 2026',
	jobs: 'Accept, manage and track your job assignments',
	fleet: 'Track vehicle availability and driver assignments',
	earnings: 'Your payouts and financial summary',
	profile: 'Business details and document verification status',
	support: 'Get help from the Mero Ghar team',
};
function goPage(name) {
	document.querySelectorAll('.pg').forEach((p) => p.classList.remove('on'));
	document.querySelectorAll('.na').forEach((a) => a.classList.remove('on'));
	const pg = document.getElementById('pg-' + name);
	if (pg) pg.classList.add('on');
	const na = document.querySelector(`.na[data-page="${name}"]`);
	if (na) na.classList.add('on');
	document.getElementById('pg-title').textContent = TITLES[name] || name;
	document.getElementById('pg-sub').textContent = SUBS[name] || '';
	if (name === 'earnings') setTimeout(() => drawEarnChart(6), 80);
}
document.querySelectorAll('.na[data-page]').forEach((a) => {
	a.addEventListener('click', (e) => {
		e.preventDefault();
		goPage(a.dataset.page);
	});
});

// ── JOB CHIPS ──
document
	.getElementById('job-chips')
	.querySelectorAll('.chip')
	.forEach((c) => {
		c.addEventListener('click', () => {
			document
				.getElementById('job-chips')
				.querySelectorAll('.chip')
				.forEach((x) => x.classList.remove('on'));
			c.classList.add('on');
			renderJobs(c.dataset.f);
		});
	});
document
	.getElementById('fleet-chips')
	.querySelectorAll('.chip')
	.forEach((c) => {
		c.addEventListener('click', () => {
			document
				.getElementById('fleet-chips')
				.querySelectorAll('.chip')
				.forEach((x) => x.classList.remove('on'));
			c.classList.add('on');
			renderFleet(c.dataset.f);
		});
	});

// ── ADD VEHICLE ──
function openAddVehicle() {
	document.getElementById('modal-v').classList.add('open');
}
function closeModal(id) {
	document.getElementById(id).classList.remove('open');
}
document.querySelectorAll('.overlay').forEach((o) => {
	o.addEventListener('click', (e) => {
		if (e.target === o) o.classList.remove('open');
	});
});
function submitVehicle() {
	const nm = document.getElementById('v-nm').value.trim();
	const pl = document.getElementById('v-pl').value.trim();
	const ty = document.getElementById('v-ty').value;
	const cp = document.getElementById('v-cp').value;
	const dr = document.getElementById('v-dr').value.trim();
	if (!nm || !pl || !dr) {
		toast('Please fill all required fields', 'red');
		return;
	}
	FLEET.push({
		id: 'f' + Date.now(),
		name: nm,
		plate: pl,
		type: ty,
		cap: cp || '1',
		driver: dr,
		status: 'Available',
		lastJob: '—',
	});
	closeModal('modal-v');
	toast(`${nm} added to fleet`, 'green');
	['v-nm', 'v-pl', 'v-cp', 'v-dr', 'v-dp'].forEach((id) => {
		const el = document.getElementById(id);
		if (el) el.value = '';
	});
	renderFleet();
	renderFleetStrip();
	updateKPIs();
	document.getElementById('sb-fleet').textContent = FLEET.length;
}

// ── TOAST ──
function toast(msg, color = 'gold') {
	const cols = {
		gold: '#f8c06a',
		green: '#4caf7d',
		red: '#e05e5e',
		blue: '#5e9fe0',
	};
	const wrap = document.getElementById('tw');
	const el = document.createElement('div');
	el.className = 'toast';
	el.innerHTML = `<span class="tdot" style="background:${cols[color] || cols.gold}"></span>${msg}`;
	wrap.appendChild(el);
	setTimeout(() => {
		el.classList.add('out');
		setTimeout(() => el.remove(), 220);
	}, 2800);
}

// ── COUNTER ──
function counter(id, target, fmt) {
	let c = 0;
	const el = document.getElementById(id);
	const step = Math.ceil(target / 55);
	const f = fmt || ((v) => v.toLocaleString());
	const tick = () => {
		c = Math.min(c + step, target);
		el.textContent = f(c);
		if (c < target) requestAnimationFrame(tick);
	};
	setTimeout(tick, 220);
}

// === For Getting Logo ===
function getLogoText(name) {
	return name
		.trim()
		.split(' ')
		.filter((word) => word.length > 0)
		.map((word) => word[0].toUpperCase())
		.join('');
}

// === For Saving Changes in Profile ===
function saveProfile() {
	const form = document.getElementById('profileForm');
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const ownerName = document.getElementById('ownerName').value.trim();
		const businessName = document
			.getElementById('businessName')
			.value.trim();
		const businessLogo = getLogoText(businessName);
		const phone = document.getElementById('phone').value.trim();
		const serviceRegion = document.getElementById('serviceRegion').value;
		const vendorNameDiv = document.querySelector('.v-nm');
		const vendorLocDiv = document.querySelector('.v-loc');
		const vendorLogo = document.querySelector('.v-av');
		if (!ownerName || !businessName || !phone) {
			toast('Please fill all required fields', 'red');
			return;
		}
		vendorNameDiv.textContent = businessName;
		vendorLocDiv.textContent = serviceRegion;
		vendorLogo.textContent = businessLogo;
		toast('Profile updated', 'green');
	});
}

// ── REFRESH ──
function refresh() {
	renderIncoming();
	renderCompletions();
	renderFleetStrip();
	renderJobs();
	updateKPIs();
}

// ── INIT ──
counter(
	'kv-earn',
	68500,
	(v) => `Rs ${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`,
);
renderPayouts();
refresh();
renderFleet();
saveProfile();
