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

// Expose on window so other scripts (chatbot.js, etc.) can reliably find it
window.API_BASE_URL = API_BASE_URL;

// ── In-App Update Check & Download ──
const APP_VERSION = '2.6.0';
const GITHUB_REPO = 'SubodhShah-Dev/Mero-Ghar-Logistic';

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}

function blobToBase64(blob) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onloadend = function () { resolve(reader.result.split(',')[1]); };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function updateDialogHtml(content) {
  return (
    '<div style="background:#111d16;border:1px solid rgba(248,192,106,0.18);border-radius:16px;padding:28px 24px 22px;max-width:340px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.5);text-align:center">' +
    content +
    '</div>'
  );
}

async function downloadUpdate(downloadUrl, version) {
  var isNative = typeof window.Capacitor !== 'undefined' && window.Capacitor.Plugins && window.Capacitor.Plugins.Filesystem;
  var dialog = document.getElementById('update-dialog');
  if (!dialog) return;
  var inner = dialog.firstElementChild;

  function openInBrowser() {
    window.open(downloadUrl, '_system');
    dialog.remove();
  }

  function showInstallPrompt(uri) {
    inner.innerHTML = updateDialogHtml(
      '<div style="width:52px;height:52px;border-radius:50%;background:rgba(76,175,125,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">' +
      '<svg width="26" height="26" fill="none" stroke="#4caf7d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">' +
      '<path d="M5 13l4 4L19 7"/></svg></div>' +
      '<p style="color:#eef2ee;font-size:15px;font-weight:600;margin:0 0 4px">Download Complete</p>' +
      '<p style="color:rgba(238,242,238,0.55);font-size:13px;margin:0 0 4px">Version ' + version + '</p>' +
      '<p style="color:rgba(238,242,238,0.35);font-size:11px;margin:0 0 18px">' + uri + '</p>' +
      '<div style="display:flex;gap:10px;flex-direction:column">' +
      '<button id="install-btn" style="width:100%;padding:13px 16px;border-radius:10px;background:#f8c06a;color:#0b1510;font-size:14px;font-weight:700;cursor:pointer">Install Now</button>' +
      '<button id="update-later" style="width:100%;padding:11px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.07);background:transparent;color:rgba(238,242,238,0.55);font-size:13px;font-weight:500;cursor:pointer">Later</button>' +
      '</div>'
    );
    document.getElementById('install-btn').onclick = function () {
      window.open(uri, '_system');
      dialog.remove();
    };
    document.getElementById('update-later').onclick = function () { dialog.remove(); };
  }

  function showError(msg) {
    inner.innerHTML = updateDialogHtml(
      '<div style="width:52px;height:52px;border-radius:50%;background:rgba(224,94,94,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">' +
      '<svg width="26" height="26" fill="none" stroke="#e05e5e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">' +
      '<path d="M6 18L18 6M6 6l12 12"/></svg></div>' +
      '<p style="color:#eef2ee;font-size:15px;font-weight:600;margin:0 0 4px">Download Failed</p>' +
      '<p style="color:rgba(238,242,238,0.55);font-size:12px;margin:0 0 18px">' + msg + '</p>' +
      '<div style="display:flex;gap:10px">' +
      '<button id="update-later" style="flex:1;padding:11px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.07);background:transparent;color:rgba(238,242,238,0.55);font-size:13px;font-weight:500;cursor:pointer">Close</button>' +
      '<button id="browser-btn" style="flex:1;padding:11px 16px;border-radius:10px;background:#f8c06a;color:#0b1510;font-size:13px;font-weight:700;cursor:pointer">Download in Browser</button>' +
      '</div>'
    );
    document.getElementById('update-later').onclick = function () { dialog.remove(); };
    document.getElementById('browser-btn').onclick = openInBrowser;
  }

  if (!isNative) {
    openInBrowser();
    return;
  }

  // ── Inject spin animation once ──
  if (!document.getElementById('spin-style')) {
    var s = document.createElement('style');
    s.id = 'spin-style';
    s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(s);
  }

  inner.innerHTML = updateDialogHtml(
    '<div style="width:44px;height:44px;border:3px solid rgba(248,192,106,0.15);border-top-color:#f8c06a;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 14px"></div>' +
    '<p style="color:#eef2ee;font-size:15px;font-weight:600;margin:0 0 4px">Downloading Update</p>' +
    '<p id="dl-progress" style="color:rgba(238,242,238,0.5);font-size:13px;margin:0">Starting...</p>'
  );

  try {
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 45000);

    document.getElementById('dl-progress').textContent = 'Connecting...';
    var response = await fetch(downloadUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Server returned ' + response.status);

    document.getElementById('dl-progress').textContent = 'Downloading (7.5 MB)...';
    var blob = await response.blob();

    document.getElementById('dl-progress').textContent = 'Processing...';
    var base64 = await blobToBase64(blob);

    document.getElementById('dl-progress').textContent = 'Saving...';
    await window.Capacitor.Plugins.Filesystem.writeFile({
      path: 'meroghar-update.apk',
      data: base64,
      directory: 'CACHE'
    });

    var uriResult = await window.Capacitor.Plugins.Filesystem.getUri({
      path: 'meroghar-update.apk',
      directory: 'CACHE'
    });

    showInstallPrompt(uriResult.uri);

  } catch (e) {
    if (e.name === 'AbortError') {
      showError('Connection timed out. Try downloading in your browser.');
    } else {
      showError(e.message || 'Network error');
    }
  }
}

async function checkForUpdates() {
  if (!navigator.onLine) return;

  // ── Cache: only hit GitHub API every 2 hours ──
  var CACHE_KEY = 'mg_update_cache';
  var now = Date.now();
  try {
    var cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && cached.timestamp && (now - cached.timestamp) < 7200000) {
      if (compareVersions(cached.latestVersion, APP_VERSION) > 0) {
        showUpdateDialog(cached.latestVersion, cached.downloadUrl);
      }
      return;
    }
  } catch (e) {}

  try {
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 10000);

    var res = await fetch(
      'https://api.github.com/repos/' + GITHUB_REPO + '/releases/latest',
      { headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return;
    var data = await res.json();
    var latestTag = data.tag_name.replace(/^v/i, '');
    if (compareVersions(latestTag, APP_VERSION) <= 0) return;

    var apkAsset = data.assets && data.assets.find(function (a) {
      return a.name.indexOf('.apk') > -1;
    });
    var downloadUrl = apkAsset ? apkAsset.browser_download_url : data.html_url;

    // Cache result
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: now,
        latestVersion: latestTag,
        downloadUrl: downloadUrl
      }));
    } catch (e) {}

    showUpdateDialog(latestTag, downloadUrl);

  } catch (e) {
    // Silently fail
  }
}

function showUpdateDialog(version, downloadUrl) {
  var existing = document.getElementById('update-dialog');
  if (existing) return;

  var overlay = document.createElement('div');
  overlay.id = 'update-dialog';
  overlay.setAttribute(
    'style',
    'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.72);display:flex;align-items:center;justify-content:center;padding:24px;'
  );

  overlay.innerHTML = updateDialogHtml(
    '<div style="width:52px;height:52px;border-radius:50%;background:rgba(248,192,106,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">' +
    '<svg width="26" height="26" fill="none" stroke="#f8c06a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">' +
    '<path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></div>' +
    '<p style="color:#eef2ee;font-size:17px;font-weight:700;margin:0 0 4px">Update Available</p>' +
    '<p style="color:rgba(238,242,238,0.55);font-size:13px;margin:0 0 18px">Version v' + version + '</p>' +
    '<div style="display:flex;gap:10px">' +
    '<button id="update-later" style="flex:1;padding:11px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.07);background:transparent;color:rgba(238,242,238,0.55);font-size:13px;font-weight:500;cursor:pointer">Skip This</button>' +
    '<button id="update-download" style="flex:1;padding:11px 16px;border-radius:10px;background:#f8c06a;color:#0b1510;font-size:13px;font-weight:700;cursor:pointer">Download Update</button>' +
    '</div>'
  );

  document.body.appendChild(overlay);
  document.getElementById('update-later').onclick = function () { overlay.remove(); };
  document.getElementById('update-download').onclick = function () {
    downloadUpdate(downloadUrl, version);
  };
}

// ── Safe JSON parse helper ──
function safeParse(str, fallback) {
  if (typeof str !== 'string') return fallback;
  try { return JSON.parse(str); } catch (e) { return fallback; }
}

// ── Shared toast notification ──
function showToast(msg, color) {
  var colors = { green: '#4caf7d', red: '#e05e5e', gold: '#f8c06a', blue: '#60a5fa' };
  var wrap = document.getElementById('toast-wrap') || document.getElementById('toast-container');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap';
    wrap.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;width:calc(100% - 32px);max-width:400px;pointer-events:none';
    document.body.appendChild(wrap);
  }
  var el = document.createElement('div');
  el.style.cssText = 'display:flex;align-items:center;gap:10px;background:#111d16;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px 18px;font-size:14px;color:#eef2ee;box-shadow:0 8px 32px rgba(0,0,0,0.4);pointer-events:auto;opacity:0;transform:translateY(8px);transition:opacity 0.3s ease,transform 0.3s ease';
  // trigger animation
  requestAnimationFrame(function () {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
  var dotColor = colors[color] || colors.gold;
  var dot = document.createElement('span');
  dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + dotColor + ';flex-shrink:0';
  el.appendChild(dot);
  el.appendChild(document.createTextNode(msg));
  wrap.appendChild(el);
  setTimeout(function () {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s ease';
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
  }, 3000);
}

// Run check after page settles (don't block rendering)
if (typeof document !== 'undefined') {
  if (document.readyState === 'complete') {
    setTimeout(checkForUpdates, 3000);
  } else {
    window.addEventListener('load', function () { setTimeout(checkForUpdates, 3000); });
  }
}
