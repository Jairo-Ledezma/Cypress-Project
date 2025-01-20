// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('loginWithApi',()=>{

    const userCredentials = {
        user: {
          email: Cypress.env("userName"),
          password: Cypress.env("password"),
        },
      };

    cy.request(
        'POST',
        Cypress.env("apiUrl")+'/api/users/login',
        userCredentials
      )
        .its('body').then(body=>{
            const token = body.user.token

            cy.visit('/', {onBeforeLoad(win){
                win.localStorage.setItem('jwtToken' , token)
            }})
        })


    
})

Cypress.Commands.add('normalLogin' , ()=>{
    cy.visit('/login')
    cy.get('[placeholder="Email"]').type(Cypress.env("userName"))
    cy.get('[placeholder="Password"]').type(Cypress.env("password"))
    cy.get('form').submit()
})

Cypress.Commands.add('goBackHome', ()=>{
    cy.contains('Home').click()
})

Cypress.Commands.add('deleteArticle' , (articleName)=>{
    cy.contains(articleName).click()
    cy.get('.article-actions').contains('Delete Article').click()
    
})