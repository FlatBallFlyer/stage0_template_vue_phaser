// Cypress E2E support file
// This is loaded before every test file

// Add custom commands — auth is via localStorage / URL hash (not dev-login API)
Cypress.Commands.add('login', (roles?: string[]) => {
  const exp = new Date()
  exp.setFullYear(exp.getFullYear() + 1)
  const roleList = roles && roles.length > 0 ? roles : ['user']

  cy.visit('/login', {
    onBeforeLoad(win) {
      win.localStorage.setItem('access_token', 'cypress-test-token')
      win.localStorage.setItem('token_expires_at', exp.toISOString())
      win.localStorage.setItem('user_roles', JSON.stringify(roleList))
    },
  })
  cy.reload()
  cy.get('[data-automation-id="continue-to-app-button"]', { timeout: 10000 })
    .should('not.be.disabled')
    .click()
  cy.url({ timeout: 10000 }).should('not.include', '/login')
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
