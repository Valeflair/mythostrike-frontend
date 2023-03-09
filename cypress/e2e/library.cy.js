
describe('Library open', () => {
  it('Library click', () => {
    cy.visit('http://localhost:5173/')
    cy.get('[id=username]').type('wow')
    cy.get('[id=password]').type('wow')
    cy.contains('Login').click()
    cy.get('.libraryImg').click()
    cy.wait(500)
    cy.url().should('include', '/library')

  })
})

describe('Library visit', () => {
  let imgSrc
  let imgSrc2
  it('in Library the big picture should be the one player choosed', () => {
    cy.visit('http://localhost:5173/')
    cy.get('[id=username]').type('wow')
    cy.get('[id=password]').type('wow')
    cy.contains('Login').click()
    cy.get('.libraryImg').click()
    cy.url().should('include', '/library')
    cy.get('.cardButton').then($elements => {

      let numElements = $elements.length;
      let randomIndex = Math.floor(Math.random() * numElements);
      let randomElement = $elements.eq(randomIndex);

      cy.wrap(randomElement).invoke('css', 'background-image')
        .then(backgroundImage => {
          imgSrc = backgroundImage.replace(/(url\(|\)|")/g, '')

        })
        .then(() => {
          console.log(imgSrc)
        })
      randomElement.click()
    })

    cy.wait(500)
    cy.get('.big-picture').get('img').invoke('attr', 'src')
      .then((src) => {
        imgSrc2 = src

      })
      .then(() => {
        console.log(imgSrc2)
      }).then(() => {
        cy.wrap(imgSrc).should('include', imgSrc2)
      })

      cy.get('.back').click()
      cy.wait(300)
      cy.url().should('include', '/home')
  })
})



