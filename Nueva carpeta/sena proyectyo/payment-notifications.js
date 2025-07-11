// Sistema de Notificaciones de Pago
class PaymentNotifications {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        this.createNotificationContainer();
        this.setupPaymentListeners();
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'payment-notifications';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }

    setupPaymentListeners() {
        // Escuchar eventos de pago
        document.addEventListener('payment:processing', () => {
            this.showProcessingNotification();
        });

        document.addEventListener('payment:success', (e) => {
            this.showSuccessNotification(e.detail);
        });

        document.addEventListener('payment:error', (e) => {
            this.showErrorNotification(e.detail);
        });

        document.addEventListener('payment:security', () => {
            this.showSecurityNotification();
        });
    }

    showProcessingNotification() {
        const notification = this.createNotification({
            type: 'processing',
            title: 'Procesando Pago',
            message: 'Estamos procesando tu pago de forma segura...',
            icon: 'fas fa-spinner fa-spin',
            duration: 0 // Sin auto-cerrar
        });
        this.notifications.push(notification);
    }

    showSuccessNotification(orderDetails) {
        // Remover notificación de procesamiento
        this.removeNotificationByType('processing');
        
        const notification = this.createNotification({
            type: 'success',
            title: '¡Pago Exitoso!',
            message: `Tu pedido ${orderDetails.orderId} ha sido confirmado`,
            icon: 'fas fa-check-circle',
            duration: 5000
        });
        this.notifications.push(notification);
    }

    showErrorNotification(error) {
        // Remover notificación de procesamiento
        this.removeNotificationByType('processing');
        
        const notification = this.createNotification({
            type: 'error',
            title: 'Error en el Pago',
            message: error.message || 'Hubo un problema con tu pago. Intenta nuevamente.',
            icon: 'fas fa-exclamation-triangle',
            duration: 8000
        });
        this.notifications.push(notification);
    }

    showSecurityNotification() {
        const notification = this.createNotification({
            type: 'security',
            title: 'Pago Seguro',
            message: 'Tu información está protegida con encriptación SSL de 256 bits',
            icon: 'fas fa-shield-alt',
            duration: 4000
        });
        this.notifications.push(notification);
    }

    createNotification({ type, title, message, icon, duration }) {
        const notification = document.createElement('div');
        notification.className = `payment-notification ${type}`;
        notification.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            border-left: 4px solid ${this.getTypeColor(type)};
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 15px;">
                <div style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: ${this.getTypeColor(type)};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 18px;
                ">
                    <i class="${icon}"></i>
                </div>
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0; color: #333; font-size: 16px;">
                        ${title}
                    </h4>
                    <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">
                        ${message}
                    </p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    margin-left: 10px;
                ">&times;</button>
            </div>
        `;

        const container = document.getElementById('payment-notifications');
        container.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-cerrar si tiene duración
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }

        return notification;
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    removeNotificationByType(type) {
        const notifications = document.querySelectorAll(`.payment-notification.${type}`);
        notifications.forEach(notification => {
            this.removeNotification(notification);
        });
    }

    getTypeColor(type) {
        const colors = {
            'processing': '#007bff',
            'success': '#28a745',
            'error': '#dc3545',
            'security': '#17a2b8'
        };
        return colors[type] || '#6c757d';
    }

    // Métodos para disparar eventos
    static triggerProcessing() {
        document.dispatchEvent(new CustomEvent('payment:processing'));
    }

    static triggerSuccess(orderDetails) {
        document.dispatchEvent(new CustomEvent('payment:success', {
            detail: orderDetails
        }));
    }

    static triggerError(error) {
        document.dispatchEvent(new CustomEvent('payment:error', {
            detail: error
        }));
    }

    static triggerSecurity() {
        document.dispatchEvent(new CustomEvent('payment:security'));
    }
}

// Inicializar sistema de notificaciones
let paymentNotifications;
document.addEventListener('DOMContentLoaded', () => {
    paymentNotifications = new PaymentNotifications();
}); 