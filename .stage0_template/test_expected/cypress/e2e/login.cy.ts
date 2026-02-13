describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login page', () => {
    cy.get('[data-automation-id="login-submit-button"]').should('be.visible')
  })

  it('should login successfully', () => {
    cy.get('[data-automation-id="login-submit-button"]').click()
    cy.url().should('not.include', '/login')
    cy.url().should('include', '/controls')
  })

  it('should redirect to login when accessing protected routes', () => {
    cy.clearLocalStorage()
    cy.visit('/controls')
    cy.url().should('include', '/login')
  })
})
