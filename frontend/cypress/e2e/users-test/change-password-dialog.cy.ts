import { CypressEnum } from '../../enums/cypress.enum';

describe('ChangePasswordDialog', () => {
  const newPassword = CypressEnum.NewPassword;

  beforeEach(() => {
    cy.login();
    cy.wait('@login');
    cy.visit('/users');

    cy.url().should('eq', Cypress.config().baseUrl + '/users');

    cy.get('[data-test="editUser-button"]').first().click();
    cy.get('mat-dialog-container').should('be.visible');
  });


  it('should open the change password dialog and display the form', () => {
    cy.get('[data-test="link-change-password"]').click();
    cy.get('[data-test="changePasswordForm"]').should('be.visible');
  });


  it('should close the dialog when the cancel button is clicked', () => {
    cy.get('[data-test="link-change-password"]').click();
    cy.get('[data-test="changePasswordForm"]').should('be.visible');
    cy.get('[data-test="changePasswordForm"] a').contains('Cancel').click();
    cy.get('[data-test="changePasswordForm"]').should('not.exist');
  });


  it('should display validation errors for required fields', () => {
    cy.get('[data-test="link-change-password"]').click();
    cy.get('[data-test="changePasswordForm"]').should('be.visible');

    // Trigger validation errors
    cy.get('[data-test="changePasswordForm"] input[formControlName="newPassword"]').focus().blur();
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').focus().blur();

    // Check for validation error messages
    cy.get('[data-test="changePasswordForm"] mat-error').contains('New Password required').should('be.visible');
    cy.get('[data-test="changePasswordForm"] mat-error').contains('Confirm Password required').should('be.visible');
  });


  it('should display error when passwords do not match', () => {
    cy.get('[data-test="link-change-password"]').click();
    cy.get('[data-test="changePasswordForm"]').should('be.visible');

    // Fill out the form with mismatched passwords
    cy.get('[data-test="changePasswordForm"] input[formControlName="newPassword"]').type(newPassword);
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').focus().type('newPassword');

    // Trigger validation
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').blur();

    // Check for mismatch error message
    cy.get('[data-test="changePasswordForm"] mat-error').contains('Confirm passwords must match').should('be.visible');
  });


  it('should display error when password is less than 6 characters', () => {
    cy.get('[data-test="link-change-password"]').click();
    cy.get('[data-test="changePasswordForm"]').should('be.visible');

    // Fill out the form with short passwords
    cy.get('[data-test="changePasswordForm"] input[formControlName="newPassword"]').focus().type('123');
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').focus().type('123');

    // Trigger validation
    cy.get('[data-test="changePasswordForm"] input[formControlName="newPassword"]').focus().blur();
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').focus().blur();

    // Check for minlength error messages
    cy.get('[data-test="changePasswordForm"] mat-error').contains('New Password must be at least 6 characters').should('be.visible');
    cy.get('[data-test="changePasswordForm"] mat-error').contains('Confirm Password must be at least 6 characters').should('be.visible');
  });


  it('should fill out the change password form and submit it', () => {
    cy.get('[data-test="link-change-password"]').click();
    cy.get('[data-test="changePasswordForm"]').should('be.visible');

    // Fill out the form
    cy.get('[data-test="changePasswordForm"] input[formControlName="newPassword"]').focus().type(newPassword);
    cy.get('[data-test="changePasswordForm"] input[formControlName="confirmPassword"]').focus().type(newPassword);

    // Submit the form
    cy.get('[data-test="changePasswordForm"] button[type="submit"]').click();

    // Verify the form submission
    cy.get('[data-test="changePasswordForm"]').should('not.exist');
    cy.get('mat-snack-bar-container').should('be.visible');
    cy.get('[data-test="userForm"]').should('be.visible');
  });
});
