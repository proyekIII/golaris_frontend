document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
  
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Mencegah reload halaman
  
      // Ambil data dari form
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        // Kirim permintaan ke API menggunakan Fetch
        const response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Jika login berhasil
          messageDiv.style.color = 'green';
          messageDiv.textContent = 'Login successful!';
          messageDiv.style.display = 'block';
  
          // Simpan token atau ID pengguna ke localStorage
          localStorage.setItem('supplier', JSON.stringify(data.supplier));
  
          // Redirect ke halaman lain
          setTimeout(() => {
            window.location.href = 'index.html'; // Ganti dengan halaman dashboard Anda
          }, 2000);
        } else {
          // Tampilkan pesan error dari server
          messageDiv.style.color = 'red';
          messageDiv.textContent = data.error || 'Login failed. Please try again.';
          messageDiv.style.display = 'block';
        }
      } catch (error) {
        // Jika ada error dalam proses request
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Something went wrong. Please try again later.';
        messageDiv.style.display = 'block';
      }
    });
  });
  