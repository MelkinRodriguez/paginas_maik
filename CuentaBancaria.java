public class CuentaBancaria {
    private String titular;
    private String numeroCuenta;
    private double saldo;

    // Constructor
    public CuentaBancaria(String titular, String numeroCuenta, double saldo) {
        this.titular = titular;
        this.numeroCuenta = numeroCuenta;
        this.saldo = saldo;
    }

    // Mostrar datos de la cuenta
    public void mostrarDatos() {
        System.out.println("Titular: " + titular);
        System.out.println("Número de Cuenta: " + numeroCuenta);
        System.out.println("Saldo: $" + saldo);
    }

    // Depositar dinero
    public void depositar(double cantidad) {
        if (cantidad > 0) {
            saldo += cantidad;
            System.out.println("Se depositaron $" + cantidad + ". Nuevo saldo: $" + saldo);
        } else {
            System.out.println("La cantidad a depositar debe ser positiva.");
        }
    }

    // Retirar dinero
    public void retirar(double cantidad) {
        if (cantidad > 0) {
            if (saldo >= cantidad) {
                saldo -= cantidad;
                System.out.println("Se retiraron $" + cantidad + ". Nuevo saldo: $" + saldo);
            } else {
                System.out.println("Fondos insuficientes.");
            }
        } else {
            System.out.println("La cantidad a retirar debe ser positiva.");
        }
    }

    // Transferir dinero a otra cuenta
    public void transferir(CuentaBancaria otraCuenta, double cantidad) {
        if (cantidad > 0) {
            if (saldo >= cantidad) {
                saldo -= cantidad;
                otraCuenta.saldo += cantidad;
                System.out.println("Se transfirieron $" + cantidad + " a la cuenta de " + otraCuenta.titular);
            } else {
                System.out.println("Fondos insuficientes para la transferencia.");
            }
        } else {
            System.out.println("La cantidad a transferir debe ser positiva.");
        }
    }

   //metod
    public static void main(String[] args) {
        CuentaBancaria cuenta1 = new CuentaBancaria("Juan Pérez", "123456789", 1000.0);
        CuentaBancaria cuenta2 = new CuentaBancaria("María López", "987654321", 500.0);

        cuenta1.mostrarDatos();
        cuenta1.depositar(200);
        cuenta1.retirar(150);
        cuenta1.transferir(cuenta2, 300);

        System.out.println("\nDatos de la cuenta 2 después de la transferencia:");
        cuenta2.mostrarDatos();
    }
}
