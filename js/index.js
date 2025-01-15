const hamburer = document.querySelector(".hamburger");
const navList = document.querySelector(".nav-list");

if (hamburer) {
  hamburer.addEventListener("click", () => {
    navList.classList.toggle("open");
  });
}

// Popup
const popup = document.querySelector(".popup");
const closePopup = document.querySelector(".popup-close");

if (popup) {
  closePopup.addEventListener("click", () => {
    popup.classList.add("hide-popup");
  });

  window.addEventListener("load", () => {
    setTimeout(() => {
      popup.classList.remove("hide-popup");
    }, 1000);
  });
}



// Fungsi untuk mengambil data produk dan menampilkannya di halaman
fetch('http://127.0.0.1:8000/api/products') // Pastikan URL ini sesuai dengan API endpoint
  .then(response => response.json())
  .then(products => {
    const productContainer = document.querySelector('.product-center'); // Tempat untuk menampilkan produk

    products.forEach(product => {
      // Membuat HTML untuk tiap produk
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');

      // Menyesuaikan dengan backend yang memberikan image_url lengkap
      const imageUrl = product.image_url || '/images/products/default_image.jpg'; // Gambar default jika tidak ada

      productItem.innerHTML = `
        <div class="overlay">
          <a href="productDetails.html" class="product-thumb">
            <img src="${imageUrl}" alt="${product.name}" />
          </a>
        </div>
        <div class="product-info">
          <a href="productDetails.html">${product.name}</a>
          <h4>Rp.${product.price}</h4>
        </div>
        <ul class="icons">
          <li><i class="bx bx-heart"></i></li>
          <li class="add-to-cart"><i class="bx bx-cart"></i></li>
        </ul>
      `;

      // Menambahkan event listener untuk ikon keranjang
      productItem.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(product); // Fungsi untuk menambahkan ke LocalStorage
      });

      // Menambahkan produk ke dalam kontainer
      productContainer.appendChild(productItem);
    });
  })
  .catch(error => console.error('Error fetching products:', error));

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || []; // Ambil data keranjang dari LocalStorage
  cart.push(product); // Tambahkan produk ke dalam keranjang
  localStorage.setItem('cart', JSON.stringify(cart)); // Simpan kembali ke LocalStorage
  alert(`${product.name} telah ditambahkan ke keranjang!`);
}
