const API_BASE_URL = (() => {
  // ── Production (deployed backend on Railway) ──
  const PROD_URL = 'https://backend-production-d51a3.up.railway.app';

  // ── Android auto-detect ──
  if (typeof window.Capacitor !== 'undefined') {
    const platform = window.Capacitor.getPlatform();
    if (platform === 'android') return PROD_URL;
    if (platform === 'ios') return PROD_URL;
  }

  // ── Web browser ──
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  // Not localhost → use production URL
  return PROD_URL;
})();

// ── In-App Update Check ──
const APP_VERSION = '1.4.0';
const GITHUB_REPO = 'SubodhShah-Dev/Mero-Ghar-Logistics-Website';

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}

async function checkForUpdates() {
  if (!navigator.onLine) return;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );
    if (!res.ok) return;
    const data = await res.json();
    const latestTag = data.tag_name.replace(/^v/i, '');
    if (compareVersions(latestTag, APP_VERSION) <= 0) return;

    const existing = document.getElementById('update-dialog');
    if (existing) return;

    const overlay = document.createElement('div');
    overlay.id = 'update-dialog';
    overlay.setAttribute(
      'style',
      'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.72);display:flex;align-items:center;justify-content:center;padding:24px;'
    );

    overlay.innerHTML =
      '<div style="background:#111d16;border:1px solid rgba(248,192,106,0.18);border-radius:16px;padding:28px 24px 22px;max-width:340px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.5);text-align:center">' +
      '<div style="width:52px;height:52px;border-radius:50%;background:rgba(248,192,106,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">' +
      '<svg width="26" height="26" fill="none" stroke="#f8c06a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">' +
      '<path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></div>' +
      '<p style="color:#eef2ee;font-size:17px;font-weight:700;margin:0 0 4px">Update Available</p>' +
      '<p style="color:rgba(238,242,238,0.55);font-size:13px;margin:0 0 18px">Version ' +
      data.tag_name +
      ' is ready to download</p>' +
      '<div style="display:flex;gap:10px">' +
      '<button id="update-later" style="flex:1;padding:11px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.07);background:transparent;color:rgba(238,242,238,0.55);font-size:13px;font-weight:500;cursor:pointer">Later</button>' +
      '<a href="' +
      data.html_url +
      '" target="_blank" style="flex:1;padding:11px 16px;border-radius:10px;background:#f8c06a;color:#0b1510;font-size:13px;font-weight:700;text-decoration:none;display:inline-block;text-align:center">Download</a>' +
      '</div></div>';

    document.body.appendChild(overlay);
    document.getElementById('update-later').onclick = () => overlay.remove();
  } catch (e) {
    // Silently fail — don't block the app
  }
}

// Run check after page settles (don't block rendering)
if (typeof document !== 'undefined') {
  if (document.readyState === 'complete') {
    setTimeout(checkForUpdates, 3000);
  } else {
    window.addEventListener('load', () => setTimeout(checkForUpdates, 3000));
  }
}
