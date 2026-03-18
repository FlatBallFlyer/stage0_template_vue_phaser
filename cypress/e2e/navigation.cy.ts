describe('App navigation', () => {
  it('should redirect unauthenticated user to login', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
  })

  it('should redirect to /play when authenticated', () => {
    cy.login()
    cy.visit('/')
    cy.url().should('include', '/play')
  })

  it('should show game container on /play', () => {
    cy.login()
    cy.visit('/play')
    cy.get('[data-automation-id="game-container"]').should('exist')
  })

  it('should show admin link when user has admin role', () => {
    cy.login(['admin'])
    cy.visit('/play')
    cy.get('[data-automation-id="nav-admin-link"]').should('be.visible')
  })

  it('should show logout', () => {
    cy.login()
    cy.visit('/play')
    cy.get('[data-automation-id="nav-logout-link"]').should('be.visible')
  })
})
