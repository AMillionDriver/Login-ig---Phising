// ========== PASSWORD TOGGLE ==========
document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const toggleBtn = document.getElementById('togglePassword');

  if (!passwordInput || !toggleBtn) return;

  const toggleIcon = toggleBtn.querySelector('i');

  // Munculkan tombol mata hanya jika ada teks yang diketik
  passwordInput.addEventListener('input', function() {
    if (this.value.length > 0) {
      toggleBtn.classList.add('show');
    } else {
      toggleBtn.classList.remove('show');
    }
  });

  // Logika switch tipe input antara password dan text
  toggleBtn.addEventListener('click', function() {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    
    // Ganti ikon mata
    if (toggleIcon) {
      toggleIcon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
    }
  });
});
