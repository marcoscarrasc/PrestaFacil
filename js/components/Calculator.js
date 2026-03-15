import { CONFIG } from '../config.js';
import { formatCurrency } from '../utils.js';

export class Calculator {
    constructor(config) {
        this.onCalculate = config.onCalculate;
        
        // DOM Elements
        this.amountSlider = document.getElementById('amount');
        this.monthsSlider = document.getElementById('months');
        this.amountDisplay = document.getElementById('amountDisplay');
        this.monthsDisplay = document.getElementById('monthsDisplay');
        this.monthlyFeeDisplay = document.getElementById('monthlyFeeDisplay');
        this.totalDisplay = document.getElementById('totalDisplay');

        this.init();
    }

    init() {
        const handleInput = (e) => {
            this.calculate();
            this.updateSliderStyle(e.target);
        };

        this.amountSlider.addEventListener('input', handleInput);
        this.monthsSlider.addEventListener('input', handleInput);

        // Initial render
        this.calculate();
        this.updateSliderStyle(this.amountSlider);
        this.updateSliderStyle(this.monthsSlider);
    }

    calculate() {
        const principal = parseFloat(this.amountSlider.value);
        const months = parseInt(this.monthsSlider.value, 10);

        const totalInterest = principal * CONFIG.INTEREST_RATE_MONTHLY * months;
        const totalToPay = principal + totalInterest;
        const monthlyFee = totalToPay / months;

        // Update UI
        this.amountDisplay.textContent = principal.toLocaleString('es-PE');
        this.monthsDisplay.textContent = months;
        this.monthlyFeeDisplay.textContent = formatCurrency(monthlyFee);
        this.totalDisplay.textContent = formatCurrency(totalToPay);

        if (this.onCalculate) {
            this.onCalculate({ principal, months, totalToPay, monthlyFee });
        }
    }

    updateSliderStyle(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, #00D289 0%, #00D289 ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
    }

    getValues() {
        return {
            principal: this.amountSlider.value,
            months: this.monthsSlider.value,
            totalToPay: this.totalDisplay.textContent,
            monthlyFee: this.monthlyFeeDisplay.textContent
        };
    }
}
