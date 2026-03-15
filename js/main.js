import { Calculator } from './components/Calculator.js';
import { Schedule } from './components/Schedule.js';
import { LoanForm } from './components/LoanForm.js';

document.addEventListener('DOMContentLoaded', () => {
    const schedule = new Schedule('scheduleList');
    
    const calculator = new Calculator({
        onCalculate: ({ months, monthlyFee }) => {
            schedule.render(months, monthlyFee);
        }
    });

    const loanForm = new LoanForm({
        calculator: calculator
    });
});
