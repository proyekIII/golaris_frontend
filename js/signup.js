document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Ambil data dari form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordRepeat = document.getElementById('password_repeat').value;

    // Validasi password
    if (password !== passwordRepeat) {
        alert("Password does not match!");
        return;
    }

    // Menyiapkan data form
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', passwordRepeat);

    // Kirim data registrasi ke backend untuk mendapatkan Snap token
    fetch('http://localhost/proyek3/public/api/register', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.snap_token) {
            // Jika Snap token berhasil didapat, lanjutkan ke proses pembayaran
            snap.pay(data.snap_token, {
                onSuccess: function(result) {
                    alert("Payment Success: " + JSON.stringify(result));
                    // Lakukan pengalihan atau pembaruan status pembayaran setelah sukses
                    window.location.href = '/thank-you'; // Contoh pengalihan setelah sukses
                },
                onPending: function(result) {
                    alert("Payment Pending: " + JSON.stringify(result));
                    // Tampilkan notifikasi jika pembayaran tertunda
                    window.location.href = '/payment-pending'; // Pengalihan untuk pembayaran pending
                },
                onError: function(result) {
                    alert("Payment Error: " + JSON.stringify(result));
                    // Tampilkan notifikasi jika pembayaran gagal
                    window.location.href = '/payment-error'; // Pengalihan untuk pembayaran gagal
                }
            });
        } else {
            alert('Error generating payment token');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while processing your registration and payment.');
    });
});

// Fungsi untuk mengatur pembayaran jika tombol dibatalkan
document.querySelector('.cancelbtn').addEventListener('click', function() {
    window.location.href = '/'; // Pengalihan ke halaman utama atau halaman lain
});
