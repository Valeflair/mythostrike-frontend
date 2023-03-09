
describe('Lobby overview', () => {

    it('LobbyOverview Button click and refresh', () => {
        cy.visit('http://localhost:5173/')
        cy.get('[id=username]').type('wow')
        cy.get('[id=password]').type('wow')
        cy.contains('Login').click()
        cy.wait(500)
        cy.get('.lobbyImg').click()
        cy.wait(500)
        cy.url().should('include', '/lobbyOverview')
        cy.wait(300)
        cy.contains('Create Lobby').click()
        cy.wait(1000)
        cy.get('.slotStyle').get('.SeatCommandContainer').get('[id=seats]').get('.emptySeat').as('unmarked').then($elements => {
            let numElements = $elements.length;
            let randomIndex = Math.floor(Math.random() * numElements);
            let randomElement = $elements.eq(randomIndex);
            cy.wrap(randomElement).as('marked')
            
        })
        cy.get('@marked').click()
        cy.reload()
        cy.wait(300)
        cy.url().should('include', '/home')
    })
})

