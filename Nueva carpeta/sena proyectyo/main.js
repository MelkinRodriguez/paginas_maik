// Carrito de compras - CHIC BOUTIQUE Marketplace
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.init();
    }

    init() {
        this.updateCartCount();
        this.bindEvents();
    }

    bindEvents() {
        // Botón para abrir/cerrar el carrito
        document.getElementById('cart-toggle').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCart();
        });

        // Botón para cerrar el carrito
        document.getElementById('close-cart').addEventListener('click', () => {
            this.closeCart();
        });

        // Botón de checkout
        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.checkout();
        });

        // Cerrar carrito al hacer clic fuera
        document.getElementById('cart-modal').addEventListener('click', (e) => {
            if (e.target.id === 'cart-modal') {
                this.closeCart();
            }
        });
    }

    addItem(id, name, price, image) {
        const existingItem = this.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: id,
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Producto agregado al carrito');
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
    }

    updateQuantity(id, newQuantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(id);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartCount();
            }
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = count;
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666;">Tu carrito está vacío</p>';
            cartTotal.textContent = '0';
            return;
        }

        let total = 0;
        cartItems.innerHTML = '';

        this.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="quantity-btn" onclick="cart.removeItem(${item.id})" style="background: #ff4757; color: white;">×</button>
            `;
            cartItems.appendChild(itemElement);
        });

        cartTotal.textContent = total.toFixed(2);
    }

    toggleCart() {
        const modal = document.getElementById('cart-modal');
        if (modal.style.display === 'block') {
            this.closeCart();
        } else {
            this.openCart();
        }
    }

    openCart() {
        document.getElementById('cart-modal').style.display = 'block';
        this.updateCartDisplay();
    }

    closeCart() {
        document.getElementById('cart-modal').style.display = 'none';
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        // Redirigir a la página de checkout
        window.location.href = 'checkout.html';
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
        this.closeCart();
    }

    showNotification(message) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #111;
            color: #fff;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1001;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Función global para agregar al carrito (usada en los botones)
function addToCart(id, name, price, image) {
    cart.addItem(id, name, price, image);
}

// Inicializar el carrito cuando se carga la página
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});

// Animaciones para las tarjetas de productos
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// Búsqueda de productos (funcionalidad básica)
function searchProducts(query) {
    const products = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase();
    let visibleCount = 0;
    
    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        const productDesc = product.querySelector('.description').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            product.style.display = 'flex';
            product.style.opacity = '1';
            product.style.transform = 'scale(1)';
            visibleCount++;
        } else {
            product.style.display = 'none';
            product.style.opacity = '0';
            product.style.transform = 'scale(0.8)';
        }
    });
    
    updateProductsCount(visibleCount);
    
    // Forzar reflow para que el layout se actualice correctamente
    setTimeout(() => {
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.style.display = 'none';
            productsGrid.offsetHeight; // Trigger reflow
            productsGrid.style.display = 'grid';
        }
    }, 100);
}

// Filtros por categoría
function filterByCategory(category) {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'flex';
            product.style.opacity = '1';
            product.style.transform = 'scale(1)';
            visibleCount++;
        } else {
            product.style.display = 'none';
            product.style.opacity = '0';
            product.style.transform = 'scale(0.8)';
        }
    });
    
    updateProductsCount(visibleCount);
    
    // Forzar reflow para que el layout se actualice correctamente
    setTimeout(() => {
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.style.display = 'none';
            productsGrid.offsetHeight; // Trigger reflow
            productsGrid.style.display = 'grid';
        }
    }, 100);
}

// Filtros por precio
function filterByPrice(priceRange) {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        const price = parseFloat(product.dataset.price);
        let show = false;
        
        switch(priceRange) {
            case '0-50':
                show = price >= 0 && price <= 50;
                break;
            case '50-100':
                show = price > 50 && price <= 100;
                break;
            case '100-200':
                show = price > 100 && price <= 200;
                break;
            case '200+':
                show = price > 200;
                break;
            default:
                show = true;
        }
        
        if (show) {
            product.style.display = 'flex';
            product.style.opacity = '1';
            product.style.transform = 'scale(1)';
            visibleCount++;
        } else {
            product.style.display = 'none';
            product.style.opacity = '0';
            product.style.transform = 'scale(0.8)';
        }
    });
    
    updateProductsCount(visibleCount);
    
    // Forzar reflow para que el layout se actualice correctamente
    setTimeout(() => {
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.style.display = 'none';
            productsGrid.offsetHeight; // Trigger reflow
            productsGrid.style.display = 'grid';
        }
    }, 100);
}

// Actualizar contador de productos visibles
function updateProductsCount(count) {
    const totalProducts = document.querySelectorAll('.product-card').length;
    const countElement = document.querySelector('.products-count');
    const productsGrid = document.querySelector('.products-grid');
    
    if (countElement) {
        countElement.textContent = `Mostrando ${count} de ${totalProducts} productos`;
    }
    
    // Mostrar mensaje cuando no hay productos
    if (count === 0) {
        if (productsGrid) {
            const noProductsMessage = document.createElement('div');
            noProductsMessage.className = 'no-products-message';
            noProductsMessage.innerHTML = `
                <div style="text-align: center; padding: 50px 20px; color: #666;">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; color: #ddd;"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros filtros o términos de búsqueda</p>
                </div>
            `;
            
            // Remover mensaje anterior si existe
            const existingMessage = productsGrid.querySelector('.no-products-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            productsGrid.appendChild(noProductsMessage);
        }
    } else {
        // Remover mensaje si hay productos
        const existingMessage = productsGrid.querySelector('.no-products-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
}

// Sistema de favoritos
function toggleFavorite(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
    } else {
        favorites.push(productId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton(productId);
}

function updateFavoriteButton(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const button = document.querySelector(`[data-favorite="${productId}"]`);
    
    if (button) {
        if (favorites.includes(productId)) {
            button.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i>';
        } else {
            button.innerHTML = '<i class="far fa-heart"></i>';
        }
    }
}

// Vista de detalles del producto
function viewProductDetails(productId) {
    // Crear modal de detalles del producto
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    // Obtener información del producto (en un caso real, esto vendría de una base de datos)
    const productInfo = getProductInfo(productId);
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        ">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            ">&times;</button>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="${productInfo.image}" alt="${productInfo.name}" style="
                    width: 100%;
                    max-width: 300px;
                    height: auto;
                    border-radius: 10px;
                ">
            </div>
            
            <h2 style="color: #333; margin-bottom: 10px;">${productInfo.name}</h2>
            <p style="color: #666; margin-bottom: 15px;">${productInfo.description}</p>
            <p style="font-size: 24px; font-weight: bold; color: #2ed573; margin-bottom: 20px;">
                $${productInfo.price}
            </p>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="addToCart(${productId}, '${productInfo.name}', ${productInfo.price}, '${productInfo.image}'); this.parentElement.parentElement.parentElement.remove()" style="
                    padding: 12px 24px;
                    background: #2ed573;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                ">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Función para obtener información del producto (simulada)
function getProductInfo(productId) {
    const products = {
        1: {
            name: 'Tacones Elegantes',
            description: 'Tacones elegantes para ocasiones especiales. Material de alta calidad y diseño moderno.',
            price: 89.99,
            image: './img/taconm32.png'
        },
        2: {
            name: 'Zapatos Azules',
            description: 'Zapatos casuales en color azul, perfectos para el día a día.',
            price: 75.50,
            image: './img/zapatos azules .jpeg'
        },
        3: {
            name: 'Blusa Casual',
            description: 'Blusa cómoda para el día a día, fabricada con materiales suaves.',
            price: 45.99,
            image: './img/blusas.jpg'
        },
        4: {
            name: 'Blusa Rosa',
            description: 'Blusa elegante en color rosa, ideal para ocasiones especiales.',
            price: 55.00,
            image: './img/busa rosa.jpeg'
        },
        5: {
            name: 'Bolso Elegante',
            description: 'Bolso de mano elegante y espacioso, perfecto para complementar cualquier outfit.',
            price: 120.99,
            image: './img/bolsosportada.png'
        },
        6: {
            name: 'Bolso Casual',
            description: 'Bolso casual perfecto para el día, con múltiples compartimentos.',
            price: 95.00,
            image: './img/bolso.png'
        },
        7: {
            name: 'Aretes Elegantes',
            description: 'Aretes elegantes para complementar tu look, fabricados con materiales de calidad.',
            price: 25.99,
            image: './img/ARETES.jpeg'
        },
        8: {
            name: 'Vestido Elegante',
            description: 'Vestido elegante para ocasiones especiales, con un diseño único y moderno.',
            price: 150.00,
            image: './img/vestido sub.png'
        },
        9: {
            name: 'Zapatos Blancos',
            description: 'Zapatos blancos elegantes y versátiles, perfectos para cualquier ocasión.',
            price: 65.00,
            image: './img/zapatos blancos.jpeg'
        },
        10: {
            name: 'Zapatos Rojos',
            description: 'Zapatos rojos llamativos y elegantes, ideales para hacer una declaración de estilo.',
            price: 85.00,
            image: './img/zapatos rojos .jpeg'
        },
        11: {
            name: 'Tacones Altos',
            description: 'Tacones altos para ocasiones especiales, con diseño elegante y cómodo.',
            price: 95.00,
            image: './img/tacon1.PNG'
        },
        12: {
            name: 'Tacones Elegantes',
            description: 'Tacones elegantes con diseño único, perfectos para complementar tu outfit.',
            price: 110.00,
            image: './img/tacon2.PNG'
        },
        13: {
            name: 'Blusa Negra',
            description: 'Blusa negra elegante y versátil, ideal para cualquier ocasión.',
            price: 48.00,
            image: './img/busa1.jpeg'
        },
        14: {
            name: 'Blusa Elegante',
            description: 'Blusa elegante para ocasiones especiales, con detalles únicos.',
            price: 52.00,
            image: './img/busa3 5.jpeg'
        },
        15: {
            name: 'Vestido de Fiesta',
            description: 'Vestido elegante para fiestas y eventos, con diseño sofisticado.',
            price: 180.00,
            image: './img/vestido a1.png'
        },
        16: {
            name: 'Vestido Casual',
            description: 'Vestido casual perfecto para el día, cómodo y elegante.',
            price: 165.00,
            image: './img/vestido d2.jpeg'
        },
        17: {
            name: 'Bolso Pequeño',
            description: 'Bolso pequeño y elegante para salidas, práctico y estiloso.',
            price: 85.00,
            image: './img/bolso (2).png'
        },
        18: {
            name: 'Bolso de Mano',
            description: 'Bolso de mano elegante y funcional, perfecto para el día a día.',
            price: 110.00,
            image: './img/bolso1.jpeg'
        },
        19: {
            name: 'Anillos Elegantes',
            description: 'Anillos elegantes para complementar tu estilo, con diseño sofisticado.',
            price: 35.00,
            image: './img/ANILLOS SERPI.jpeg'
        },
        20: {
            name: 'Cadena Elegante',
            description: 'Cadena elegante para complementar tu outfit, con detalles únicos.',
            price: 28.00,
            image: './img/CADENA ESTENCION.jpeg'
        },
        21: {
            name: 'Tablilla Elegante',
            description: 'Tablilla elegante para complementar tu look, con diseño moderno.',
            price: 42.00,
            image: './img/TABILLERA PER.jpeg'
        }
    };
    
    return products[productId] || {
        name: 'Producto',
        description: 'Descripción del producto',
        price: 0,
        image: './img/logo.png'
    };
}

// Ordenar productos
function sortProducts(criteria) {
    const productsGrid = document.querySelector('.products-grid');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        const nameA = a.querySelector('h3').textContent;
        const nameB = b.querySelector('h3').textContent;
        
        switch(criteria) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'name-asc':
                return nameA.localeCompare(nameB);
            case 'name-desc':
                return nameB.localeCompare(nameA);
            default:
                return 0;
        }
    });
    
    // Reordenar en el DOM
    products.forEach(product => {
        productsGrid.appendChild(product);
    });
}

// Función para resetear filtros
function resetFilters() {
    const products = document.querySelectorAll('.product-card');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    
    // Resetear inputs
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'all';
    if (priceFilter) priceFilter.value = 'all';
    
    // Mostrar todos los productos
    products.forEach(product => {
        product.style.display = 'flex';
        product.style.opacity = '1';
        product.style.transform = 'scale(1)';
    });
    
    updateProductsCount(products.length);
}

// Inicializar contador de productos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const visibleProducts = document.querySelectorAll('.product-card[style*="display: flex"], .product-card:not([style*="display: none"])');
    updateProductsCount(visibleProducts.length);
});

function showAddToCartMessage(productName) {
    let toast = document.createElement('div');
    toast.textContent = `¡${productName} agregado al carrito!`;
    toast.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: #111;
        color: #fff;
        padding: 16px 28px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 4px 16px rgba(0,0,0,0.18);
        opacity: 0;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 1800);
}
