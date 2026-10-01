// script.js is CommonJS so it can be loaded with a plain <script> tag in the
// browser; the spec therefore pulls it in with require.
const { calculate } = require('../script.js');

describe('Interest Rate Calculator', () => {
  it('correctly calculates future value and interest earned over a fixed term', () => {
    // 10,000 at 5% for 10 years with 200/month.
    // Each month: balance = balance * 1.00416666... + 200.
    const result = calculate(10000, 200, 5, 10);

    const expected = 47526.55;
    expect(result.futureValue).toBeCloseTo(expected, 2);

    // Total paid in = 10,000 + (200 * 120) = 34,000.
    expect(result.totalPayments).toBeCloseTo(34000, 2);

    // Interest is the difference, and must be positive here.
    expect(result.totalInterest).toBeCloseTo(result.futureValue - result.totalPayments, 2);
    expect(result.totalInterest).toBeGreaterThan(0);

    // Average monthly interest across the term.
    expect(result.monthlyInterestEarned).toBeCloseTo(result.totalInterest / 120, 2);
  });

  it('accepts string inputs from the DOM and rejects non-numeric values', () => {
    // Values read from inputs arrive as strings; they must still work.
    const fromStrings = calculate('10000', '200', '5', '10');
    const fromNumbers = calculate(10000, 200, 5, 10);

    expect(fromStrings).toEqual(fromNumbers);
    expect(fromStrings.futureValue).toBeCloseTo(47526.55, 2);

    // A missing or malformed value must be reported, not silently coerced to NaN.
    expect(() => calculate('abc', 200, 5, 10)).toThrowError(TypeError);
    expect(() => calculate(10000, 200, 5, undefined)).toThrowError(TypeError);

    // Number('') is 0, so a cleared field must be rejected explicitly.
    expect(() => calculate('', 200, 5, 10)).toThrowError(TypeError);
    expect(() => calculate(10000, '', 5, 10)).toThrowError(TypeError);

    // Negative contributions are out of domain.
    expect(() => calculate(10000, -200, 5, 10)).toThrowError(RangeError);
  });
});