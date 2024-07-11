describe('UsersFilterPanel', () => {
  beforeEach(() => {
    cy.login();
    cy.wait('@login');
    cy.visit('/users');

    cy.url().should('eq', Cypress.config().baseUrl + '/users');

    // Wait for roles to be loaded
    // cy.intercept('GET', '/api/roles').as('getRoles');
    // cy.wait('@getRoles');

    // Open filter panel if it's not already open
    cy.get('app-users-filter-panel').should('be.visible');
  });

  it('should display the user filter form', () => {
    cy.get('app-users-filter-panel form').should('be.visible');
  });


  it('should allow selecting and deselecting all roles', () => {
    // Open the roles dropdown
    cy.get('mat-select[formControlName="roles"]').click();

    // Select all roles
    cy.get('mat-option').contains('Select All').click();

    // Verify all roles are selected
    cy.get('mat-option')
      .not('[data-test="filters-option-toggle"]')
      .each(option => {
        cy.wrap(option).should('have.attr', 'aria-selected', 'true');
      });

    // Deselect all roles
    cy.get('mat-option').contains('Deselect All').click();

    // Verify all roles are deselected
    cy.get('mat-option')
      .not('[data-test="filters-option-toggle"]')
      .each(option => {
        cy.wrap(option).should('have.attr', 'aria-selected', 'false');
      });
  });


  it('should update the filter when a role is selected', () => {
    // Open the roles dropdown
    cy.get('mat-select[formControlName="roles"]').click();

    // Select the first role
    cy.get('mat-option').not('[data-test="filters-option-toggle"]').first().click();

    // Verify the form value is updated
    cy.get('mat-select[formControlName="roles"]').should('contain.text', 'Super Admin'); // Replace 'roleName' with the actual role name
  });

});
