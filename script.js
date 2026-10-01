'use strict';

/**
 * Interest Rate Calculator - business logic.
 *
 * The browser hands every input to us as a *string*. Arithmetic on strings
 * performs character concatenation ("100" + 5 === "1005") and produces NaN for
 * comparisons, which is what caused the original TypeErrors. Every value is
 * therefore converted with parseFloat() and validated before it is used.
 *
 * calculate() accepts strings, numbers or anything parseFloat understands, so
 * it is safe to call directly from the DOM or from the Jasmine specs.
 */

/**
 * Converts a raw input value to a number.
 *
 * @param {string|number} value Raw value, typically an input's .value string.
 * @returns {number} The parsed number.
 * @throws {TypeError} If the value is blank or cannot be parsed.
 */
function toNumber(value) {
  // Number('') is 0 and Number(null) is 0, so blanks must be rejected first.
  if (value === null || value === undefined || String(value).trim() === '') {
    throw new TypeError('Value is required and must be a number.');
  }

  const parsed = parseFloat(value);

  if (Number.isNaN(parsed)) {
    throw new TypeError('"' + value + '" is not a valid number.');
  }

  return parsed;
}

/**
 * Compound-interest projection.
 *
 * Interest compounds monthly: each month the opening balance earns interest and
 * then the monthly contribution is added.
 *
 * @param {string|number} principal         Initial deposit.
 * @param {string|number} monthlyContribution Amount added every month.
 * @param {string|number} annualRate        Annual interest rate in percent.
 * @param {string|number} years             Term in years.
 * @returns {{futureValue: number, totalInterest: number, totalPayments: number, monthlyInterestEarned: number}}
 */
function calculate(principal, monthlyContribution, annualRate, years) {
  // Convert every input to a number before it is used in any calculation.
  const p = toNumber(principal);
  const monthly = toNumber(monthlyContribution);
  const rate = toNumber(annualRate);
  const term = toNumber(years);

  if (p < 0 || monthly < 0 || rate < 0 || term < 0) {
    throw new RangeError('Values cannot be negative.');
  }

  // Annual percentage -> monthly decimal rate.
  const monthlyRate = rate / 100 / 12;
  const months = Math.round(term * 12);

  let balance = p;
  for (let month = 0; month < months; month += 1) {
    balance = balance + balance * monthlyRate + monthly;
  }

  const totalPayments = p + monthly * months;
  const futureValue = Math.round(balance * 100) / 100;
  const totalInterest = Math.round((futureValue - totalPayments) * 100) / 100;

  return {
    futureValue: futureValue,
    totalInterest: totalInterest,
    totalPayments: totalPayments,
    monthlyInterestEarned: months === 0 ? 0 : Math.round((totalInterest / months) * 100) / 100,
  };
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function setResult(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = currency.format(value);
}

function showError(message) {
  const node = document.getElementById('error-message');
  if (!node) return;
  node.textContent = message;
  node.hidden = message === '';
}

function handleSubmit(event) {
  if (event && typeof event.preventDefault === 'function') event.preventDefault();

  // Read the raw strings, then let calculate() convert them.
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

// Only wire up the DOM in a browser; the specs import calculate() under Node.
if (typeof document !== 'undefined') {
  const form = document.getElementById('calculator-form');
  const button = document.getElementById('calculate-button');

  if (form) form.addEventListener('submit', handleSubmit);
  if (button) button.addEventListener('click', handleSubmit);
}

// Exported for the Jasmine specs and for the Webpack bundle.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculate: calculate, toNumber: toNumber };
}