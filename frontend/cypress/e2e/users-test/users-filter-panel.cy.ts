import { CypressEnum } from '../../enums/cypress.enum';

describe('UsersFilterPanel', () => {
  const superAdmin = CypressEnum.SuperAdmin;
  const projectAdmin = CypressEnum.ProjectAdmin;
  const manager = CypressEnum.Manager;
  const client = CypressEnum.Client;
  const testExampleEmail = CypressEnum.TestExampleEmail;

  beforeEach(() => {
    cy.login();

    // Verify successful login by checking the URL or a specific element
    cy.visit('/users');
    cy.url().should('eq', Cypress.config().baseUrl + '/users');
    cy.get('app-users-filter-panel').should('be.visible');
  });

// TODO after the implementation of the "Cypress.Commands" functionality is completed, this section of user verification needs to be completed
  // it('should verify the receipt of users from the API', () => {
  //   // Intercept the users API call
  //   cy.intercept('GET', '/users*').as('getUsers');
  //
  //   // Reload the page to trigger the API call
  //   cy.reload();
  //
  //   // Wait for the API response
  //   cy.wait('@getUsers').then((interception) => {
  //     // Verify the response status
  //     expect(interception.response.statusCode).to.eq(200);
  //
  //     // Verify the response body structure
  //     const responseBody = interception.response.body;
  //     expect(responseBody).to.have.property('totalCount');
  //     expect(responseBody).to.have.property('users');
  //     expect(responseBody.users).to.be.an('array');
  //
  //     // Verify the structure of individual user objects
  //     responseBody.users.forEach(user => {
  //       expect(user).to.have.all.keys(
  //         'id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'role',
  //         'avatar', 'status', 'birthAt', 'location', '_count', 'postsCount'
  //       );
  //       expect(user._count).to.have.property('posts');
  //     });
  //   });
  // });



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
