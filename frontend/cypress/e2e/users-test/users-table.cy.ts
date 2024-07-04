describe('UsersTableComponent', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/users');
  });

  it('should display a page with a table of users', () => {
    cy.get('app-users-filter-panel').should('be.visible');
  });

  it('should display the users-table', () => {
    cy.get('app-users-table').should('be.visible');
  });

  it('should display the paginator', () => {
    cy.get('mat-paginator').should('be.visible');
  });

  // Additional tests

  it('should display the ID column', () => {
    cy.get('th.mat-header-cell').contains('ID').should('be.visible');
  });

  it('should display the Role column', () => {
    cy.get('th.mat-header-cell').contains('Role').should('be.visible');
  });

  it('should display the Email column', () => {
    cy.get('th.mat-header-cell').contains('Email').should('be.visible');
  });

  it('should display the First Name column', () => {
    cy.get('th.mat-header-cell').contains('First Name').should('be.visible');
  });

  it('should display the Last Name column', () => {
    cy.get('th.mat-header-cell').contains('Last Name').should('be.visible');
  });

  it('should display the Created At column', () => {
    cy.get('th.mat-header-cell').contains('Created At').should('be.visible');
  });

  it('should display the Posts column', () => {
    cy.get('th.mat-header-cell').contains('Posts').should('be.visible');
  });

  it('should display the Status column', () => {
    cy.get('th.mat-header-cell').contains('Status').should('be.visible');
  });

  it('should display the Country column', () => {
    cy.get('th.mat-header-cell').contains('Country').should('be.visible');
  });

  it('should display the Age column', () => {
    cy.get('th.mat-header-cell').contains('Age').should('be.visible');
  });

  it('should display the Actions column', () => {
    cy.get('th.mat-header-cell').contains('Actions').should('be.visible');
  });

  it('should allow sorting by ID', () => {
    cy.get('th.mat-header-cell').contains('ID').click();
    cy.get('th.mat-header-cell').contains('ID').should('have.class', 'mat-sort-header-sorted');
  });

  it('should open add user dialog on clicking add button', () => {
    cy.get('button[data-test="addUser-button"]').click();
    cy.get('mat-dialog-container').should('be.visible');
  });

  it('should open edit user dialog on clicking edit button', () => {
    cy.get('button[data-test="editUser-button"]').first().click();
    cy.get('mat-dialog-container').should('be.visible');
  });

  it('should open delete confirmation dialog on clicking delete button', () => {
    cy.get('button[aria-label="Delete"]').first().click();
    cy.get('mat-dialog-container').should('be.visible');
  });

  it('should display user avatars', () => {
    cy.get('td.mat-cell').find('img').should('be.visible');
  });

  it('should display correct number of rows based on page size', () => {
    cy.get('mat-paginator').find('mat-select').click();
    cy.get('mat-option').contains('5').click();
    cy.get('tr.mat-row').should('have.length', 5);
  });
});




// describe('UsersTableComponent', () => {
//
//   beforeEach(() => {
//     cy.login();
//     cy.visit('/users');
//   });
//
//
//   it('should display a page with a table of users', () => {
//     cy.get('app-users-filter-panel').should('be.visible');
//   });
//
//   it('should display the users-table', () => {
//     cy.get('app-users-table').should('be.visible');
//   });
//
//   it('should display the paginator', () => {
//     cy.get('mat-paginator').should('be.visible');
//   });
// });




// import { CypressEnum } from '../../enums/cypress.enum';
//
// describe('UsersTableComponent', () => {
//   const loginEmail = CypressEnum.LoginEmail;
//   const password = CypressEnum.Password;
//   let accessToken: string;
//
//   beforeEach(() => {
//     cy.visit('/auth/login');
//
//     cy.intercept('POST', Cypress.env('api_server') + '/auth/login', (req) => {
//       req.on('response', (res) => {
//         accessToken = res.body.accessToken;
//       });
//     }).as('login');
//
//     cy.get('input[formControlName="email"]').type(loginEmail);
//     cy.get('input[formControlName="password"]').type(password);
//     cy.get('button[type="submit"]').click();
//
//     cy.wait('@login').its('response.statusCode').should('eq', 200);
//
//     // Check URL change to ensure navigation to the home page
//     cy.url().should('eq', Cypress.config().baseUrl + '/');
//   });
//
//
//   it('should display a page with a table of users', () => {
//
//     cy.visit('/users');
//
//     // cy.intercept('GET', Cypress.env('api_server') + '/users', (req) => {
//     //   req.headers['Authorization'] = `Bearer ${accessToken}`;
//     // }).as('getUserDelayed');
//
//
//     cy.url().should('eq', Cypress.config().baseUrl + '/users');
//
//     cy.get('app-users-filter-panel').should('be.visible');
//   });
//
//   it('should display the users-table', () => {
//     cy.visit('/users');
//     cy.get('app-users-table').should('be.visible');
//   });
//
//
//   it('should display the paginator', () => {
//     cy.visit('/users');
//     cy.get('mat-paginator').should('be.visible');
//   });
//
// });
