// Sistema de Checkout - CHIC BOUTIQUE Marketplace
class CheckoutSystem {
    constructor() {
        this.cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        this.selectedPaymentMethod = null;
        this.shippingCost = 5.99;
        this.taxRate = 0.19; // 19% IVA
        this.init();
    }

    init() {
        this.loadOrderItems();
        this.calculateTotals();
        this.bindEvents();
        this.setupFormValidation();
    }

    bindEvents() {
        // Validación de tarjeta de crédito
        document.getElementById('cardNumber')?.addEventListener('input', (e) => {
            this.formatCardNumber(e.target);
        });

        document.getElementById('expiryDate')?.addEventListener('input', (e) => {
            this.formatExpiryDate(e.target);
        });

        document.getElementById('cvv')?.addEventListener('input', (e) => {
            this.formatCVV(e.target);
        });

        // Validación de formulario
        document.getElementById('checkout-form')?.addEventListener('input', () => {
            this.validateForm();
        });
    }

    loadOrderItems() {
        const orderItemsContainer = document.getElementById('order-items');
        if (!orderItemsContainer) return;

        orderItemsContainer.innerHTML = '';

        if (this.cartItems.length === 0) {
            orderItemsContainer.innerHTML = '<p style="text-align: center; color: #666;">No hay productos en el carrito</p>';
            return;
        }

        this.cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="order-item-info">
                    <h4>${item.name}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <div class="order-item-price">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            `;
            orderItemsContainer.appendChild(itemElement);
        });
    }

    calculateTotals() {
        const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let taxes = subtotal * this.taxRate;
        let shipping = this.shippingCost;
        let discount = 0;
        // Aplicar cupón si existe
        if (typeof appliedCoupon !== 'undefined' && appliedCoupon) {
            if (appliedCoupon.type === 'percent') {
                discount = subtotal * (appliedCoupon.value / 100);
            } else if (appliedCoupon.type === 'shipping') {
                shipping = 0;
            }
        }
        const total = subtotal + shipping + taxes - discount;
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('taxes').textContent = `$${taxes.toFixed(2)}`;
        // Mostrar descuento si aplica
        let discountRow = document.getElementById('discount-row');
        if (discount > 0) {
            if (!discountRow) {
                discountRow = document.createElement('div');
                discountRow.className = 'summary-row';
                discountRow.id = 'discount-row';
                discountRow.innerHTML = `<span>Descuento:</span><span id='discount-amount'>-$${discount.toFixed(2)}</span>`;
                document.querySelector('.checkout-summary .order-summary').appendChild(discountRow);
            } else {
                document.getElementById('discount-amount').textContent = `-$${discount.toFixed(2)}`;
            }
        } else if (discountRow) {
            discountRow.remove();
        }
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        return { subtotal, taxes, shipping, discount, total };
    }

    selectPaymentMethod(method) {
        this.selectedPaymentMethod = method;
        
        // Remover selección anterior
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Seleccionar método actual
        document.querySelector(`.payment-method.${method}`).classList.add('selected');
        
        // Mostrar/ocultar formularios específicos
        document.getElementById('credit-card-form').style.display = 'none';
        document.getElementById('transfer-form').style.display = 'none';
        
        if (method === 'credit-card') {
            document.getElementById('credit-card-form').style.display = 'block';
            // Mostrar notificación de seguridad para tarjeta
            PaymentNotifications.triggerSecurity();
        } else if (method === 'transfer') {
            document.getElementById('transfer-form').style.display = 'block';
        }
        
        this.validateForm();
    }

    formatCardNumber(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        input.value = value.substring(0, 19);
    }

    formatExpiryDate(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        input.value = value.substring(0, 5);
    }

    formatCVV(input) {
        let value = input.value.replace(/\D/g, '');
        input.value = value.substring(0, 4);
    }

    validateForm() {
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 
            'address', 'city', 'postalCode', 'country'
        ];
        
        let isValid = true;
        
        // Validar campos requeridos
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ff4757';
            } else if (field) {
                field.style.borderColor = '#e1e1e1';
            }
        });
        
        // Validar email
        const email = document.getElementById('email');
        if (email && email.value && !this.isValidEmail(email.value)) {
            isValid = false;
            email.style.borderColor = '#ff4757';
        }
        
        // Validar método de pago
        if (!this.selectedPaymentMethod) {
            isValid = false;
        }
        
        // Validar tarjeta de crédito si es el método seleccionado
        if (this.selectedPaymentMethod === 'credit-card') {
            const cardNumber = document.getElementById('cardNumber');
            const expiryDate = document.getElementById('expiryDate');
            const cvv = document.getElementById('cvv');
            const cardName = document.getElementById('cardName');
            
            if (!cardNumber?.value || !expiryDate?.value || !cvv?.value || !cardName?.value) {
                isValid = false;
            }
        }
        
        // Habilitar/deshabilitar botón de checkout
        const checkoutBtn = document.getElementById('place-order-btn');
        if (checkoutBtn) {
            checkoutBtn.disabled = !isValid;
        }
        
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupFormValidation() {
        // Validar en tiempo real
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => {
                this.validateForm();
            });
        });
    }

    async processOrder() {
        if (!this.validateForm()) {
            PaymentNotifications.triggerError({ message: 'Por favor, completa todos los campos requeridos' });
            return;
        }

        if (this.cartItems.length === 0) {
            PaymentNotifications.triggerError({ message: 'Tu carrito está vacío' });
            return;
        }

        const checkoutBtn = document.getElementById('place-order-btn');
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        // Mostrar notificación de procesamiento
        PaymentNotifications.triggerProcessing();

        try {
            // Simular procesamiento de pago
            await this.simulatePaymentProcessing();
            
            // Crear orden
            const order = this.createOrder();
            
            // Guardar orden en localStorage
            this.saveOrder(order);
            
            // Limpiar carrito
            localStorage.removeItem('cart');
            
            // Mostrar notificación de éxito
            PaymentNotifications.triggerSuccess({ orderId: order.id });
            
            // Mostrar confirmación
            this.showOrderConfirmation(order);
            
        } catch (error) {
            PaymentNotifications.triggerError({ message: 'Error al procesar el pago. Intenta nuevamente.' });
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> Confirmar Pedido';
        }
    }

    async simulatePaymentProcessing() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular éxito 90% de las veces
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Pago rechazado'));
                }
            }, 2000);
        });
    }

    createOrder() {
        const { subtotal, taxes, total } = this.calculateTotals();
        
        return {
            id: 'ORD-' + Date.now(),
            date: new Date().toISOString(),
            items: this.cartItems,
            customer: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                postalCode: document.getElementById('postalCode').value,
                country: document.getElementById('country').value
            },
            payment: {
                method: this.selectedPaymentMethod,
                cardNumber: this.selectedPaymentMethod === 'credit-card' ? 
                    document.getElementById('cardNumber').value.replace(/\s/g, '') : null
            },
            totals: {
                subtotal,
                shipping: this.shippingCost,
                taxes,
                total
            },
            status: 'pending',
            notes: document.getElementById('notes').value
        };
    }

    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    showOrderConfirmation(order) {
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
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                position: relative;
            ">
                <button onclick="this.parentElement.parentElement.remove(); window.location.href='index.html'" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                ">&times;</button>
                
                <div style="margin-bottom: 30px;">
                    <i class="fas fa-check-circle" style="font-size: 64px; color: #2ed573; margin-bottom: 20px;"></i>
                    <h2 style="color: #333; margin-bottom: 10px;">¡Pedido Confirmado!</h2>
                    <p style="color: #666; margin-bottom: 20px;">Tu pedido ha sido procesado exitosamente</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: left;">
                    <h4 style="margin: 0 0 10px 0; color: #333;">Detalles del Pedido:</h4>
                    <p style="margin: 5px 0; color: #666;"><strong>Número de Pedido:</strong> ${order.id}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Total:</strong> $${order.totals.total.toFixed(2)}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Método de Pago:</strong> ${this.getPaymentMethodName(order.payment.method)}</p>
                    <p style="margin: 5px 0; color: #666;"><strong>Estado:</strong> <span style="color: #2ed573;">Pendiente de Envío</span></p>
                </div>
                
                <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                    Te hemos enviado un correo de confirmación con todos los detalles.
                </p>
                
                <button onclick="this.parentElement.parentElement.remove(); window.location.href='index.html'" style="
                    padding: 12px 24px;
                    background: #2ed573;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-right: 10px;
                ">
                    Continuar Comprando
                </button>
                
                <button onclick="window.location.href='orders.html'" style="
                    padding: 12px 24px;
                    background: #f1f1f1;
                    color: #333;
                    border: none;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                ">
                    Ver Mis Pedidos
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    getPaymentMethodName(method) {
        const methods = {
            'credit-card': 'Tarjeta de Crédito',
            'paypal': 'PayPal',
            'cash': 'Efectivo',
            'transfer': 'Transferencia Bancaria'
        };
        return methods[method] || method;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2ed573' : '#ff4757'};
            color: white;
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

// Funciones globales
function selectPaymentMethod(method) {
    checkout.selectPaymentMethod(method);
}

function processOrder() {
    checkout.processOrder();
}

// Inicializar sistema de checkout
let checkout;
document.addEventListener('DOMContentLoaded', () => {
    checkout = new CheckoutSystem();
}); 