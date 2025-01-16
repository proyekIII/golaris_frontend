document.querySelectorAll(".navList").forEach(function(element) {
    element.addEventListener('click', function() {
      
        document.querySelectorAll(".navList").forEach(function(e) {
            e.classList.remove('active');
        });
  
        // Add active class to the clicked navList element
        this.classList.add('active');
  
        // Get the index of the clicked navList element
        var index = Array.from(this.parentNode.children).indexOf(this);
  
        // Hide all data-table elements
        document.querySelectorAll(".data-table").forEach(function(table) {
            table.style.display = 'none';
        });
  
        // Show the corresponding table based on the clicked index
        var tables = document.querySelectorAll(".data-table");
        if (tables.length > index) {
            tables[index].style.display = 'block';
        }
  
        // Handle the Category menu click (index 1 for "Category")
        if (index === 1) {
            fetchCategories();
        }
    });
  });
  
//   // Fungsi untuk mengambil produk dan menampilkannya di tabel
//   function fetchProducts() {
//       fetch('http://127.0.0.1:8000/api/products')
//           .then(response => {
//               if (!response.ok) {
//                   throw new Error(`HTTP error! Status: ${response.status}`);
//               }
//               return response.json();
//           })
//           .then(data => {
//               const tableBody = document.getElementById('productDataTable').getElementsByTagName('tbody')[0];
//               tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru
  
//               if (data.length === 0) {
//                   tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No products available</td></tr>`;
//                   return;
//               }
  
//               data.forEach(product => {
//                   const categoryName = product.category ? product.category.name : 'No Category'; // Cek jika kategori ada
//                   const imageUrl = product.image_url ? product.image_url : 'default_image_path.jpg'; // Default gambar jika kosong
  
//                   const row = tableBody.insertRow();
//                   row.innerHTML = `
//                       <td>${product.id}</td>
//                       <td>${product.name}</td>
//                       <td>
//                           <img src="${imageUrl}" alt="Product Image" style="width: 100px; height: auto;">
//                       </td>
//                       <td>${product.price}</td>
//                       <td>${product.stock}</td>
//                       <td>${categoryName}</td>
//                       <td>
//                           <button onclick="editProduct(${product.id})">Edit</button>
//                           <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
//                       </td>
//                   `;
//               });
//           })
//           .catch(error => {
//               console.error('Error fetching products:', error);
//               const tableBody = document.getElementById('productDataTable').getElementsByTagName('tbody')[0];
//               tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">Failed to load products</td></tr>`;
//           });
//   }
  
    
//   // Fungsi untuk mengambil kategori dan mengisi dropdown serta menampilkan kategori dalam tabel
//   function fetchCategories() {
//     fetch('http://127.0.0.1:8000/api/categories')
//         .then(response => response.json())
//         .then(data => {
//             const tableBody = document.getElementById('categoryDataTable').getElementsByTagName('tbody')[0];
//             tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru
  
//             data.forEach(category => {
//                 const row = tableBody.insertRow();
//                 row.innerHTML = `
//                     <td>${category.id}</td>
//                     <td>${category.name}</td>
//                     <td>
//                         <button onclick="editCategory(${category.id})">Edit</button>
//                         <button class="delete" onclick="deleteCategory(${category.id})">Delete</button>
//                     </td>
//                 `;
//             });
//         })
//         .catch(error => console.error('Error fetching categories:', error));
//   }
  
//   // Fungsi untuk menambahkan produk
//   function addProduct(event) {
//     event.preventDefault();
  
//     const productName = document.getElementById('productName').value;
//     const productDescription = document.getElementById('productDescription').value;
//     const productPrice = document.getElementById('productPrice').value;
//     const productStock = document.getElementById('productStock').value;
//     const categoryId = document.getElementById('categoryId').value;
  
//     fetch('http://127.0.0.1:8000/api/products', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             name: productName,
//             description: productDescription,
//             price: productPrice,
//             stock: productStock,
//             category_id: categoryId
//         }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert('Product added successfully!');
//         hideAddProductForm();
//         fetchProducts(); // Refresh produk setelah penambahan
//     })
//     .catch(error => console.error('Error adding product:', error));
//   }
  
//   // Fungsi untuk menambahkan kategori
//   function addCategory(event) {
//     event.preventDefault();
  
//     const categoryName = document.getElementById('categoryName').value;
  
//     fetch('http://127.0.0.1:8000/api/categories', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: categoryName }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert('Category added successfully!');
//         hideAddCategoryForm();
//         fetchCategories(); // Refresh kategori setelah penambahan
//     })
//     .catch(error => console.error('Error adding category:', error));
//   }
  
//   // Fungsi untuk mengedit produk
//   function editProduct(productId) {
//     alert('Edit product with ID: ' + productId);
//     // Implementasikan logika edit produk sesuai kebutuhanmu
//   }
  
//   // Fungsi untuk mengedit kategori
//   function editCategory(categoryId) {
//     alert('Edit category with ID: ' + categoryId);
//     // Implementasikan logika edit kategori sesuai kebutuhanmu
//   }
  
//   // Fungsi untuk menghapus produk
//   function deleteProduct(productId) {
//     if (confirm('Are you sure you want to delete this product?')) {
//         fetch(`http://127.0.0.1:8000/api/products/${productId}`, {
//             method: 'DELETE',
//         })
//         .then(response => response.json())
//         .then(data => {
//             alert('Product deleted successfully');
//             fetchProducts(); // Refresh produk setelah penghapusan
//         })
//         .catch(error => console.error('Error deleting product:', error));
//     }
//   }
  
//   // Fungsi untuk menghapus kategori
//   function deleteCategory(categoryId) {
//     if (confirm('Are you sure you want to delete this category?')) {
//         fetch(`http://127.0.0.1:8000/api/categories/${categoryId}`, {
//             method: 'DELETE',
//         })
//         .then(response => response.json())
//         .then(data => {
//             alert('Category deleted successfully');
//             fetchCategories(); // Refresh kategori setelah penghapusan
//         })
//         .catch(error => console.error('Error deleting category:', error));
//     }
//   }
  
//   // Fungsi untuk menampilkan form tambah kategori
//   function showAddCategoryForm() {
//     document.getElementById('addCategoryForm').style.display = 'block';
//     document.querySelector('.data-table').style.display = 'none';
//   }
  
//   // Fungsi untuk menyembunyikan form tambah kategori
//   function hideAddCategoryForm() {
//     document.getElementById('addCategoryForm').style.display = 'none';
//     document.querySelector('.data-table').style.display = 'block';
//   }
  
//   // Fungsi untuk menampilkan form tambah produk
//   function showAddProductForm() {
//     document.getElementById('addProductForm').style.display = 'block';
//   }
  
//   // Fungsi untuk menyembunyikan form tambah produk
//   function hideAddProductForm() {
//     document.getElementById('addProductForm').style.display = 'none';
//   }
  
//   // Fungsi untuk mengelola klik pada menu navigasi
//   document.querySelectorAll(".navList").forEach(function(element) {
//     element.addEventListener('click', function() {
//         document.querySelectorAll(".navList").forEach(function(e) {
//             e.classList.remove('active');
//         });
//         this.classList.add('active');
  
//         var index = Array.from(this.parentNode.children).indexOf(this);
//         document.querySelectorAll(".data-table").forEach(function(table) {
//             table.style.display = 'none';
//         });
  
//         var tables = document.querySelectorAll(".data-table");
//         if (tables.length > index) {
//             tables[index].style.display = 'block';
//         }
  
//         if (index === 1) {
//             fetchCategories(); // Handle the Category menu click
//         }
//     });
//   });
  
//   // Panggil fungsi untuk menampilkan produk dan kategori saat halaman dimuat
//   document.addEventListener('DOMContentLoaded', function() {
//     fetchProducts();
//     fetchCategories();
//   });
  
  
  
  
//   // Fungsi untuk mengambil data pesanan
//   function fetchOrders() {
//       fetch('http://127.0.0.1:8000/api/pesanan')
//           .then(response => {
//               if (!response.ok) {
//                   throw new Error(`HTTP error! Status: ${response.status}`);
//               }
//               return response.json();
//           })
//           .then(data => {
//               const tableBody = document.getElementById('orderDataTable').getElementsByTagName('tbody')[0]; // Pastikan ID tabel sudah sesuai
//               tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru
  
//               if (data.length === 0) {
//                   tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No orders available</td></tr>`;
//                   return;
//               }
  
//               data.forEach(order => {
//                   const productName = order.product ? order.product.name : 'No Product'; // Cek jika produk ada
//                   const productPrice = order.price || 'N/A';
//                   const totalPrice = order.total_price || 'N/A';
//                   const status = order.status || 'N/A';
//                   const orderDate = order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A';
  
//                   const row = tableBody.insertRow();
//                   row.innerHTML = `
//                       <td>${order.id}</td>
//                       <td>${productName}</td>
//                       <td>${order.quantity}</td>
//                       <td>${productPrice}</td>
//                       <td>${totalPrice}</td>
//                       <td>${status}</td>
//                       <td>${orderDate}</td>
//                   `;
//               });
//           })
//           .catch(error => {
//               console.error('Error fetching orders:', error);
//               const tableBody = document.getElementById('orderDataTable').getElementsByTagName('tbody')[0];
//               tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;">Failed to load orders</td></tr>`;
//           });
//   }