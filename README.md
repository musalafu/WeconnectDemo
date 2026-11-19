# SauceDemo Playwright tests

This project uses Playwright to check the main shopping journeys on
[SauceDemo](https://www.saucedemo.com). The tests follow customer-friendly
scenarios and appear in readable steps in the HTML report.

Coverage includes:

- Signing in successfully and handling sign-in errors
- Reviewing the product catalogue
- Adding and removing a product from the cart
- Checking out and confirming an order
- Sorting products by name and price

The demo account is stored in `test-data/credentials.json`.

## Setup

```powershell
npm install
npx playwright install chromium
```

## Run

```powershell
npm test
npm run test:headed
npm run test:report
```

## GitHub Actions

The Playwright suite runs automatically every day at 8:00 AM UTC+02
(06:00 UTC), with four workers. GitHub Actions uses UTC for scheduled runs, so
the schedule may need to be adjusted if your local timezone changes for
daylight saving time. To run it on demand, use **Actions → Playwright tests →
Run workflow**.
