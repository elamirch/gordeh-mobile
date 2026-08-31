const TARGET_URL = 'https://gordeh.com/panel';
const PROBE_TIMEOUT_MS = 5000;
const RETRY_COUNTDOWN_SECONDS = 5;

const loadingCard = document.getElementById('loading-card');
const offlineCard = document.getElementById('offline-card');
const retryBtn = document.getElementById('retry-btn');
const btnLabel = document.getElementById('btn-label');
const countdownEl = document.getElementById('countdown');

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

let countdownTimer = null;
let isChecking = false;

function toFaDigits(num) {
    return String(num)
        .split('')
        .map((d) => FA_DIGITS[Number(d)] ?? d)
        .join('');
}

function stopCountdown() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
    }
    if (countdownEl) countdownEl.textContent = '';
}

function setChecking(checking) {
    isChecking = checking;
    retryBtn.disabled = checking;
    retryBtn.classList.toggle('loading', checking);
    btnLabel.textContent = checking ? 'در حال بررسی...' : 'تلاش مجدد';
}

function startCountdown() {
    stopCountdown();

    let remaining = RETRY_COUNTDOWN_SECONDS;
    countdownEl.textContent = 'تلاش مجدد در ' + toFaDigits(remaining) + ' ثانیه';

    countdownTimer = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
            stopCountdown();
            checkConnection();
        } else {
            countdownEl.textContent = 'تلاش مجدد در ' + toFaDigits(remaining) + ' ثانیه';
        }
    }, 1000);
}

function showOffline() {
    loadingCard.classList.add('hidden');
    offlineCard.classList.remove('hidden');
    startCountdown();
}

function checkConnection() {
    if (isChecking) return;

    stopCountdown();
    setChecking(true);

    if (!navigator.onLine) {
        setChecking(false);
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
            setChecking(false);
            showOffline();
        });
}

retryBtn.addEventListener('click', checkConnection);
window.addEventListener('online', checkConnection);

checkConnection();
