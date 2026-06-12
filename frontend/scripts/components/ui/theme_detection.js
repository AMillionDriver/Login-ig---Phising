// ========== THEME DETECTION ==========
/**
 * Mendeteksi secara otomatis apakah perangkat user menggunakan mode Gelap atau Terang.
 * Mengikuti perubahan pengaturan sistem secara real-time.
 */
const detectTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const applyTheme = (isDark) => {
    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
  };

  // Jalankan saat pertama kali dimuat
  applyTheme(prefersDark.matches);

  // Pantau perubahan tema di pengaturan sistem perangkat
  prefersDark.addEventListener('change', (e) => {
    applyTheme(e.matches);
  });
};

// Eksekusi fungsi deteksi
detectTheme();
