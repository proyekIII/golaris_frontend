// Fungsi untuk menampilkan nama pengguna setelah login
function displayUserName() {
  // Ambil data pengguna dari localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user); // Debugging log untuk memastikan data pengguna ada

  // Ambil elemen dengan id 'userName', 'logoutButton', dan 'dashboardButton' di HTML
  const userNameDiv = document.getElementById('userName');
  const logoutButton = document.getElementById('logoutButton'); // Ambil elemen logout button
  const dashboardButton = document.getElementById('dashboardButton'); // Ambil elemen dashboard button

  if (user && userNameDiv) {
    // Ambil bagian username sebelum '@' dari email
    const email = user.email;
    const username = email.split('@')[0]; // Ambil bagian sebelum '@'

    // Tampilkan nama pengguna (email) di header
    userNameDiv.innerHTML = `Hello, ${username}`; // Menampilkan username yang diambil dari email

    // Tampilkan tombol logout dan dashboard
    if (logoutButton) {
      logoutButton.style.display = 'block'; // Tampilkan tombol logout
    }
    if (dashboardButton) {
      dashboardButton.style.display = 'block'; // Tampilkan tombol dashboard
    }
  } else {
    // Jika tidak ada user, tampilkan default
    userNameDiv.innerHTML = 'Hello, User';

    // Sembunyikan tombol logout dan dashboard
    if (logoutButton) {
      logoutButton.style.display = 'none'; // Sembunyikan tombol logout
    }
    if (dashboardButton) {
      dashboardButton.style.display = 'none'; // Sembunyikan tombol dashboard
    }
  }
}

// Panggil fungsi untuk menampilkan nama pengguna dan mengatur tombol logout serta dashboard
displayUserName();

// Fungsi untuk memeriksa login dan menampilkan harga produk
fetch('http://127.0.0.1:8000/api/products')
  .then(response => response.json())
  .then(products => {
    const productContainer = document.querySelector('.product-center');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Periksa status login

    console.log('Status login:', isLoggedIn); // Debugging

    products.forEach(product => {
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');

      const imageUrl = product.image_url || '/images/products/default_image.jpg';
      const displayPrice = isLoggedIn ? `Rp.${product.price}` : 'XXXXXXXXXX'; // Harga berdasarkan login

      productItem.innerHTML = `
        <div class="overlay">
          <a href="productDetails.html" class="product-thumb">
            <img src="${imageUrl}" alt="${product.name}" />
          </a>
        </div>
        <div class="product-info">
          <a href="productDetails.html">${product.name}</a>
          <h4>${displayPrice}</h4>
        </div>
        <ul class="icons">
          <li><i class="bx bx-heart"></i></li>
          <li class="add-to-cart"><i class="bx bx-cart"></i></li>
        </ul>
      `;

      // Event listener untuk keranjang
      productItem.querySelector('.add-to-cart').addEventListener('click', () => {
        if (isLoggedIn) {
          addToCart(product);
        } else {
          alert('Silakan login untuk menambahkan produk ke keranjang.');
        }
      });

      productContainer.appendChild(productItem);
    });
  })
  .catch(error => console.error('Error fetching products:', error));

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.name} telah ditambahkan ke keranjang!`);
}

// Event listener untuk logout
document.getElementById('logoutButton').addEventListener('click', () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  alert('Anda telah logout!');
  window.location.href = 'login.html'; // Redirect ke halaman login
});

// Event listener untuk dashboard
document.getElementById('dashboardButton').addEventListener('click', () => {
  window.location.href = '/dashboardsuppplier.html'; // Redirect ke halaman dashboard
});
