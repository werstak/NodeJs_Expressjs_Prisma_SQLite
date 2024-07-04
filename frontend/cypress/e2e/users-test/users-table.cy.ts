// import { CypressEnum } from '../../enums/cypress.enum';
//
// describe('UsersTableComponent', () => {
//
//   beforeEach(() => {
//     // Token should already be set in local storage by the global beforeEach
//     cy.setTokenInLocalStorage(Cypress.env('accessToken'));
//   });
//
//   it('should display a page with a table of users', () => {
//     cy.visitWithToken('/users');
//     cy.url().should('eq', Cypress.config().baseUrl + '/users');
//     cy.get('app-users-filter-panel').should('be.visible');
//   });
//
//   it('should display the users-table', () => {
//     cy.visitWithToken('/users');
//     cy.get('app-users-table').should('be.visible');
//   });
//
//   it('should display the paginator', () => {
//     cy.visitWithToken('/users');
//     cy.get('mat-paginator').should('be.visible');
//   });
// });
//




// import { CypressEnum } from '../../enums/cypress.enum';
//
// describe('UsersTableComponent', () => {
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
//   it('should display a page with a table of users', () => {
//
//     cy.visit('/users');
//
//     // cy.intercept('GET', Cypress.env('api_server') + '/users', (req) => {
//     //   req.headers['Authorization'] = `Bearer ${accessToken}`;
//     // }).as('getUserDelayed');
//
//
//     cy.url().should('eq', Cypress.config().baseUrl + '/users');
//
//     cy.get('app-users-filter-panel').should('be.visible');
//   });
//
//   it('should display the users-table', () => {
//     cy.visit('/users');
//     cy.get('app-users-table').should('be.visible');
//   });
//
//
//   it('should display the paginator', () => {
//     cy.visit('/users');
//     cy.get('mat-paginator').should('be.visible');
//   });
//
// });







import { CypressEnum } from '../../enums/cypress.enum';

describe('UsersTableComponent', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;
  let accessToken: string;

  before(() => {
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

    // Check URL change to ensure navigation to the home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  // beforeEach(() => {
  //   cy.visit('/auth/login');
  //
  //   cy.intercept('POST', Cypress.env('api_server') + '/auth/login', (req) => {
  //     req.on('response', (res) => {
  //       accessToken = res.body.accessToken;
  //     });
  //   }).as('login');
  //
  //   cy.get('input[formControlName="email"]').type(loginEmail);
  //   cy.get('input[formControlName="password"]').type(password);
  //   cy.get('button[type="submit"]').click();
  //
  //   cy.wait('@login').its('response.statusCode').should('eq', 200);
  //
  //   // Check URL change to ensure navigation to the home page
  //   cy.url().should('eq', Cypress.config().baseUrl + '/');
  // });


  it('should display a page with a table of users', () => {
    cy.intercept('GET', Cypress.env('api_server') + '/users', (req) => {
      req.headers['Authorization'] = `Bearer ${accessToken}`;
    }).as('getUserDelayed1');

    cy.visit('/users');

    cy.url().should('eq', Cypress.config().baseUrl + '/users');

    cy.get('app-users-filter-panel').should('be.visible');
  });

  // it('should display the users-table', () => {
  //   cy.intercept('GET', Cypress.env('api_server') + '/users', (req) => {
  //     req.headers['Authorization'] = `Bearer ${accessToken}`;
  //   }).as('getUserDelayed2');
  //
  //   // cy.visit('/users');
  //   cy.get('app-users-table').should('be.visible');
  // });


  // it('should display the paginator', () => {
  //   cy.intercept('GET', Cypress.env('api_server') + '/users', (req) => {
  //     req.headers['Authorization'] = `Bearer ${accessToken}`;
  //   }).as('getUserDelayed3');
  //
  //   cy.visit('/users');
  //   cy.get('mat-paginator').should('be.visible');
  // });

});
