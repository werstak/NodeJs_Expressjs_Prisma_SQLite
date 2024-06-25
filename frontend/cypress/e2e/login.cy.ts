import { CypressEnum } from '../enums/cypress.enum';

describe('LoginComponent', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;

  beforeEach(() => {
    cy.visit('/auth/login'); // Adjust the URL as needed
  });

  it('should display the login form', () => {
    cy.get('mat-card-title').contains('Login Account');
    cy.get('input[formControlName="email"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should display validation errors', () => {
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('mat-error').contains('Email required');

    cy.get('input[formControlName="password"]').focus().blur();
    cy.get('mat-error').contains('Password required');
  });

  it('should enable the login button when the form is valid', () => {
    cy.get('input[formControlName="email"]').type(loginEmail).should('have.value', loginEmail);
    cy.get('input[formControlName="password"]').type(password).should('have.value', password);
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should show an error message on failed login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    });

    cy.get('input[formControlName="email"]').type('test@example.com');
    cy.get('input[formControlName="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Check for error message
    cy.get('mat-snack-bar-container').should('be.visible');
  });

  it('should log in the user and navigate to the home page on successful login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
    });

    cy.get('input[formControlName="email"]').type(loginEmail);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Check URL change
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // Optionally check for some element on the home page
    cy.get('app-post-statistics').should('be.visible');
  });
});
