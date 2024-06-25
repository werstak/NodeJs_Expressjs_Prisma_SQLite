
describe('ForgotPasswordComponent', () => {
  beforeEach(() => {
    cy.visit('/auth/forgot-password'); // Adjust the route as necessary
  });

  it('should display the forgot password form', () => {
    cy.get('mat-card-title').contains('Forgot Password');
    cy.get('form').should('be.visible');
  });

  it('should have an initially disabled submit button', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should enable the submit button when the email is valid', () => {
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should display required validation error for email field', () => {
    cy.get('input[name="email"]').focus().blur();
    cy.get('mat-error').contains('Email required').should('be.visible');
  });

  it('should display invalid email validation error', () => {
    cy.get('input[name="email"]').type('invalid-email').blur();
    cy.get('mat-error').contains('Invalid email').should('be.visible');
  });

  it('should submit the form and show success notification', () => {
    // Intercept the API call
    cy.intercept('POST', '/api/auth/verify-email', {
      statusCode: 200,
      body: { message: 'Success' },
    }).as('verifyEmail');

    // Fill in the form and submit
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();

    // Wait for the API call to complete
    // cy.wait('@verifyEmail').its('request.body').should('deep.equal', {
    //   email: 'test@example.com',
    // });

    // Check for the success notification
    cy.get('snack-bar-container').contains('Success').should('be.visible');
  });

  it('should show error message on failed email verification', () => {
    // Intercept the API call and simulate an error
    cy.intercept('POST', '/api/auth/verify-email', {
      statusCode: 400,
      body: { message: 'Error' },
    }).as('verifyEmailError');

    // Fill in the form and submit
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();

    // Wait for the API call to complete
    cy.wait('@verifyEmailError');

    // Check that the spinner is no longer visible and an error message is shown
    cy.get('.recovery-spinner').should('not.exist');
    cy.get('snack-bar-container').contains('Error').should('be.visible');
  });

  it('should navigate back to login page on clicking Back button', () => {
    cy.get('a').contains('Back').click();
    cy.url().should('include', '/auth/login'); // Adjust the route as necessary
  });
});
