# Interest Rate Calculator

A single-page compound-interest calculator built with plain HTML, CSS and
JavaScript, unit-tested with Jasmine and bundled with Webpack.

## Project name

**Interest Rate Calculator** — a compound savings calculator that projects the
future value of an initial deposit plus monthly contributions at a given annual
interest rate.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page markup, favicon link, CSS/JS references and SEO metadata. |
| `style.css` | Styling for the calculator and its results panel. |
| `script.js` | The `calculate()` business logic plus DOM wiring. |
| `favicon.ico` | 32×32 site icon. |
| `spec/interestCalculatorSpec.js` | Jasmine specs for `calculate()`. |
| `webpack.config.js` | Bundles `script.js` into `dist/main.js`. |
| `evidence/` | Terminal output captured for each assignment task. |

## How the calculation works

Interest compounds monthly. Each month the opening balance earns interest and
then the monthly contribution is added:

```text
balance = balance + (balance × annualRate / 100 / 12) + monthlyContribution
```

`calculate()` coerces every argument to a number before doing arithmetic, so
values read from the DOM (always strings) cannot produce implicit string
concatenation. Blank and non-numeric input throws a `TypeError`; negative input
throws a `RangeError`.

## Scripts

Run the unit tests:

```bash
npx jasmine
```

Build the distributable bundle:

```bash
npx webpack
```

## Tests

Two specs cover the compound-interest arithmetic over a fixed term and the
input-validation behaviour, including string inputs from the DOM.

```text
2 specs, 0 failures
```