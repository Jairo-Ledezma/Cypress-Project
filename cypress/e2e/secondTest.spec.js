describe('Test log out' , ()=>{
    beforeEach('Login to the app' , () => {
        cy.normalLogin()
    });

    it('Verify User can log out succesfully' /*,{retries:2}*/, ()=>{ //here is another way to set retries directly in the test 
        cy.contains('Settings').click()
        cy.contains(' Or click here to logout. ').click()
        cy.get('.navbar-nav').should('contain' , 'Sign up')
    })
})