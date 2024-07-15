describe('PostsComponent', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/posts');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts');
  });

  it('should display the posts page', () => {
    cy.get('app-posts').should('be.visible');
    cy.get('app-posts-filter-panel').should('be.visible');
    cy.get('[data-test="posts-grid"]').should('be.visible');
  });

  it('should display the paginator', () => {
    cy.get('mat-paginator').should('be.visible');
  });

  it('should display the correct number of posts in the grid', () => {
    cy.get('[data-test="posts-grid"] app-preview-post').should('have.length', 5); // assuming pageSize is 5
  });

  it('should navigate to the next page when paginator is used', () => {
    cy.get('.mat-mdc-paginator-navigation-next').click();
    cy.get('[data-test="posts-grid"] app-preview-post').should('have.length', 5); // check the number of posts on the next page
  });

  it('should navigate to the next page when paginator is used', () => {
    cy.get('.mat-mdc-paginator-navigation-next').click();
    cy.get('.mat-mdc-paginator-navigation-first').click();
    cy.get('[data-test="posts-grid"] app-preview-post').should('have.length', 5); // check the number of posts on the next page
       cy.get('.mat-mdc-paginator-navigation-last').click();
    cy.get('[data-test="posts-grid"] app-preview-post').should('have.length', 5); // check the number of posts on the next page
  });
});





// import { CypressEnum } from '../../enums/cypress.enum';
//
// describe('PostsComponent', () => {
//   const loginEmail = CypressEnum.LoginEmail;
//   const password = CypressEnum.Password;
//   let accessToken: string;
//
//   beforeEach(() => {
//     cy.visit('/auth/login');
//
//     cy.intercept('POST', Cypress.env('api_server') + '/auth/login', (req) => {
//       req.on('response', (res) => {
//         accessToken = res.body.accessToken;
//       });
//     }).as('login');
//
//     cy.get('input[formControlName="email"]').type(loginEmail);
//     cy.get('input[formControlName="password"]').type(password);
//     cy.get('button[type="submit"]').click();
//
//     cy.wait('@login').its('response.statusCode').should('eq', 200);
//
//     // Check URL change to ensure navigation to the home page
//     cy.url().should('eq', Cypress.config().baseUrl + '/');
//   });
//
//
//   it('should display the posts page', () => {
//
//     cy.visit('/posts');
//
//     // cy.intercept('GET', Cypress.env('api_server') + '/categories', (req) => {
//     //   req.headers['Authorization'] = `Bearer ${accessToken}`;
//     // }).as('categories');
//     //
//     // cy.intercept('GET', Cypress.env('api_server') + '/list_all_users', (req) => {
//     //   req.headers['Authorization'] = `Bearer ${accessToken}`;
//     // }).as('getListAllUsers');
//     //
//     // cy.intercept('GET', Cypress.env('api_server') + '/posts', (req) => {
//     //   req.headers['Authorization'] = `Bearer ${accessToken}`;
//     // }).as('getPosts');
//
//     cy.url().should('eq', Cypress.config().baseUrl + '/posts');
//
//     cy.get('app-posts-filter-panel').should('be.visible');
//     cy.get('app-preview-post').should('be.visible');
//
//   });
//
//   it('should display the posts-grid', () => {
//     cy.visit('/posts');
//     cy.get('[data-test="posts-grid"]').should('be.visible');
//   });
//
//   it('should display the paginator', () => {
//     cy.visit('/posts');
//     cy.get('mat-paginator').should('be.visible');
//   });
//
// });
