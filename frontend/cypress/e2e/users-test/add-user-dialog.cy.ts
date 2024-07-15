import { CypressEnum } from '../../enums/cypress.enum';

describe('AddUserDialog', () => {
  const newUserEmail = CypressEnum.NewUserEmail;
  const password = CypressEnum.Password;
  const newUserFirstName = CypressEnum.NewUserFirstName;
  const newUserLastName = CypressEnum.NewUserLastName;
  const country = CypressEnum.Country;
  const birthDate = CypressEnum.BirthDate;

  beforeEach(() => {
    cy.login();
    cy.visit('/users');

    cy.url().should('eq', Cypress.config().baseUrl + '/users');

    cy.get('[data-test="addUser-button"]').click();
    cy.get('mat-dialog-container').should('be.visible');
    cy.get('[data-test="userForm"]').should('be.visible');
  });


  it('should display validation errors for required fields', () => {
    // Validate email field
    cy.get('[data-test="userForm"] input[formControlName="email"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Email required');
    cy.get('[data-test="userForm"] input[formControlName="email"]').type('invalid-email').blur();
    cy.get('[data-test="userForm"] mat-error').contains('Invalid email').should('be.visible');

    // Validate first name field
    cy.get('[data-test="userForm"] input[formControlName="firstName"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('First Name required');

    // Validate last name field
    cy.get('[data-test="userForm"] input[formControlName="lastName"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Last Name required');

    // Validate location field
    cy.get('[data-test="userForm"] input[formControlName="location"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Country required');
    cy.get('[data-test="userForm"] input[formControlName="location"]').type('invalid-location');
    cy.get('[data-test="userForm"] mat-error').contains('Country not found').should('be.visible');

    // Validate RoleEnum Select
    cy.get('[data-test="userForm"] mat-select[formControlName="role"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('RoleEnum required');

    // Validate password field
    cy.get('[data-test="userForm"] input[formControlName="password"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Password required');

    // Validate confirm password field
    cy.get('[data-test="userForm"] input[formControlName="confirmPassword"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Confirm Password required');

    // Validate birth date field
    cy.get('[data-test="userForm"] input[formControlName="birthAt"]').focus().blur();
    cy.get('[data-test="userForm"] mat-error').contains('Birth date required');

    // Validate Status Checkbox
    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"]').scrollIntoView().should('be.visible').click();
    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"] .mdc-label').contains('Status - Deactivated');
    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"]').should('not.have.class', 'mat-mdc-checkbox-checked');

    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"]').scrollIntoView().should('be.visible').click();
    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"] .mdc-label').contains('Status - Active');
    cy.get('[data-test="userForm"] mat-checkbox[formControlName="status"]').should('have.class', 'mat-mdc-checkbox-checked');
  });


  it('should open the add user dialog, fill out the form, and submit it', () => {
    cy.get('[data-test="userForm"] input[formControlName="email"]').type(newUserEmail);
    cy.get('[data-test="userForm"] input[formControlName="firstName"]').type(newUserFirstName);
    cy.get('[data-test="userForm"] input[formControlName="lastName"]').type(newUserLastName);

    cy.get('[data-test="userForm"] mat-select[formControlName="role"]').click();
    cy.get('mat-option').contains('Client').click();

    cy.get('[data-test="userForm"] input[formControlName="location"]').type(country);
    cy.get('mat-option').contains(country).click();

    cy.get('[data-test="userForm"] input[formControlName="password"]').type(password);
    cy.get('[data-test="userForm"] input[formControlName="confirmPassword"]').type(password);

    /** This option allows you to directly enter the date into the field */
    // cy.get('input[formControlName="birthAt"]').type(birthDate);

    /** This option involves selecting a date in the datepicker */
    cy.get('[data-test="userForm"] mat-datepicker-toggle button').click();
    cy.get('mat-calendar').should('be.visible');
    cy.get('mat-calendar').contains('1').click();

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify the user was added (mock or real response verification)
    cy.get('mat-dialog-container').should('not.exist');
    cy.get('mat-snack-bar-container').should('be.visible');
    cy.get('app-users-table').should('be.visible');
    cy.get('.mat-mdc-paginator-navigation-last').click();
    cy.get('table').should('contain', newUserEmail);
  });


  it('should close the dialog when the cancel button is clicked', () => {
    cy.visit('/users');
    cy.get('[data-test="addUser-button"]').click();
    cy.get('mat-dialog-container').should('be.visible');
    cy.get('[data-test="userForm"]').should('be.visible');

    cy.get('[data-test="cancel-button"]').click();
    cy.get('mat-dialog-container').should('not.exist');
  });
});





// import { CypressEnum } from '../../enums/cypress.enum';
//
// describe('AddUserDialog', () => {
//   const loginEmail = CypressEnum.LoginEmail;
//   const password = CypressEnum.Password;
//   let accessToken: string;
//
//   before(() => {
//     // Visit the login page
//     cy.visit('/auth/login');
//
//     // Intercept the login API call
//     cy.intercept('POST', Cypress.env('api_server') + '/auth/login', (req) => {
//       req.reply((res) => {
//         accessToken = res.body.accessToken;
//         res.send();
//       });
//     }).as('login');
//
//     // Perform the login
//     cy.get('input[formControlName="email"]').type(loginEmail);
//     cy.get('input[formControlName="password"]').type(password);
//     cy.get('button[type="submit"]').click();
//
//     // Wait for the login request to complete
//     cy.wait('@login');
//
//     // Check URL change to ensure navigation to the home page
//     cy.url().should('eq', Cypress.config().baseUrl + '/');
//   });
//
//   beforeEach(() => {
//     // Set the token in local storage
//     cy.window().then((window) => {
//       window.localStorage.setItem('accessToken', accessToken);
//     });
//
//     // Visit the home page before each test
//     cy.visit('/');
//
//     // Intercept the statistics API call and include the token in headers
//     cy.intercept('GET', Cypress.env('api_server') + '/dashboard', (req) => {
//       req.headers['Authorization'] = `Bearer ${accessToken}`;
//       req.continue((res) => {
//         res.send();
//       });
//     }).as('getStatistics');
//   });
//
//
//   it('should display a page with a table of users', () => {
//
//     cy.visit('/users');
//
//     cy.intercept('GET', Cypress.env('api_server') + '/users', (req) => {
//       req.headers['Authorization'] = `Bearer ${accessToken}`;
//       req.on('response', (res) => {
//         res.setDelay(2000);
//         res.send();
//       });
//     }).as('getUserDelayed');
//
//     // cy.wait('@getUserDelayed');
//
//     cy.url().should('eq', Cypress.config().baseUrl + '/users');
//
//     cy.get('[data-test="addUser-button"]').click()
//
//     cy.get('mat-dialog-container').should('be.visible');
//     cy.get('[data-test="userForm"]').should('be.visible');
//     // cy.get('[data-test="cancel-button"]').click();
//   });
//
// });
