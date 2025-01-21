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


document.getElementById('logoutButton').addEventListener('click', () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  alert('Anda telah logout!');
  window.location.href = 'login.html'; // Redirect ke halaman login
});

