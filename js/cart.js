document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const selectAllCheckbox = document.getElementById('select-all');
    const checkoutBtn = document.getElementById('checkout-btn');
    const totalPriceElement = document.getElementById('total-price');

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
                    totalPrice += item.price * item.quantity;
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
                 location.reload(); // Reload halaman untuk memperbarui tampilan
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
                location.reload(); // Refresh halaman untuk update UI
            });
        });

        // Tombol checkout
        checkoutBtn.addEventListener('click', () => {
            const selectedItems = cartItems.filter((item, index) => {
                const checkbox = document.querySelector(`.select-item[data-index="${index}"]`);
                return checkbox.checked;
            });
            localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
            window.location.href = 'pesanan.html';
        });

        // Hitung total harga saat pertama kali
        calculateTotalPrice();
    }
});

