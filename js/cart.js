document.addEventListener('DOMContentLoaded', () => {
    let cartItems = [];
    try {
        // Coba ambil dan parse data cart dari localStorage
        cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (error) {
        // Jika terjadi error pada parsing JSON, cartItems akan tetap kosong
        console.error('Error parsing cart data:', error);
        cartItems = [];
    }

    const cartContainer = document.getElementById('cart-items');
    const selectAllCheckbox = document.getElementById('select-all');
    const checkoutBtn = document.getElementById('checkout-btn');
    const totalPriceElement = document.getElementById('total-price');
    const orderSummaryContainer = document.getElementById('order-summary');
    const orderMessage = document.getElementById('order-message');

    // Menampilkan cart jika ada item
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>Keranjang Anda kosong.</p>';
    } else {
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <input type="checkbox" class="select-item" data-index="${index}" />
                <img src="${item.image_url}" alt="${item.name}" class="cart-item-image" />
                <div class="cart-info">
                    <h4>${item.name}</h4>
                    <p>Rp.${item.price.toLocaleString()}</p>
                    <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" data-index="${index}" min="1" />
                    <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
                </div>
                <button class="delete-item" data-index="${index}">Hapus</button>
            `;
            cartContainer.appendChild(cartItem);
        });

        const calculateTotalPrice = () => {
            let totalPrice = 0;
            cartItems.forEach((item, index) => {
                const checkbox = document.querySelector(`.select-item[data-index="${index}"]`);
                if (checkbox && checkbox.checked) {
                    const price = parseFloat(item.price); // Pastikan harga dalam angka
                    const quantity = parseInt(item.quantity, 10); // Pastikan kuantitas dalam angka

                    // Debugging log
                    console.log(`Item: ${item.name}, Harga: ${price}, Kuantitas: ${quantity}`);

                    // Pastikan harga dan kuantitas valid
                    if (!isNaN(price) && !isNaN(quantity)) {
                        totalPrice += price * quantity;
                    } else {
                        console.error(`Harga atau kuantitas tidak valid untuk item ${item.name}`);
                    }
                }
            });
            totalPriceElement.textContent = totalPrice.toLocaleString();
        };

        // Pilih semua item
        selectAllCheckbox.addEventListener('change', (event) => {
            const checkboxes = document.querySelectorAll('.select-item');
            checkboxes.forEach(checkbox => {
                checkbox.checked = event.target.checked;
            });
            calculateTotalPrice();
        });

        // Menghapus item
        const deleteButtons = document.querySelectorAll('.delete-item');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                cartItems.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cartItems));
                event.target.closest('.cart-item').remove(); // Hapus item dari DOM tanpa reload
                calculateTotalPrice(); // Update total harga setelah penghapusan
            });
        });

        // Event untuk setiap checkbox item
        const selectItemCheckboxes = document.querySelectorAll('.select-item');
        selectItemCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', calculateTotalPrice);
        });

        // Update kuantitas
        const quantityBtns = document.querySelectorAll('.quantity-btn');
        quantityBtns.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                const action = event.target.getAttribute('data-action');
                if (action === 'increase') {
                    cartItems[index].quantity += 1;
                } else if (action === 'decrease' && cartItems[index].quantity > 1) {
                    cartItems[index].quantity -= 1;
                }
                localStorage.setItem('cart', JSON.stringify(cartItems));
                calculateTotalPrice();
            });
        });

        // Tombol checkout
        checkoutBtn.addEventListener('click', () => {
            const selectedItems = cartItems.filter((item, index) => {
                const checkbox = document.querySelector(`.select-item[data-index="${index}"]`);
                return checkbox.checked;
            });

            if (selectedItems.length === 0) {
                alert('Pilih item yang ingin dipesan');
                return;
            }

            // Ambil data user dari localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            const supplierId = user && user.type === 'supplier' ? user.id : 1; // Ambil supplier_id dari data user, jika supplier

            const orderDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Mengubah format ke YYYY-MM-DD HH:MM:SS

            // Kirim data pesanan ke API untuk setiap item yang dipilih
            const orderDataPromises = selectedItems.map(item => {
                const orderData = {
                    supplier_id: supplierId,
                    product_id: item.id,  // Pastikan 'item.id' adalah ID produk yang valid
                    quantity: item.quantity,
                    order_date: orderDate, // Pastikan format tanggal sudah benar
                };

                console.log('Kirim Data Pesanan:', orderData); // Debugging log untuk data pesanan

                return fetch('http://127.0.0.1:8000/api/pesanan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text); });
                    }
                    return response.json();
                })
                .then(data => {
                    // Ambil snap_token dari response API
                    if (data.snap_token) {
                        // Lakukan redirect atau pembayaran dengan Snap token
                        window.snap.pay(data.snap_token, {
                            onSuccess: function(result) {
                                console.log('Pembayaran berhasil:', result);
                                alert('Pembayaran berhasil!');
                                // Tampilkan ringkasan pesanan atau lakukan tindakan lainnya
                            },
                            onPending: function(result) {
                                console.log('Pembayaran tertunda:', result);
                                alert('Pembayaran tertunda!');
                            },
                            onError: function(result) {
                                console.log('Pembayaran gagal:', result);
                                alert('Pembayaran gagal!');
                            },
                            onClose: function() {
                                console.log('Pembayaran ditutup');
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error('Terjadi kesalahan:', error);
                    alert(`Error: ${error.message}`);
                });
            });

            // Tunggu hingga semua pesanan terkirim
            Promise.all(orderDataPromises)
                .then(results => {
                    console.log('Hasil Pengiriman Pesanan:', results); // Debugging log hasil pengiriman
                    alert('Pesanan telah berhasil dikirim');
                })
                .catch(error => {
                    console.error('Terjadi kesalahan:', error);
                    alert('Gagal mengirim pesanan');
                });
        });

        // Hitung total harga saat pertama kali
        calculateTotalPrice();
    }
});
