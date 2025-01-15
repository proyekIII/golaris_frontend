// Fungsi untuk mengambil data produk dan menampilkannya di halaman
fetch('http://127.0.0.1:8000/api/products')  // Pastikan URL ini sesuai dengan API endpoint
  .then(response => response.json())
  .then(products => {
    const productContainer = document.querySelector('.product-center'); // Tempat untuk menampilkan produk
    products.forEach(product => {
      // Membuat HTML untuk tiap produk
      const productItem = document.createElement('div');
      productItem.classList.add('product-item');
      
      // Menyesuaikan dengan backend yang memberikan image_url lengkap
      const imageUrl = product.image_url || '/images/products/default_image.jpg'; // Jika tidak ada gambar, tampilkan default

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
          <h4>${product.price ? '$' + product.price : 'N/A'}</h4>
        </div>
        <ul class="icons">
          <li><i class="bx bx-heart"></i></li>
          <li><i class="bx bx-search"></i></li>
          <li><i class="bx bx-cart"></i></li>
        </ul>
      `;
      
      // Menambahkan produk ke dalam kontainer
      productContainer.appendChild(productItem);
    });
  })
  .catch(error => console.error('Error fetching products:', error));
