// describe('HomeComponent', () => {
//   beforeEach(() => {
//     cy.loginAndSaveToken();
//     cy.visit('/');
//   });
//
//   it('should display post and user statistics components', () => {
//     cy.intercept('GET', '**/dashboard', (req) => {
//       const token = window.localStorage.getItem('accessToken');
//       if (token) {
//         req.headers['Authorization'] = `Bearer ${token}`;
//       }
//       req.continue(); // This ensures that the request continues after modifying headers
//     }).as('fetchStatistics');
//
//     cy.wait('@fetchStatistics');
//
//     cy.get('app-post-statistics').should('be.visible');
//     cy.get('app-user-statistics').should('be.visible');
//   });
// });
//



import { CypressEnum } from '../../enums/cypress.enum';

describe('HomeComponent', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;
  let accessToken: string;

  beforeEach(() => {
    loginAndVisitHome();
  });

  // Helper functions
  const loginAndVisitHome = () => {
    cy.visit('/auth/login');

    cy.intercept('POST', Cypress.env('api_server') + '/auth/login', (req) => {
      req.on('response', (res) => {
        accessToken = res.body.accessToken;
      });
    }).as('login');

    cy.get('input[formControlName="email"]').type(loginEmail);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.visit('/');
    cy.url().should('include', '/');
  };


  it('should display post and user statistics components', () => {
    cy.intercept('GET', '**/dashboard', (req) => {
      req.headers['Authorization'] = `Bearer ${accessToken}`;
    }).as('fetchStatistics');

    cy.visit('/');
    cy.wait('@fetchStatistics');

    cy.get('app-post-statistics').should('be.visible');
    cy.get('app-user-statistics').should('be.visible');
  });
});




// describe('HomeComponent', () => {
//   beforeEach(() => {
//     cy.login();
//     cy.visit('/');
//     cy.url().should('include', '/');
//   });
//
//   it('should display post and user statistics components', () => {
//     cy.intercept('GET', '**/dashboard', { delay: 500 }).as('fetchStatistics');
//     cy.visit('/');
//
//     cy.wait('@fetchStatistics');
//     cy.get('app-post-statistics').should('be.visible');
//     cy.get('app-user-statistics').should('be.visible');
//   });
// });
