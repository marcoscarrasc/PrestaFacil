import { formatCurrency } from '../utils.js';

export class Schedule {
    constructor(elementId) {
        this.container = document.getElementById(elementId);
    }

    render(months, monthlyFee) {
        this.container.innerHTML = '';
        let currentDate = new Date();
        
        for (let i = 1; i <= months; i++) {
            currentDate.setDate(currentDate.getDate() + 30); // Approx 30 days per month
            const dateStr = currentDate.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
            
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center py-3 border-b border-slate-100 last:border-0 text-sm';
            li.innerHTML = `
                <span class="font-semibold text-slate-700">Cuota ${i}</span>
                <span class="text-slate-400 font-medium">${dateStr}</span>
                <span class="font-black text-slate-800 tracking-tight">S/ ${formatCurrency(monthlyFee)}</span>
            `;
            this.container.appendChild(li);
        }
    }
}
