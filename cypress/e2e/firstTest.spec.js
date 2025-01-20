const {
  onCreateArticlePage,
} = require('../support/pageObjects/createArticlePage');

describe('test with backend', () => {
  beforeEach('login to application', () => {
    cy.intercept({ method: 'GET', path: 'tags' }, { fixture: 'tags.json' }); //router matcher

    cy.loginWithApi();
  });

  it('verify correct request and response (API)', () => {
    cy.intercept(
      'POST',
      Cypress.env("apiUrl") +'/api/articles/'
    ).as('postArticles'); // this intercepts the api
    //parameters are request type and url then save it using as to use it later
    onCreateArticlePage.createArticle(
      'test name ',
      'test description',
      'test articke',
      'noTags'
    );

    cy.wait('@postArticles').then((xhr) => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(201);
      expect(xhr.request.body.article.body).to.equal('test articke');
      expect(xhr.response.body.article.description).to.equal(
        'test description'
      );
    });

    cy.deleteArticle('test name');
  });

  it('verify popular tags are displayed', () => {
    cy.log('we logged in');
    cy.get('.tag-list')
      .should('contain', 'cypress')
      .and('contain', 'automation')
      .and('contain', 'testing');
  });

  it('verify global feed likes count', () => {
    cy.intercept('GET', Cypress.env("apiUrl")+'/api/articles*', {
      fixture: 'articles.json',
    });
    onCreateArticlePage.validateLikeQuantity('1');

    cy.fixture('articles').then((file) => {
      const articleLink = file.articles[0].slug;
      file.articles[0].favoritesCount = 2;
      cy.intercept(
        'POST',
        Cypress.env("apiUrl")+'/api/articles/' +
          articleLink +
          '/favorite'
      );
    });
    onCreateArticlePage.likeArticle();
    onCreateArticlePage.validateLikeQuantity('2');
  });

  it('intercepting and modifying the request and response', () => {
    cy.intercept('POST', '**/articles', (req) => {
      req.body.article.description = 'this is a description 2';
    }).as('postArticles2'); // modifying the api request

    cy.contains('New Article').click();
    cy.get('[formcontrolname="title"]').type('this is a title');
    cy.get('[formcontrolname="description"]').type('this is a description');
    cy.get('[formcontrolname="body"]').type('this is a body of the article');
    cy.contains('Publish Article').click();

    cy.wait('@postArticles2').then((xhr) => {
      console.log(xhr);
      expect(xhr.response.statusCode).to.equal(201);
      expect(xhr.request.body.article.body).to.equal(
        'this is a body of the article'
      );
      expect(xhr.response.body.article.description).to.equal(
        'this is a description 2'
      );
    });

    cy.deleteArticle('this is a title');
  });

  it('delete a new article in global feed', () => {
    const userCredentials = {
      user: {
        email: Cypress.env("userName"),
        password: Cypress.env("password"),
      },
    };

    const bodyRequest = {
      article: {
        title: 'this was sent trough an API',
        description: 'this was sent trough an API',
        body: 'this was sent via API',
        tagList: [],
      },
    };

    cy.request(
      'POST',
      Cypress.env("apiUrl")+'/api/users/login',
      userCredentials
    )
      .its('body')
      .then((body) => {
        const token = body.user.token;

        cy.request({
          url: Cypress.env("apiUrl")+'/api/articles/',
          headers: { Authorization: 'Token ' + token },
          method: 'POST',
          body: bodyRequest,
        }).then((response) => {
          expect(response.status).to.equal(201);
        });

        cy.deleteArticle('this was sent trough an API');

        cy.request({
          url: Cypress.env("apiUrl")+'/api/articles?limit=10&offset=0',
          headers: { Authorization: 'Token' + token },
          method: 'GET',
        })
          .its('body')
          .then((body) => {
            console.log(body);
            expect(body.articles[0].title).not.to.equal('this was sent trough an API')
          });
      });
  });
});
