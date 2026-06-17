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
