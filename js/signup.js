document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Ambil data dari form
    const name = document.getElementById('name').value.trim(); // Ambil nilai name
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const passwordRepeat = document.getElementById('password_repeat').value.trim();

    // Validasi input
    if (!name || !email || !password || !passwordRepeat) {
        alert("Please fill out all fields!");
        return;
    }

    // Validasi password
    if (password !== passwordRepeat) {
        alert("Password does not match!");
        return;
    }

    // Menyiapkan data form
    const formData = new FormData();
    formData.append('name', name); // Tambahkan name ke form data
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', passwordRepeat);

    // Kirim data registrasi ke backend untuk mendapatkan Snap token
    fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        body: formData,
        headers: {
            // Tambahkan CORS jika backend memerlukan autentikasi tambahan
            'Accept': 'application/json',
        },
    })
        .then((response) => {
            if (!response.ok) {
                // Jika respon gagal, lemparkan error
                return response.json().then((err) => {
                    throw new Error(err.message || 'Failed to register.');
                });
            }
            return response.json();
        })
        .then((data) => {
            if (data.snap_token) {
                // Proses Snap token untuk pembayaran
                snap.pay(data.snap_token, {
                    onSuccess: function (result) {
                        alert("Payment Success: " + JSON.stringify(result));
                        window.location.href = 'login.html'; // Pengalihan setelah sukses ke signin.html
                        // Pengalihan setelah sukses
                    },
                    onPending: function (result) {
                        alert("Payment Pending: " + JSON.stringify(result));
                        window.location.href = 'login.html'; // Pengalihan untuk pembayaran pending
                    },
                    onError: function (result) {
                        alert("Payment Error: " + JSON.stringify(result));
                        window.location.href = 'signup.html'; // Pengalihan untuk pembayaran gagal
                    },
                    onClose: function () {
                        alert("Payment was canceled.");
                    },
                });
            } else {
                alert('Error generating payment token');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('silahkan melakukan pembayaran');
        });
});

// Fungsi untuk mengatur pembatalan
document.querySelector('.cancelbtn').addEventListener('click', function () {
    window.location.href = '/'; // Pengalihan ke halaman utama
});
