export class CreateArticlePage{

    createArticle(articleName ,articleDescription , article , tags){
        cy.contains('New Article').click()
        cy.get('[placeholder="Article Title"]').click()
        cy.get('[placeholder="Article Title"]').type(articleName)
        cy.get('[formcontrolname="description"]').click()
        cy.get('[formcontrolname="description"]').type(articleDescription)
        cy.get('[formcontrolname="body"]').click()
        cy.get('[formcontrolname="body"]').type(article)
        cy.get('[placeholder="Enter tags"]').click()
        cy.get('[placeholder="Enter tags"]').type(tags)
        cy.contains(' Publish Article ').click()
        
    }

    likeArticle(){
        cy.get('.ion-heart').click()
        cy.wait(300)
    }

    validateLikeQuantity(number){
        cy.get('app-article-list button').then(heartList =>{
            expect(heartList[0]).to.contain(number)
        })
    }

    
}

export const onCreateArticlePage = new CreateArticlePage()