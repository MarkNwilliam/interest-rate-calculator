'use strict';

/**
 * Core business logic for the Interest Rate Calculator.
 *
 * Every argument arrives from the DOM as a string, so each one is coerced to a
 * number before it is used in arithmetic. Doing the coercion here is what keeps
 * string concatenation (and the resulting NaN / TypeError) out of the maths.
 *
 * @param {string|number} principal       Initial deposit.
 * @param {string|number} monthlyContribution Amount added every month.
 * @param {string|number} annualRate      Annual interest rate as a percentage.
 * @param {string|number} years           Number of years to compound over.
 * @returns {{futureValue: number, totalInterest: number, totalPayments: number, monthlyInterestEarned: number}}
 */
function calculate(principal, monthlyContribution, annualRate, years) {
  // Number('') is 0, so a cleared field would silently compute nonsense.
  // Reject blank input before coercing.
  const raw = [principal, monthlyContribution, annualRate, years];
  if (raw.some((value) => value === null || value === undefined || String(value).trim() === '')) {
    throw new TypeError('All four arguments must be numeric.');
  }

  // Coerce first, so string inputs cannot turn into implicit concatenation.
  const p = Number(principal);
  const monthly = Number(monthlyContribution);
  const rate = Number(annualRate);
  const term = Number(years);

  if (!Number.isFinite(p) || !Number.isFinite(monthly) || !Number.isFinite(rate) || !Number.isFinite(term)) {
    throw new TypeError('All four arguments must be numeric.');
  }
  if (p < 0 || monthly < 0 || rate < 0 || term < 0) {
    throw new RangeError('Values cannot be negative.');
  }

  // Monthly rate; the annual percentage is divided by 100 first.
  const monthlyRate = rate / 100 / 12;
  const months = Math.round(term * 12);

  let balance = p;
  for (let month = 0; month < months; month += 1) {
    // Interest accrues on the opening balance, then the contribution lands.
    balance = balance + balance * monthlyRate + monthly;
  }

  const totalPayments = p + monthly * months;
  const futureValue = Math.round(balance * 100) / 100;
  const totalInterest = Math.round((futureValue - totalPayments) * 100) / 100;

  return {
    futureValue,
    totalInterest,
    totalPayments,
    // Average monthly interest earned across the whole term.
    monthlyInterestEarned: months === 0 ? 0 : Math.round((totalInterest / months) * 100) / 100,
  };
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const setResult = (id, value) => {
  const node = document.getElementById(id);
  if (node) node.textContent = currency.format(value);
};

const showError = (message) => {
  const node = document.getElementById('error-message');
  if (!node) return;
  node.textContent = message;
  node.hidden = message === '';
};

function handleSubmit(event) {
  if (event && typeof event.preventDefault === 'function') event.preventDefault();

  const readValue = (id) => {
    const input = document.getElementById(id);
    return input ? input.value : '';
  };

  try {
    const result = calculate(
      readValue('initial-investment'),
      readValue('monthly-contribution'),
      readValue('annual-interest-rate'),
      readValue('investment-years')
    );

    showError('');
    setResult('future-value', result.futureValue);
    setResult('total-interest', result.totalInterest);
    setResult('total-payments', result.totalPayments);
    setResult('monthly-interest', result.monthlyInterestEarned);
  } catch (error) {
    showError(error.message);
  }
}

// Only wire up the DOM when running in a browser; the specs import calculate()
// directly under Node.
if (typeof document !== 'undefined') {
  const form = document.getElementById('calculator-form');
  const button = document.getElementById('calculate-button');

  if (form) form.addEventListener('submit', handleSubmit);
  if (button) button.addEventListener('click', handleSubmit);
}

// Export for Jasmine under Node and for the bundled browser build.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculate };
}