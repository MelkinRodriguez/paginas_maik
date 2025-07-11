// admin.js

document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('product-name').value.trim();
    const desc = document.getElementById('product-desc').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value.trim();

    if (!name || !desc || !price || !image) return;

    // Enviar producto al backend
    try {
        const res = await fetch('http://localhost:3001/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, desc, price, image })
        });
        if (!res.ok) throw new Error('Error al subir producto');
        document.getElementById('product-success').style.display = 'block';
        this.reset();
        setTimeout(() => {
            document.getElementById('product-success').style.display = 'none';
        }, 2000);
        renderProducts();
    } catch (err) {
        alert('Error al subir producto');
    }
});

async function renderProducts() {
    try {
        const res = await fetch('http://localhost:3001/api/products');
        const products = await res.json();
        const listDiv = document.getElementById('admin-products-list');
        const container = document.getElementById('admin-products-container');
        if (!products || products.length === 0) {
            listDiv.style.display = 'none';
            return;
        }
        listDiv.style.display = 'block';
        container.innerHTML = '';
        products.forEach(prod => {
            const item = document.createElement('div');
            item.className = 'admin-product-item';
            item.innerHTML = `
                <img src="${prod.image}" class="admin-product-img" alt="${prod.name}">
                <div class="admin-product-info">
                    <h4>${prod.name}</h4>
                    <p>${prod.desc}</p>
                </div>
                <div class="admin-product-price">$${prod.price.toFixed(2)}</div>
            `;
            container.appendChild(item);
        });
    } catch (err) {
        // Si el backend no responde, no mostrar nada
    }
}

document.addEventListener('DOMContentLoaded', renderProducts); 