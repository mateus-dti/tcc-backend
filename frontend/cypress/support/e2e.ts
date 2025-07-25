// ***********************************************************
// This example support/e2e.ts file is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configure Cypress to handle React applications
Cypress.on('uncaught:exception', (err) => {
  // Return false to prevent the error from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})
