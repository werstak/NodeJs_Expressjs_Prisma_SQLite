describe('LoginComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/auth/login'); // Adjust the URL as needed
  });

  it('should display the login form', () => {
    cy.get('mat-card-title').contains('Login Account');
    cy.get('input[formControlName="email"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('button[type="submit"]').contains('Login').should('be.disabled');
  });

  it('should display validation errors', () => {
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('mat-error').contains('Email required');

    cy.get('input[formControlName="password"]').focus().blur();
    cy.get('mat-error').contains('Password required');
  });

  it('should enable the login button when the form is valid', () => {
    cy.get('input[formControlName="email"]').type('andypetrov114@gmail.com');
    cy.get('input[formControlName="password"]').type('test123456');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should log in the user and navigate to the home page on successful login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
    }).as('loginRequest');

    cy.get('input[formControlName="email"]').type('andypetrov114@gmail.com');
    cy.get('input[formControlName="password"]').type('test123456');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should show an error message on failed login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginRequest');

    cy.get('input[formControlName="email"]').type('andypetrov114@gmail.com');
    cy.get('input[formControlName="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);
    cy.get('mat-snack-bar-container').contains('Invalid credentials');
  });
});
