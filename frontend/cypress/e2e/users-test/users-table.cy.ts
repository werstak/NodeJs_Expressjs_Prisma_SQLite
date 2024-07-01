import { CypressEnum } from '../../enums/cypress.enum';

describe('UsersTableComponent', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;
  let accessToken: string;

  before(() => {
    // Visit the login page
    cy.visit('/auth/login');

    // Intercept the login API call
    cy.intercept('POST', Cypress.env('api_server') + '/auth/login', (req) => {
      req.reply((res) => {
        accessToken = res.body.accessToken;
        res.send();
      });
    }).as('login');

    // Perform the login
    cy.get('input[formControlName="email"]').type(loginEmail);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for the login request to complete
    cy.wait('@login');

    // Check URL change to ensure navigation to the home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  beforeEach(() => {
    // Set the token in local storage
    cy.window().then((window) => {
      window.localStorage.setItem('accessToken', accessToken);
    });

    // Visit the home page before each test
    cy.visit('/');

    // Intercept the statistics API call and include the token in headers
    cy.intercept('GET', Cypress.env('api_server') + '/dashboard', (req) => {
      req.headers['Authorization'] = `Bearer ${accessToken}`;
      req.continue((res) => {
        res.send();
      });
    }).as('getStatistics');
  });


  it('should display a page with a table of users', () => {

    cy.visit('/users');

    cy.intercept('GET', Cypress.env('api_server') + '/users', (req) => {
      req.headers['Authorization'] = `Bearer ${accessToken}`;
      req.on('response', (res) => {
        res.setDelay(2000);
        res.send();
      });
    }).as('getUserDelayed');

    // cy.wait('@getUserDelayed');

    cy.url().should('eq', Cypress.config().baseUrl + '/users');



    cy.get('app-users-filter-panel').should('be.visible');
    cy.get('app-users-table').should('be.visible');
  });

});
