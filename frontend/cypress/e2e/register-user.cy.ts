import { CypressEnum } from '../enums/cypress.enum';

describe('RegisterComponent', () => {
  const registerEmail = CypressEnum.RegisterEmail;
  const password = CypressEnum.Password;
  const firstName = CypressEnum.firstName;
  const lastName = CypressEnum.lastName;
  const country = CypressEnum.country;
  const birthDate = CypressEnum.birthDate;

  beforeEach(() => {
    cy.visit('/auth/registration'); // Adjust the route if necessary
  });

  it('should display the registration form', () => {
    cy.get('mat-card-title').contains('Register Account');
  });


  it('should display validation errors for required fields', () => {
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('mat-error').contains('Email required');

    cy.get('input[formControlName="firstName"]').focus().blur();
    cy.get('mat-error').contains('First Name required');

    cy.get('input[formControlName="lastName"]').focus().blur();
    cy.get('mat-error').contains('Last Name required');

    cy.get('input[formControlName="location"]').focus().blur();
    cy.get('mat-error').contains('Country required');

    cy.get('input[formControlName="password"]').focus().blur();
    cy.get('mat-error').contains('Password required');

    cy.get('input[formControlName="confirmPassword"]').focus().blur();
    cy.get('mat-error').contains('Confirm Password required');

    cy.get('input[formControlName="birthAt"]').focus().blur();
    cy.get('mat-error').contains('Birth date required');
  });

  it('should display validation error for mismatched passwords', () => {
    cy.get('input[formControlName="password"]').type(password);
    cy.get('input[formControlName="confirmPassword"]').type('wrongPassword');
    cy.get('form').submit();

    cy.get('mat-error').contains('Passwords must match');
  });

  it('should display validation error for future birth date', () => {
    cy.get('input[formControlName="birthAt"]').type('3000-01-01');
    cy.get('form').submit();

    cy.get('mat-error').contains('Birth date cannot be in the future');
  });



  it('should fill out and submit the registration form successfully', () => {
    cy.get('input[formControlName="email"]').type(registerEmail);
    cy.get('input[formControlName="firstName"]').type(firstName);
    cy.get('input[formControlName="lastName"]').type(lastName);
    cy.get('input[formControlName="location"]').type(country);
    cy.get('mat-option').contains(country).click(); // Select the country from the autocomplete
    cy.get('input[formControlName="password"]').type(password);
    cy.get('input[formControlName="confirmPassword"]').type(password);
    cy.get('input[formControlName="birthAt"]').type(birthDate);

    // Submit the form
    cy.get('form').submit();

    // Ensure the form submission was successful
    cy.intercept('POST', '/api/auth/register', (req) => {
      req.reply({
        statusCode: 200,
        body: { message: 'Registration successful!' },
      });
    }).as('registerUser');

    // Wait for the request and assert the success message
    // cy.wait('@registerUser').its('response.statusCode').should('eq', 200);
    // cy.get('.notification').contains('Registration successful!');
    cy.get('mat-snack-bar-container').should('be.visible');
    cy.url().should('include', '/auth/login'); // Adjust the URL check if necessary
  });

});
