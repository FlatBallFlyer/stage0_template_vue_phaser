// Cypress E2E support file
// This is loaded before every test file

// Add custom commands
Cypress.Commands.add('login', (roles?: string[]) => {
  cy.visit('/login')
  if (roles && roles.length > 0) {
    cy.get('[data-automation-id="login-roles-input"]').find('input').clear()
    cy.get('[data-automation-id="login-roles-input"]').find('input').type(roles.join(','))
  }
  cy.get('[data-automation-id="login-submit-button"]').click()
  cy.url().should('not.include', '/login')
})

// Type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(roles?: string[]): Chainable<void>
    }
  }
}

export {}
