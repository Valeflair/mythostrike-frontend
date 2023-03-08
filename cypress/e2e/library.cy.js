
describe('Library open', () => {
  it('Library click', () => {
    cy.visit('http://localhost:5173/')
    cy.get('[id=username]').type('wow')
    cy.get('[id=password]').type('wow')
    cy.contains('Login').click()
    cy.get('.libraryImg').click()
    cy.url().should('include', '/library')

  })
})

describe('Library visit', () => {
  it('Library has cards', () => {
    cy.visit('http://localhost:5173/')
    cy.get('[id=username]').type('wow')
    cy.get('[id=password]').type('wow')
    cy.contains('Login').click()
    cy.get('.libraryImg').click()
    cy.url().should('include', '/library')
    cy.get('.cardButton')
  })
})



