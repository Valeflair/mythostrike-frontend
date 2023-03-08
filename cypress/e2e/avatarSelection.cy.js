describe('avatar selection', () => {
    let imgSrc
    let imgSrc2
    it('selection successful, check if the avatar be saved', () => {
        cy.visit('http://localhost:5173/')

        cy.get('[id=username]').type('wow')
        cy.get('[id=password]').type('wow')
        cy.contains('Login').should('be.visible')
        cy.contains('Login').click()
        cy.url().should('include', '/home')
        cy.contains('wow')
        cy.get('.v-card').get('.avatarImg').click()

        cy.get('.overlay').get('.selectArea').get('[class="image"]').then($elements => {
            let numElements = $elements.length;
            let randomIndex = Math.floor(Math.random() * numElements);
            let randomElement = $elements.eq(randomIndex);
            randomElement.click()
        })
        cy.wait(2000)

        cy.get('.v-card').get('.avatarImg').invoke('attr', 'src')
            .then((src) => {
                imgSrc = src
            })
            .then(() => {
                console.log(imgSrc)
            })
            cy.wait(1000)
        cy.get('.logoutImg').click()
        cy.wait(2000)
        cy.get('[id=username]').type('wow')
        cy.get('[id=password]').type('wow')
        cy.contains('Login').click()
        cy.wait(1000)
        cy.get('.v-card').get('.avatarImg').invoke('attr', 'src').then((src) => {
            imgSrc2 = src
        })
            .then(() => {
                console.log(imgSrc2)
            }).then(() => {
                expect(imgSrc2).to.equal(imgSrc)
              })
    })
})

