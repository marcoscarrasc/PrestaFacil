import { CONFIG } from '../config.js';

export class LoanForm {
    constructor(config) {
        this.calculator = config.calculator;
        
        // DOM Elements
        this.step1 = document.getElementById('step1');
        this.step2 = document.getElementById('step2');
        this.btnNextStep = document.getElementById('btnNextStep');
        this.btnBack = document.getElementById('btnBack');
        this.formAmountDisplay = document.getElementById('formAmountDisplay');
        this.loanForm = document.getElementById('loanForm');

        this.init();
    }

    init() {
        this.btnNextStep.addEventListener('click', () => this.showStep2());
        this.btnBack.addEventListener('click', () => this.showStep1());
        this.loanForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    showStep2() {
        const { principal } = this.calculator.getValues();
        this.formAmountDisplay.textContent = principal;
        this.step1.style.display = 'none';
        this.step2.style.display = 'block';
    }

    showStep1() {
        this.step2.style.display = 'none';
        this.step1.style.display = 'block';
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const { principal, months, totalToPay, monthlyFee } = this.calculator.getValues();

        // Get form values
        const data = {
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            dni: document.getElementById('dni').value.trim(),
            address: document.getElementById('address').value.trim(),
            department: document.getElementById('department').value,
            job: document.getElementById('job').value,
            incomeFreq: document.getElementById('incomeFreq').value,
            personalIncome: document.getElementById('personalIncome').value,
            householdIncome: document.getElementById('householdIncome').value,
            email: document.getElementById('email').value.trim(),
            currentLocation: document.getElementById('currentLocation').value
        };

        const message = `Hola PrestaFácil 👋,\n\nAcabo de completar mi solicitud de préstamo instantánea.\n
*Datos del Préstamo:*
- 💰 Monto: S/ ${principal}
- ⏱ Plazo: ${months} meses
- 💵 Cuota: S/ ${monthlyFee}
- 🧾 Total a pagar: S/ ${totalToPay}

*Mis Datos Personales:*
- 👤 Nombre: ${data.fullName}
- 📱 Celular: ${data.phone}
- 🪪 DNI: ${data.dni}
- 📧 Correo: ${data.email}
- 🌎 Departamento: ${data.department}

*Datos Laborales y Financieros:*
- 📍 Domicilio: ${data.address} (${data.currentLocation})
- 💼 Trabajo: ${data.job}
- 💸 Frec. Ingresos: ${data.incomeFreq}
- 📈 Ingresos Pers.: S/ ${data.personalIncome}
- 📈 Ingresos Hogar: S/ ${data.householdIncome}

*Declaraciones:*
- ✅ No soy PEP ni pariente
- ✅ Acepto Términos y Condiciones

Quedo atento a la evaluación. ¡Gracias!`;

        const encodedMessage = encodeURIComponent(message);
        const waURL = `https://api.whatsapp.com/send?phone=${CONFIG.ADMIN_PHONE}&text=${encodedMessage}`;
        window.open(waURL, '_blank');
    }
}
