document.addEventListener('DOMContentLoaded', () => {
  const productContainer = document.querySelector('.product-center');

  if (productContainer) {
      fetch('http://127.0.0.1:8000/api/products')
          .then(response => response.json())
          .then(products => {
              products.forEach(product => {
                 
                  const imageUrl = product.image_url || '/images/products/default_image.jpg';

                  productItem.innerHTML = `
                      <div class="overlay">
                          <a href="productDetails.html" class="product-thumb">
                              <img src="${imageUrl}" alt="${product.name}" />
                          </a>
                          ${product.discount ? `<span class="discount">${product.discount}%</span>` : ''}
                      </div>
                      <div class="product-info">
                          <span>${product.category ? product.category.name : 'No Category'}</span>
                          <a href="productDetails.html">${product.name}</a>
                          <h4>${product.price ? 'Rp.' + product.price.toLocaleString() : 'N/A'}</h4>
                      </div>
                      <ul class="icons">
                          <li><i class="bx bx-heart"></i></li>
                          <li><i class="bx bx-search"></i></li>
                          <li><i class="bx bx-cart add-to-cart" data-product-id="${product.id}"></i></li>
                      </ul>
                  `;

                  productContainer.appendChild(productItem);

                  // Menambahkan event listener untuk ikon keranjang
                  const addToCartButton = productItem.querySelector('.bx-cart');
                  addToCartButton.addEventListener('click', () => {
                      const user = JSON.parse(localStorage.getItem('user'));
                      if (!user) {
                          alert('Silakan login terlebih dahulu.');
                          window.location.href = 'login.html'; // Arahkan ke halaman login jika belum login
                          return;
                      }

                      const cartItems = JSON.parse(localStorage.getItem(`cart-${user.id}`)) || [];

                      const productInCart = cartItems.find(item => item.id === product.id);
                      if (productInCart) {
                          productInCart.quantity += 1; // Menambah kuantitas jika produk sudah ada di keranjang
                      } else {
                          cartItems.push({ ...product, quantity: 1 }); // Menambahkan produk baru ke keranjang
                      }

                      localStorage.setItem(`cart-${user.id}`, JSON.stringify(cartItems)); // Simpan keranjang berdasarkan ID user
                      alert('Produk berhasil ditambahkan ke keranjang!');
                      
                      // Setelah menambahkan ke keranjang, arahkan ke halaman keranjang
                      window.location.href = 'cart.html';
                  });
              });
          })
          .catch(error => console.error('Error fetching products:', error));
  }
});
