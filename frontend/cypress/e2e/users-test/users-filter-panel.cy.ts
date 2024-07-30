import { CypressEnum } from '../../enums/cypress.enum';

describe('UsersFilterPanel', () => {
  const superAdmin = CypressEnum.SuperAdmin;
  const projectAdmin = CypressEnum.ProjectAdmin;
  const manager = CypressEnum.Manager;
  const client = CypressEnum.Client;
  const testExampleEmail = CypressEnum.TestExampleEmail;

  beforeEach(() => {
    cy.login();
    cy.visit('/users');
    cy.url().should('eq', Cypress.config().baseUrl + '/users');
    cy.get('app-users-filter-panel').should('be.visible');
  });

  it('should display the user filter form', () => {
    verifyUserFilterFormIsDisplayed();
  });

  it('should allow selecting and deselecting all roles', () => {
    openRolesDropdown();
    selectAllRoles();
    verifyAllRolesSelected();
    deselectAllRoles();
    verifyAllRolesDeselected();
  });

  it('should update the filter when a role is selected', () => {
    openRolesDropdown();
    selectAndVerifyRole(superAdmin);
    selectAndVerifyRole(projectAdmin);
    selectAndVerifyRole(manager);
    selectAndVerifyRole(client);
  });

  it('should clear individual filters when the clear button is clicked', () => {
    fillFilterFields('Mila', 'Kunis', 'john.doe@example.com');
    clearIndividualFilter('firstName');
    clearIndividualFilter('lastName');
    clearIndividualFilter('email');
  });

  it('should clear all filters when the clear all button is clicked', () => {
    selectRole(superAdmin);
    fillFilterFields('Mila', 'Kunis', testExampleEmail);
    clearAllFilters();
    verifyAllFiltersCleared();
  });

  it('should update the usersService filters when the form is changed', () => {
    fillFilterFields('Mila', 'Kunis', 'andypetrov114@gmail.com');
    verifyEmailFilter('andypetrov114@gmail.com');
    clearAllFilters();
  });

  // Helper functions
  const verifyUserFilterFormIsDisplayed = () => {
    cy.get('app-users-filter-panel form').should('be.visible');
  };

  const openRolesDropdown = () => {
    cy.get('mat-select[formControlName="roles"]').click();
  };

  const selectAllRoles = () => {
    cy.get('mat-option').contains('Select All').click();
  };

  const verifyAllRolesSelected = () => {
    cy.get('mat-option')
      .not('[data-test="filters-option-toggle"]')
      .each(option => {
        cy.wrap(option).should('have.attr', 'aria-selected', 'true');
      });
  };

  const deselectAllRoles = () => {
    cy.get('mat-option').contains('Deselect All').click();
  };

  const verifyAllRolesDeselected = () => {
    cy.get('mat-option')
      .not('[data-test="filters-option-toggle"]')
      .each(option => {
        cy.wrap(option).should('have.attr', 'aria-selected', 'false');
      });
  };

  const selectAndVerifyRole = (role) => {
    cy.get('mat-option').contains(role).click();
    cy.get('mat-select[formControlName="roles"]').should('contain.text', role);
    cy.wait(300);
    cy.get('[data-test="role-name"]')
      .each(roleName => {
        cy.wrap(roleName).should('contain.text', role);
      });
    selectAllRoles();
    deselectAllRoles();
  };

  const fillFilterFields = (firstName, lastName, email) => {
    cy.get('input[formControlName="firstName"]').type(firstName);
    cy.get('input[formControlName="lastName"]').type(lastName);
    cy.get('input[formControlName="email"]').type(email);
  };

  const clearIndividualFilter = (filterName) => {
    cy.get(`[data-test="${filterName}-clear-button"]`).click();
    cy.get(`input[formControlName="${filterName}"]`).should('have.value', '');
  };

  const selectRole = (role) => {
    openRolesDropdown();
    cy.get('mat-option').contains(role).click();
    cy.get('body').click(0, 0); // Close the dropdown
    cy.get('mat-select[formControlName="roles"]').should('contain.text', role);
  };

  const clearAllFilters = () => {
    cy.get('[data-test="clearAllFields-button"]').click();
  };

  const verifyAllFiltersCleared = () => {
    cy.get('input[formControlName="firstName"]').should('have.value', '');
    cy.get('input[formControlName="lastName"]').should('have.value', '');
    cy.get('input[formControlName="email"]').should('have.value', '');
    cy.get('mat-select[formControlName="roles"]').should('not.contain.text', 'Super Admin');
  };

  const verifyEmailFilter = (email) => {
    cy.wait(300);
    cy.get('[data-test="td-user-email"]')
      .each(userEmail => {
        cy.wrap(userEmail).should('contain.text', email);
      });
  };
});
