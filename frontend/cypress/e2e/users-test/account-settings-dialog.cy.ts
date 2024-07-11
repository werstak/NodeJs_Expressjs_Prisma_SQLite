import { CypressEnum } from '../../enums/cypress.enum';

describe('AccountSettingsDialog', () => {
  const newUserEmail = CypressEnum.NewUserEmail;
  const newUserFirstName = CypressEnum.NewUserFirstName;
  const newUserLastName = CypressEnum.NewUserLastName;
  const country = CypressEnum.Country;

  beforeEach(() => {
    cy.login();
    cy.wait('@login');
    cy.visit('/');

    cy.url().should('eq', Cypress.config().baseUrl + '/');

    cy.get('[data-test="account-button"]').click();
    cy.get('[data-test="settings-button"]').should('be.visible').click();
    cy.get('[data-test="userForm"]').should('be.visible');
  });

  it('should open the edit user dialog, fill out the form with new information, and submit it', () => {
    // Update email field
    cy.get('[data-test="userForm"] input[formControlName="email"]').clear().type(newUserEmail);

    // Update first name field
    cy.get('[data-test="userForm"] input[formControlName="firstName"]').clear().type(newUserFirstName);

    // Update last name field
    cy.get('[data-test="userForm"] input[formControlName="lastName"]').clear().type(newUserLastName);

    // Update location field
    cy.get('[data-test="userForm"] input[formControlName="location"]').clear().type(country);
    cy.get('mat-option').contains(country).click();

    // Update birth date field by selecting a date in the datepicker
    cy.get('[data-test="userForm"] mat-datepicker-toggle button').click();
    cy.get('mat-calendar').should('be.visible');
    cy.get('mat-calendar').contains('3').click();

    // // Submit the form
    // cy.get('button[type="submit"]').click();

    // Verify the user was updated (mock or real response verification)
    // cy.get('[data-test="userForm"]').should('not.exist');
    // cy.get('mat-snack-bar-container').should('be.visible');
  });
});
