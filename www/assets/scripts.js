const TARGET_URL = 'https://gordeh.com/panel';
const PROBE_TIMEOUT_MS = 5000;
const RETRY_INTERVAL_MS = 5000;

const loadingCard = document.getElementById('loading-card');
const offlineCard = document.getElementById('offline-card');
const retryBtn = document.getElementById('retry-btn');

let retryTimer = null;

function showOffline() {
    loadingCard.classList.add('hidden');
    offlineCard.classList.remove('hidden');

    if (!retryTimer) {
        retryTimer = setInterval(checkConnection, RETRY_INTERVAL_MS);
    }
}

function checkConnection() {
    if (!navigator.onLine) {
        showOffline();
        return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

    fetch(TARGET_URL, {
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal
    })
        .then(() => {
            clearTimeout(timeout);
            window.location.replace(TARGET_URL);
        })
        .catch(() => {
            clearTimeout(timeout);
            showOffline();
        });
}

retryBtn.addEventListener('click', checkConnection);
window.addEventListener('online', checkConnection);

checkConnection();
