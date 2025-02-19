document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Login berhasil!');

      // Simpan informasi pengguna dan status login ke LocalStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');

      // Redirect sesuai peran
      if (data.type === 'admin') {
        window.location.href = 'dashboard.html';
      } else if (data.type === 'supplier') {
        window.location.href = 'index.html';
      }
    } else {
      alert(data.error || 'Login gagal!');
    }
  } catch (error) {
    alert('Terjadi kesalahan. Silakan coba lagi.');
  }
});
