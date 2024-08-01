// describe('UsersTableComponent', () => {
//   beforeEach(() => {
//     cy.login();
//     cy.visit('/users');
//   });
//
//   // it('should display a page with a table of users', () => {
//   //   cy.get('app-users-filter-panel').should('be.visible');
//   // });
//   //
//   // it('should display the users-table', () => {
//   //   cy.get('app-users-table').should('be.visible');
//   // });
//   //
//   // it('should display the paginator', () => {
//   //   cy.get('mat-paginator').should('be.visible');
//   // });
//   //
//   // /**
//   //  * Column Visibility Tests
//   //  */
//   //
//   // it('should display all columns in the table', () => {
//   //   cy.get('[data-test="id-column"]').should('be.visible');
//   //   cy.get('[data-test="avatar-column"]').should('be.visible');
//   //   cy.get('[data-test="role-column"]').should('be.visible');
//   //   cy.get('[data-test="email-column"]').should('be.visible');
//   //   cy.get('[data-test="firstName-column"]').should('be.visible');
//   //   cy.get('[data-test="lastName-column"]').should('be.visible');
//   //   cy.get('[data-test="createdAt-column"]').should('be.visible');
//   //   cy.get('[data-test="status-column"]').should('be.visible');
//   //   cy.get('[data-test="posts-column"]').should('be.visible');
//   //   cy.get('[data-test="location-column"]').should('be.visible');
//   //   cy.get('[data-test="birthAt-column"]').should('be.visible');
//   //   cy.get('[data-test="actions-column"]').scrollIntoView().should('be.visible');
//   // });
//
//
//   /**
//    * Testing Dialog Boxes
//    */
//   // it('should open add user dialog on clicking add button', () => {
//   //   cy.get('button[data-test="addUser-button"]').click();
//   //   cy.get('mat-dialog-container').should('be.visible');
//   // });
//   //
//   // it('should open edit user dialog on clicking edit button', () => {
//   //   cy.get('button[data-test="editUser-button"]').first().click();
//   //   cy.get('mat-dialog-container').should('be.visible');
//   // });
//   //
//   // it('should open delete confirmation dialog on clicking delete button', () => {
//   //   cy.get('button[data-test="deleteUser-button"]').first().click();
//   //   cy.get('mat-dialog-container').should('be.visible');
//   // });
//
//
//
//   /**
//    * Sorting Functionality Test for ID column
//    */
//   it('should allow sorting by ID', () => {
//     cy.get('[data-test="id-column"]').click();
//
//     // Wait for the sorting request to complete
//     // cy.intercept('GET', '/users?orderByColumn=id*').as('getSortedUsersByID');
//
//     // Ensure that the sorting request has been completed
//     // cy.wait('@getSortedUsersByID');
//     // Verify that the class has been applied
//     cy.get('[data-test="id-column"]').should('have.class', 'mat-sort-header-sorted');

//   });
//
//   /**
//    * Sorting Functionality Test for Role column
//    */
//   // it('should allow sorting by Role', () => {
//   //   cy.get('[data-test="role-column"]').click();
//   //
//   //   // Wait for the sorting request to complete
//   //   cy.intercept('GET', '/users?orderByColumn=role*').as('getSortedUsersByRole');
//   //
//   //   // Ensure that the sorting request has been completed
//   //   // cy.wait('@getSortedUsersByRole');
//   //
//   //   // Verify that the class has been applied
//   //   cy.get('[data-test="role-column"]').should('have.class', 'mat-sort-header-sorted');
//   // });
//
//   /**
//    * Sorting Functionality Test for Email column
//    */
//   // it('should allow sorting by Email', () => {
//   //   cy.get('[data-test="email-column"]').click();
//   //
//   //   // Wait for the sorting request to complete
//   //   cy.intercept('GET', '/users?orderByColumn=email*').as('getSortedUsersByEmail');
//   //
//   //   // Ensure that the sorting request has been completed
//   //   cy.wait('@getSortedUsersByEmail');
//   //
//   //   // Verify that the class has been applied
//   //   cy.get('[data-test="email-column"]').should('have.class', 'mat-sort-header-sorted');
//   // });
//
//
//   // it('should display correct number of rows based on page size', () => {
//   //   cy.get('mat-paginator').find('mat-select').click();
//   //   cy.get('mat-option').contains('15').click();
//   //   cy.get('tr[mat-row]').should('have.length', 15);
//   //   cy.get('mat-paginator').find('mat-select').click();
//   //   cy.get('mat-option').contains('25').click();
//   //   cy.get('tr[mat-row]').should('have.length', 25);
//   // });
//
//
//
//   // it('should navigate to the next page and display correct data', () => {
//   //   // Ensure the initial page load
//   //   // cy.intercept('GET', '/users?pageIndex=0&pageSize=5').as('getInitialUsers');
//   //   // cy.wait('@getInitialUsers').then((interception) => {
//   //   //   expect(interception.response.statusCode).to.equal(200);
//   //   // });
//   //
//   //   // Click on the next page button
//   //   cy.get('.mat-mdc-paginator-navigation-next').click();
//   //
//   //   // Wait for the pagination request to complete
//   //   // cy.intercept('GET', '/users?pageIndex=1&pageSize=5').as('getNextPageUsers');
//   //   // cy.wait('@getNextPageUsers').then((interception) => {
//   //   //   expect(interception.response.statusCode).to.equal(200);
//   //   // });
//   //
//   //   // Verify that the new data is loaded in the table
//   //   // cy.get('tr[mat-row]').should('have.length', 5); // Assuming page size is 5
//   //   cy.get('mat-mdc-paginator-range-label').should('have.text', '6')
//   //   console.log(111, cy.get('mat-mdc-paginator-range-label'))
//   // });
//   //
//
//
//   //
//   // it('should navigate to the previous page and display correct data', () => {
//   //   // Navigate to the next page first
//   //   cy.get('.mat-mdc-paginator-navigation-next').click();
//   //
//   //   // Wait for the next page request
//   //   // cy.intercept('GET', '/users?pageIndex=1&pageSize=5').as('getNextPageUsers');
//   //   // cy.wait('@getNextPageUsers').its('response.statusCode').should('eq', 200);
//   //   // cy.wait('@getNextPageUsers').then((interception) => {
//   //   //   expect(interception.response.statusCode).to.equal(200);
//   //   // });
//   //
//   //   // // Click on the previous page button
//   //   cy.get('.mat-mdc-paginator-navigation-previous').click();
//   //   //
//   //   // // Wait for the pagination request to complete
//   //   // cy.intercept('GET', '/users?pageIndex=0&pageSize=5').as('getPreviousPageUsers');
//   //   // cy.wait('@getPreviousPageUsers').then((interception) => {
//   //   //   expect(interception.response.statusCode).to.equal(200);
//   //   // });
//   //   //
//   //   // // Verify that the original data is loaded in the table
//   //   // cy.get('table mat-row').should('have.length', 5); // Assuming page size is 5
//   //   // cy.get('table mat-row').first().should('contain', 'expected first row value on first page');
//   // });
//   //
//
//
// });
//
//


//
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
//
//   /**
//    * Column Visibility Tests
//    */
//   it('should display all columns in the table', () => {
//     cy.get('[data-test="id-column"]').should('be.visible');
//     cy.get('[data-test="avatar-column"]').should('be.visible');
//     cy.get('[data-test="role-column"]').should('be.visible');
//     cy.get('[data-test="email-column"]').should('be.visible');
//     cy.get('[data-test="firstName-column"]').should('be.visible');
//     cy.get('[data-test="lastName-column"]').should('be.visible');
//     cy.get('[data-test="createdAt-column"]').should('be.visible');
//     cy.get('[data-test="status-column"]').should('be.visible');
//     cy.get('[data-test="posts-column"]').should('be.visible');
//     cy.get('[data-test="location-column"]').should('be.visible');
//     cy.get('[data-test="birthAt-column"]').should('be.visible');
//     cy.get('[data-test="actions-column"]').scrollIntoView().should('be.visible');
//   });
//
//   /**
//    * Testing Dialog Boxes
//    */
//   it('should open add user dialog on clicking add button', () => {
//     cy.get('button[data-test="addUser-button"]').click();
//     cy.get('mat-dialog-container').should('be.visible');
//   });
//
//   it('should open edit user dialog on clicking edit button', () => {
//     cy.get('button[data-test="editUser-button"]').first().click();
//     cy.get('mat-dialog-container').should('be.visible');
//   });
//
//   it('should open delete confirmation dialog on clicking delete button', () => {
//     cy.get('button[data-test="deleteUser-button"]').first().click();
//     cy.get('mat-dialog-container').should('be.visible');
//   });
//
//   /**
//    * Sorting Functionality Test for Email column
//    */
//   it('should allow sorting by Email', () => {
//     // Wait for the sorting request to complete
//     cy.intercept('GET', Cypress.env('api_server') + '/users?orderByColumn=id*', (req) => {
//       req.headers['Authorization'] = `Bearer ${accessToken}`;
//     }).as('getSortedUsersByID');
//
//     cy.get('[data-test="id-column"]').click();
//
//     // Ensure that the sorting request has been completed
//     cy.wait('@getSortedUsersByID');
//
//     // Verify that the class has been applied
//     cy.get('[data-test="id-column"]').children().should('have.class', 'mat-sort-header-sorted');
//   });
//
//   /**
//    * Sorting Functionality Test for Role column
//    */
//   it('should allow sorting by Role', () => {
//     // Wait for the sorting request to complete
//     cy.intercept('GET', Cypress.env('api_server') + '/users?orderByColumn=role*', (req) => {
//       req.headers['Authorization'] = `Bearer ${accessToken}`;
//     }).as('getSortedUsersByRole');
//
//     cy.get('[data-test="role-column"]').click();
//
//     // Ensure that the sorting request has been completed
//     cy.wait('@getSortedUsersByRole');
//
//     // Verify that the class has been applied
//     cy.get('[data-test="role-column"]').children().should('have.class', 'mat-sort-header-sorted');
//   });
//
//   /**
//    * Sorting Functionality Test for Email column
//    */
//   it('should allow sorting by Email', () => {
//     // Wait for the sorting request to complete
//     cy.intercept('GET', Cypress.env('api_server') + '/users?orderByColumn=email*', (req) => {
//       req.headers['Authorization'] = `Bearer ${accessToken}`;
//     }).as('getSortedUsersByEmail');
//
//     cy.get('[data-test="email-column"]').click();
//
//     // Ensure that the sorting request has been completed
//     cy.wait('@getSortedUsersByEmail');
//
//     // Verify that the class has been applied
//     cy.get('[data-test="email-column"]').children().should('have.class', 'mat-sort-header-sorted');
//   });
//
//   it('should display correct number of rows based on page size', () => {
//     cy.get('mat-paginator').find('mat-select').click();
//     cy.get('mat-option').contains('15').click();
//     cy.get('tr[mat-row]').should('have.length', 15);
//     cy.get('mat-paginator').find('mat-select').click();
//     cy.get('mat-option').contains('25').click();
//     cy.get('tr[mat-row]').should('have.length', 25);
//   });
//
//
// });


// import { CypressEnum } from '../../enums/cypress.enum';
//
// describe('UsersTableComponent', () => {
//   const loginEmail = CypressEnum.LoginEmail;
//   const password = CypressEnum.Password;
//   let accessToken: string;
//
//   beforeEach(() => {
//     loginAndVisitUsers();
//   });
//
//   it('should display a page with a table of users', () => {
//     verifyUsersPageIsDisplayed();
//   });
//
//   it('should display the users-table', () => {
//     cy.get('app-users-table').should('be.visible');
//   });
//
//   it('should display the paginator', () => {
//     cy.get('mat-paginator').should('be.visible');
//   });
//
//   it('should display all columns in the table', () => {
//     verifyAllColumnsVisible();
//   });
//
//   it('should open add user dialog on clicking add button', () => {
//     openDialog('addUser-button');
//   });
//
//   it('should open edit user dialog on clicking edit button', () => {
//     openDialog('editUser-button');
//   });
//
//   it('should open delete confirmation dialog on clicking delete button', () => {
//     openDialog('deleteUser-button');
//   });
//
//   it('should allow sorting by ID', () => {
//     verifyColumnSorting('id-column', 'id');
//   });
//
//   it('should allow sorting by Role', () => {
//     verifyColumnSorting('role-column', 'role');
//   });
//
//   it('should allow sorting by Email', () => {
//     verifyColumnSorting('email-column', 'email');
//   });
//
//   it('should display correct number of rows based on page size', () => {
//     verifyRowNumberBasedOnPageSize(15);
//     verifyRowNumberBasedOnPageSize(25);
//   });
//
//   // Helper functions
//   const loginAndVisitUsers = () => {
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
//     cy.url().should('eq', Cypress.config().baseUrl + '/');
//     cy.visit('/users');
//   };
//
//   const verifyUsersPageIsDisplayed = () => {
//     cy.get('app-users-filter-panel').should('be.visible');
//   };
//
//   const verifyAllColumnsVisible = () => {
//     const columns = [
//       'id-column',
//       'avatar-column',
//       'role-column',
//       'email-column',
//       'firstName-column',
//       'lastName-column',
//       'createdAt-column',
//       'status-column',
//       'posts-column',
//       'location-column',
//       'birthAt-column',
//       'actions-column'
//     ];
//
//     columns.forEach(column => {
//       cy.get(`[data-test="${column}"]`).scrollIntoView().should('be.visible');
//     });
//   };
//
//   const openDialog = (buttonDataTest: string) => {
//     cy.get(`button[data-test="${buttonDataTest}"]`).first().click();
//     cy.get('mat-dialog-container').should('be.visible');
//   };
//
//   const verifyColumnSorting = (columnDataTest, orderByColumn) => {
//     cy.intercept('GET', `${Cypress.env('api_server')}/users?orderByColumn=${orderByColumn}*`, (req) => {
//       req.headers['Authorization'] = `Bearer ${accessToken}`;
//     }).as(`getSortedUsersBy${orderByColumn.charAt(0).toUpperCase() + orderByColumn.slice(1)}`);
//
//     cy.get(`[data-test="${columnDataTest}"]`).click();
//     cy.wait(`@getSortedUsersBy${orderByColumn.charAt(0).toUpperCase() + orderByColumn.slice(1)}`);
//     cy.get(`[data-test="${columnDataTest}"]`).children().should('have.class', 'mat-sort-header-sorted');
//   };
//
//   const verifyRowNumberBasedOnPageSize = (pageSize) => {
//     cy.get('mat-paginator').find('mat-select').click();
//     cy.get('mat-option').contains(pageSize.toString()).click();
//     cy.get('tr[mat-row]').should('have.length', pageSize);
//   };
// });


import { CypressEnum } from '../../enums/cypress.enum';

describe('UsersTableComponent', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;
  let accessToken: string;

  beforeEach(() => {
    loginAndVisitUsers();
  });

  it('should display a page with a table of users', () => {
    verifyUsersPageIsDisplayed();
  });

  it('should display the users-table', () => {
    cy.get('app-users-table').should('be.visible');
  });

  it('should display the paginator', () => {
    cy.get('mat-paginator').should('be.visible');
  });

  it('should display all columns in the table', () => {
    verifyAllColumnsVisible();
  });

  it('should open add user dialog on clicking add button', () => {
    openDialog('addUser-button');
  });

  it('should open edit user dialog on clicking edit button', () => {
    openDialog('editUser-button');
  });

  it('should open delete confirmation dialog on clicking delete button', () => {
    openDialog('deleteUser-button');
  });

  it('should allow sorting by ID', () => {
    verifyColumnSorting('id-column', 'id');
  });

  it('should allow sorting by Role', () => {
    verifyColumnSorting('role-column', 'role');
  });

  it('should allow sorting by Email', () => {
    verifyColumnSorting('email-column', 'email');
  });

  it('should display correct number of rows based on page size', () => {
    verifyRowNumberBasedOnPageSize(15);
    verifyRowNumberBasedOnPageSize(25);
  });

  it('should navigate to the next and previous pages and display correct data', () => {
    verifyPageNavigation();
  });

  // Helper functions
  const loginAndVisitUsers = () => {
    cy.visit('/auth/login');

    cy.intercept('POST', Cypress.env('api_server') + '/auth/login', (req) => {
      req.on('response', (res) => {
        accessToken = res.body.accessToken;
      });
    }).as('login');

    cy.get('input[formControlName="email"]').type(loginEmail);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.visit('/users');
  };

  const verifyUsersPageIsDisplayed = () => {
    cy.get('app-users-filter-panel').should('be.visible');
  };

  const verifyAllColumnsVisible = () => {
    const columns = [
      'id-column',
      'avatar-column',
      'role-column',
      'email-column',
      'firstName-column',
      'lastName-column',
      'createdAt-column',
      'status-column',
      'posts-column',
      'location-column',
      'birthAt-column',
      'actions-column'
    ];

    columns.forEach(column => {
      cy.get(`[data-test="${column}"]`).scrollIntoView().should('be.visible');
    });
  };

  const openDialog = (buttonDataTest: string) => {
    cy.get(`button[data-test="${buttonDataTest}"]`).first().click();
    cy.get('mat-dialog-container').should('be.visible');
  };

  const verifyColumnSorting = (columnDataTest, orderByColumn) => {
    cy.intercept('GET', `${Cypress.env('api_server')}/users?orderByColumn=${orderByColumn}*`, (req) => {
      req.headers['Authorization'] = `Bearer ${accessToken}`;
    }).as(`getSortedUsersBy${orderByColumn.charAt(0).toUpperCase() + orderByColumn.slice(1)}`);

    cy.get(`[data-test="${columnDataTest}"]`).click();
    cy.wait(`@getSortedUsersBy${orderByColumn.charAt(0).toUpperCase() + orderByColumn.slice(1)}`);
    cy.get(`[data-test="${columnDataTest}"]`).children().should('have.class', 'mat-sort-header-sorted');
  };

  const verifyRowNumberBasedOnPageSize = (pageSize) => {
    cy.get('mat-paginator').find('mat-select').click();
    cy.get('mat-option').contains(pageSize.toString()).click();
    cy.get('tr[mat-row]').should('have.length', pageSize);
  };

  const verifyPageNavigation = () => {
    cy.get('.users-table__paginator button[aria-label="Next page"]').click();
    cy.get('.mat-mdc-paginator-range-label').contains('6').should('be.visible');

    cy.get('.users-table__paginator button[aria-label="Previous page"]').click();
    cy.get('.mat-mdc-paginator-range-label').contains('1').should('be.visible');

    cy.get('.users-table__paginator button[aria-label="Last page"]').click();
    cy.get('.users-table__paginator button[aria-label="Last page"]').should('be.disabled');

    cy.get('.users-table__paginator button[aria-label="First page"]').click();
    cy.get('.users-table__paginator button[aria-label="First page"]').should('be.disabled');
  };
});
