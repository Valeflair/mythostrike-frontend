function generateRandomString() {
  const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  let randomString = '';
  let length = Cypress._.random(1, 99);

  while (length--) {
    const randomIndex = Cypress._.random(0, possibleCharacters.length - 1);
    randomString += possibleCharacters.charAt(randomIndex);
  }

  return randomString;
}

describe('Login click', () => {
  it('Login click', () => {
    cy.visit('http://localhost:5173/')

    cy.contains('Login').click()
  })
})

describe('Login successful', () => {
  it('Login successful and Logout', () => {
    cy.visit('http://localhost:5173/')

    cy.get('[id=username]').type('wow')
    cy.get('[id=password]').type('wow')
    cy.contains('Login').should('be.visible')
    cy.contains('Login').click()
    cy.url().should('include', '/home')
    cy.contains('wow')
    cy.get('.logoutImg').click().then(() => {
      cy.url().should('eq', 'http://localhost:5173/')
    })
  })
})

describe('Login failed', () => {
  it('Login failed', () => {
    cy.visit('http://localhost:5173/')

    cy.get('[id=username]').type('wow1')
    cy.get('[id=password]').type('wow1')
    cy.contains('Login').should('be.visible')
    cy.contains('Login').click()
    cy.get('.v-alert')
  })
})


describe('Register click', () => {
  it('Register click', () => {
    cy.visit('http://localhost:5173/')

    cy.contains('Login').click()
  })
})

describe('Register successful', () => {
  it('Register successful', () => {
    cy.visit('http://localhost:5173/')
    let randomName = generateRandomString();
    let randomPass = generateRandomString();
    cy.get('[id=username]').type(randomName)
    cy.get('[id=password]').type(randomPass)
    cy.contains('Register').should('be.visible')
    cy.contains('Register').click()
    cy.url().should('include', '/home')
    cy.contains(randomName)
  })
})

describe('Register failed', () => {
  it('Register failed cause space input', () => {
    cy.visit('http://localhost:5173/')
    cy.get('[id=username]').type(' ')
    cy.get('[id=password]').type(' ')
    cy.contains('Register').should('be.visible')
    cy.contains('Register').click()
    cy.get('.v-alert')
  })
})

describe('Register and Login', () => {
  it('Register,logout and Login successful', () => {
    cy.visit('http://localhost:5173/')
    let randomName = generateRandomString()
    let randomPass = generateRandomString()
    cy.get('[id=username]').type(randomName)
    cy.get('[id=password]').type(randomPass)
    cy.contains('Register').should('be.visible')
    cy.contains('Register').click()
    cy.url().should('include', '/home')
    cy.contains(randomName)
    cy.get('.logoutImg').click()
    cy.get('[id=username]').type(randomName)
    cy.get('[id=password]').type(randomPass)
    cy.contains('Login').click()
  })

  it('Register and Login failed cause wrong username', () => {
    cy.visit('http://localhost:5173/')
    let username = generateRandomString()
    let password = generateRandomString()
    let newUser = generateRandomString()
    cy.get('[id=username]').type(username)
    cy.get('[id=password]').type(password)
    cy.contains('Register').should('be.visible')
    cy.contains('Register').click()
    cy.url().should('include', '/home')
    cy.contains(username)
    cy.get('.logoutImg').click()
    cy.get('[id=username]').type(newUser)
    cy.get('[id=password]').type(password)
    cy.contains('Login').click()
    cy.get('.v-alert')
  })

  it('Register and Login failed cause wrong password', () => {
    cy.visit('http://localhost:5173/')
    let username = generateRandomString()
    let password = generateRandomString()
    let newPassword = generateRandomString()
    cy.get('[id=username]').type(username)
    cy.get('[id=password]').type(password)
    cy.contains('Register').should('be.visible')
    cy.contains('Register').click()
    cy.url().should('include', '/home')
    cy.contains(username)
    cy.get('.logoutImg').click()
    cy.get('[id=username]').type(username)
    cy.get('[id=password]').type(newPassword)
    cy.contains('Login').click()
    cy.get('.v-alert')
  })
})

