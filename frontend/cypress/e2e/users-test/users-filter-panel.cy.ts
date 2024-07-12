import { CypressEnum } from '../../enums/cypress.enum';

describe('UsersFilterPanel', () => {
  const superAdmin = CypressEnum.SuperAdmin;
  const projectAdmin = CypressEnum.ProjectAdmin;
  const manager = CypressEnum.Manager;
  const client = CypressEnum.Client;
  const testExampleEmail = CypressEnum.TestExampleEmail;

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

    // Select the superAdmin role
    cy.get('mat-option').contains(superAdmin).click();
    // Verify the table value is updated
    cy.get('mat-select[formControlName="roles"]').should('contain.text', superAdmin);
    cy.wait(300);
    cy.get('[data-test="role-name"]')
      .each(role => {
        cy.wrap(role).should('contain.text', superAdmin);
      });
    // Deselect all roles
    cy.get('mat-option').contains('Select All').click();
    cy.get('mat-option').contains('Deselect All').click();


    // Select the projectAdmin role
    cy.get('mat-option').contains(projectAdmin).click();
    // Verify the table value is updated
    cy.get('mat-select[formControlName="roles"]').should('contain.text', projectAdmin);
    cy.wait(300);
    cy.get('[data-test="role-name"]')
      .each(role => {
        cy.wrap(role).should('contain.text', projectAdmin);
      });
    // Deselect all roles
    cy.get('mat-option').contains('Select All').click();
    cy.get('mat-option').contains('Deselect All').click();


    // Select the manager role
    cy.get('mat-option').contains(manager).click();
    // Verify the table value is updated
    cy.get('mat-select[formControlName="roles"]').should('contain.text', manager);
    cy.wait(300);
    cy.get('[data-test="role-name"]')
      .each(role => {
        cy.wrap(role).should('contain.text', manager);
      });
    // Deselect all roles
    cy.get('mat-option').contains('Select All').click();
    cy.get('mat-option').contains('Deselect All').click();


    // Select the client role
    cy.get('mat-option').contains(client).click();
    // Verify the table value is updated
    cy.get('mat-select[formControlName="roles"]').should('contain.text', client);
    cy.wait(300);
    cy.get('[data-test="role-name"]')
      .each(role => {
        cy.wrap(role).should('contain.text', client);
      });
  });


  it('should clear individual filters when the clear button is clicked', () => {
    // Fill out the form
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('john.doe@example.com');

    // Clear the first name filter
    cy.get('[data-test="firstName-clear-button"]').click();
    cy.get('input[formControlName="firstName"]').should('have.value', '');

    // Clear the last name filter
    cy.get('[data-test="lastName-clear-button"]').click();
    cy.get('input[formControlName="lastName"]').should('have.value', '');

    // Clear the email filter
    cy.get('[data-test="email-clear-button"]').click();
    cy.get('input[formControlName="email"]').should('have.value', '');
  });


  it('should clear all filters when the clear all button is clicked', () => {
    // Select a role
    cy.get('mat-select[formControlName="roles"]').click();
    // Select the superAdmin role
    cy.get('mat-option').contains(superAdmin).click();
    // Verify the table value is updated
    cy.get('mat-select[formControlName="roles"]').should('contain.text', superAdmin);

    // Ensure mat-option is collapsing
    cy.get('body').click(0, 0);

    // Verify the roles dropdown collapses and the selected role is shown
    cy.get('mat-select[formControlName="roles"]').should('contain.text', superAdmin);

    // Fill out the form
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type(testExampleEmail);

    // Clear all fields
    cy.get('[data-test="clearAllFields-button"]').click();

    // Verify all fields are cleared
    cy.get('input[formControlName="firstName"]').should('have.value', '');
    cy.get('input[formControlName="lastName"]').should('have.value', '');
    cy.get('input[formControlName="email"]').should('have.value', '');
    cy.get('mat-select[formControlName="roles"]').should('not.contain.text', 'Super Admin');
  });


  it('should update the usersService filters when the form is changed', () => {
    // Fill out the form
    cy.get('input[formControlName="firstName"]').type('Mila');
    cy.get('input[formControlName="lastName"]').type('Kunis');
    cy.get('input[formControlName="email"]').type('andypetrov114@gmail.com');

      cy.wait(300);
      cy.get('[data-test="td-user-email"]')
        .each(userEmail => {
          cy.wrap(userEmail).should('contain.text', 'andypetrov114@gmail.com');
        });
  });
});




// import { CypressEnum } from '../../enums/cypress.enum';
//
// describe('UsersFilterPanel', () => {
//   const superAdmin = CypressEnum.SuperAdmin;
//   const projectAdmin = CypressEnum.ProjectAdmin;
//   const manager = CypressEnum.Manager;
//   const client = CypressEnum.Client;
//   const testExampleEmail = CypressEnum.TestExampleEmail;
//
//   beforeEach(() => {
//     cy.login();
//     cy.wait('@login');
//     cy.visit('/users');
//
//     cy.url().should('eq', Cypress.config().baseUrl + '/users');
//
//     // Wait for roles to be loaded
//     // cy.intercept('GET', '/api/roles').as('getRoles');
//     // cy.wait('@getRoles');
//
//     // Open filter panel if it's not already open
//     cy.get('app-users-filter-panel').should('be.visible');
//   });
//
//
//   // it('should display the user filter form', () => {
//   //   cy.get('app-users-filter-panel form').should('be.visible');
//   // });
//   //
//   //
//   // it('should allow selecting and deselecting all roles', () => {
//   //   // Open the roles dropdown
//   //   cy.get('mat-select[formControlName="roles"]').click();
//   //
//   //   // Select all roles
//   //   cy.get('mat-option').contains('Select All').click();
//   //
//   //   // Verify all roles are selected
//   //   cy.get('mat-option')
//   //     .not('[data-test="filters-option-toggle"]')
//   //     .each(option => {
//   //       cy.wrap(option).should('have.attr', 'aria-selected', 'true');
//   //     });
//   //
//   //   // Deselect all roles
//   //   cy.get('mat-option').contains('Deselect All').click();
//   //
//   //   // Verify all roles are deselected
//   //   cy.get('mat-option')
//   //     .not('[data-test="filters-option-toggle"]')
//   //     .each(option => {
//   //       cy.wrap(option).should('have.attr', 'aria-selected', 'false');
//   //     });
//   // });
//   //
//   //
//   // it('should update the filter when a role is selected', () => {
//   //
//   //   // Open the roles dropdown
//   //   cy.get('mat-select[formControlName="roles"]').click();
//   //
//   //   // Select the superAdmin role
//   //   cy.get('mat-option').contains(superAdmin).click();
//   //   // Verify the table value is updated
//   //   cy.get('mat-select[formControlName="roles"]').should('contain.text', superAdmin);
//   //   cy.wait(300);
//   //   cy.get('[data-test="role-name"]')
//   //     .each(role => {
//   //       cy.wrap(role).should('contain.text', superAdmin);
//   //     });
//   //   // Deselect all roles
//   //   cy.get('mat-option').contains('Select All').click();
//   //   cy.get('mat-option').contains('Deselect All').click();
//   //
//   //
//   //   // Select the projectAdmin role
//   //   cy.get('mat-option').contains(projectAdmin).click();
//   //   // Verify the table value is updated
//   //   cy.get('mat-select[formControlName="roles"]').should('contain.text', projectAdmin);
//   //   cy.wait(300);
//   //   cy.get('[data-test="role-name"]')
//   //     .each(role => {
//   //       cy.wrap(role).should('contain.text', projectAdmin);
//   //     });
//   //   // Deselect all roles
//   //   cy.get('mat-option').contains('Select All').click();
//   //   cy.get('mat-option').contains('Deselect All').click();
//   //
//   //
//   //   // Select the manager role
//   //   cy.get('mat-option').contains(manager).click();
//   //   // Verify the table value is updated
//   //   cy.get('mat-select[formControlName="roles"]').should('contain.text', manager);
//   //   cy.wait(300);
//   //   cy.get('[data-test="role-name"]')
//   //     .each(role => {
//   //       cy.wrap(role).should('contain.text', manager);
//   //     });
//   //   // Deselect all roles
//   //   cy.get('mat-option').contains('Select All').click();
//   //   cy.get('mat-option').contains('Deselect All').click();
//   //
//   //
//   //   // Select the client role
//   //   cy.get('mat-option').contains(client).click();
//   //   // Verify the table value is updated
//   //   cy.get('mat-select[formControlName="roles"]').should('contain.text', client);
//   //   cy.wait(300);
//   //   cy.get('[data-test="role-name"]')
//   //     .each(role => {
//   //       cy.wrap(role).should('contain.text', client);
//   //     });
//   // });
//   //
//   //
//   // it('should clear individual filters when the clear button is clicked', () => {
//   //   // Fill out the form
//   //   cy.get('input[formControlName="firstName"]').type('John');
//   //   cy.get('input[formControlName="lastName"]').type('Doe');
//   //   cy.get('input[formControlName="email"]').type('john.doe@example.com');
//   //
//   //   // Clear the first name filter
//   //   cy.get('[data-test="firstName-clear-button"]').click();
//   //   cy.get('input[formControlName="firstName"]').should('have.value', '');
//   //
//   //   // Clear the last name filter
//   //   cy.get('[data-test="lastName-clear-button"]').click();
//   //   cy.get('input[formControlName="lastName"]').should('have.value', '');
//   //
//   //   // Clear the email filter
//   //   cy.get('[data-test="email-clear-button"]').click();
//   //   cy.get('input[formControlName="email"]').should('have.value', '');
//   //
//   //   // Fill out the form
//   //   cy.get('input[formControlName="firstName"]').type('John');
//   //   cy.get('input[formControlName="lastName"]').type('Doe');
//   //   cy.get('input[formControlName="email"]').type(testExampleEmail);
//   //
//   //   // Clear the All Fields filter
//   //   cy.get('[data-test="clearAllFields-button"]').click();
//   //
//   //   cy.get('input[formControlName="firstName"]').should('have.value', '');
//   //   cy.get('input[formControlName="lastName"]').should('have.value', '');
//   //   cy.get('input[formControlName="email"]').should('have.value', '');
//   // });
//
//
//   it('should clear all filters when the clear all button is clicked', () => {
//
//     // Select a role
//     cy.get('mat-select[formControlName="roles"]').click();
//     // Select the superAdmin role
//     cy.get('mat-option').contains(superAdmin).click();
//     // Verify the table value is updated
//     cy.get('mat-select[formControlName="roles"]').should('contain.text', superAdmin);
//
//     // Ensure mat-option is collapsing
//     cy.get('body').click(0, 0);
//
//     // Fill out the form
//     cy.get('input[formControlName="firstName"]').type('John');
//     cy.get('input[formControlName="lastName"]').type('Doe');
//     cy.get('input[formControlName="email"]').type(testExampleEmail);
//
//     // Clear all fields
//     cy.get('[data-test="clearAllFields-button"]').click();
//
//     // Verify all fields are cleared
//     cy.get('input[formControlName="firstName"]').should('have.value', '');
//     cy.get('input[formControlName="lastName"]').should('have.value', '');
//     cy.get('input[formControlName="email"]').should('have.value', '');
//     cy.get('mat-select[formControlName="roles"]').should('not.contain.text', 'Super Admin');
//   });
//
//
//   // it('should update the usersService filters when the form is changed', () => {
//   //   // Fill out the form
//   //   cy.get('input[formControlName="firstName"]').type('John');
//   //   cy.get('input[formControlName="lastName"]').type('Doe');
//   //   cy.get('input[formControlName="email"]').type('john.doe@example.com');
//   //
//   //   // Select a role
//   //   cy.get('mat-select[formControlName="roles"]').click();
//   //   cy.get('mat-option').not('.filters__option_toggle').first().click();
//   //
//   //   // Verify the usersService filter is updated
//   //   cy.window().its('usersService').its('usersFilters$').its('value').should('deep.equal', {
//   //     firstName: 'John',
//   //     lastName: 'Doe',
//   //     email: 'john.doe@example.com',
//   //     roles: [1] // Replace 1 with the actual role ID
//   //   });
//   // });
// });
