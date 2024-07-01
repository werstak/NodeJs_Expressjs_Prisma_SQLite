// import { CypressEnum } from '../../enums/cypress.enum';
//
// describe('HomeComponent', () => {
//   const loginEmail = CypressEnum.LoginEmail;
//   const password = CypressEnum.Password;
//
//   before(() => {
//     // cy.log('123=====', loginEmail, password);
//
//     // Perform login and set token in local storage
//     cy.login(loginEmail, password).then((token: string) => {
//       cy.setTokenInLocalStorage(token);
//     });
//
//
//     // cy.get('@accessToken').then(data => {
//     //   cy.log('123=====', data.text());
//     // });
//
//     // Check URL change to ensure navigation to the home page
//     cy.visit('/');
//   });
//
//
//
//   // beforeEach(() => {
//   //   // Get the access token from alias and intercept the API call
//   //   cy.get('@accessToken').then((token: string) => {
//   //     cy.interceptWithToken('getStatistics', 'GET', 'http://localhost:5000/api/dashboard', token, {
//   //       onResponse: (res: any) => {  // Adjust to the expected type of `res`
//   //         res.setDelay(2000); // Simulate a delay in response
//   //       }
//   //     }).as('getStatistics');
//   //   });
//   //
//   //   // Visit the home page before each test
//   //   cy.visit('/');
//   // });
//
//
//
//   it('should ', () => {
//     cy.visit('/users');
//
//     // cy.get('@accessToken').then(data => {
//     //   cy.log(data.text());
//     // });
//
//   });
//
//
//   // it('should display the statistics components', () => {
//   //   // Ensure the statistics components are visible
//   //   cy.get('app-post-statistics').should('be.visible');
//   //   cy.get('app-user-statistics').should('be.visible');
//   // });
//
//
//   // it('should display a loading spinner while data is loading', () => {
//   //   // Ensure the loading spinner is visible
//   //   cy.get('mat-progress-spinner.home-spinner').should('be.visible');
//   //
//   //   // Wait for the delayed API call to complete
//   //   cy.wait('@getStatistics');
//   //
//   //   // Ensure the loading spinner is no longer visible
//   //   cy.get('mat-progress-spinner.home-spinner').should('not.exist');
//   // });
//
//   // it('should load the correct data for the statistics components', () => {
//   //   // Intercept the statistics API call with mock data
//   //   cy.get('@accessToken').then((token: string) => {
//   //     cy.interceptWithToken('getStatisticsMock', 'GET', 'http://localhost:5000/api/dashboard', token, {
//   //       statusCode: 200,
//   //       body: { /* mock statistics data */ },
//   //     }).as('getStatisticsMock');
//   //   });
//   //
//   //   // Wait for the API call to complete
//   //   cy.wait('@getStatisticsMock');
//   //
//   //   // Check that the statistics components are displaying the correct data
//   //   cy.get('app-post-statistics').contains('Expected Post Statistics Data');
//   //   cy.get('app-user-statistics').contains('Expected User Statistics Data');
//   // });
//
//
// });








// import { CypressEnum } from '../../enums/cypress.enum';
//
// describe('HomeComponent', () => {
//   const loginEmail = CypressEnum.LoginEmail;
//   const password = CypressEnum.Password;
//
//   before(() => {
//     // Perform login and set token in local storage
//     cy.login(loginEmail, password).then((token: string) => {
//       cy.setTokenInLocalStorage(token);
//     });
//
//     // Check URL change to ensure navigation to the home page
//     cy.visit('/');
//     cy.url().should('eq', Cypress.config().baseUrl + '/');
//   });
//
//   beforeEach(() => {
//     // Visit the home page before each test
//     cy.visit('/');
//
//     // Get the access token from alias and intercept the API call
//     cy.get('@accessToken').then((token: string) => {
//       cy.interceptWithToken('getStatistics', 'GET', 'http://localhost:5000/api/dashboard', token, {
//         onResponse: (res) => {
//           res.setDelay(2000); // Simulate a delay in response
//         }
//       });
//     });
//   });
//
//   it('should display the statistics components', () => {
//     // Ensure the statistics components are visible
//     cy.get('app-post-statistics').should('be.visible');
//     cy.get('app-user-statistics').should('be.visible');
//   });
//
//   it('should display a loading spinner while data is loading', () => {
//     // Ensure the loading spinner is visible
//     cy.get('mat-progress-spinner.home-spinner').should('be.visible');
//
//     // Wait for the delayed API call to complete
//     cy.wait('@getStatistics');
//
//     // Ensure the loading spinner is no longer visible
//     cy.get('mat-progress-spinner.home-spinner').should('not.exist');
//   });
//
//   it('should load the correct data for the statistics components', () => {
//     // Intercept the statistics API call with mock data
//     cy.get('@accessToken').then((token: string) => {
//       cy.interceptWithToken('getStatisticsMock', 'GET', 'http://localhost:5000/api/dashboard', token, {
//         statusCode: 200,
//         body: { /* mock statistics data */ },
//       });
//     });
//
//     // Wait for the API call to complete
//     cy.wait('@getStatisticsMock');
//
//     // Check that the statistics components are displaying the correct data
//     cy.get('app-post-statistics').contains('Expected Post Statistics Data');
//     cy.get('app-user-statistics').contains('Expected User Statistics Data');
//   });
// });











import { CypressEnum } from '../../enums/cypress.enum';

describe('HomeComponent', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;
  let accessToken: string;

  before(() => {
    // Visit the login page
    cy.visit('/auth/login');

    // Intercept the login API call
    cy.intercept('POST', Cypress.env('api_server') + '/auth/login', (req) => {
      req.reply((res) => {
        accessToken = res.body.accessToken;
        res.send();
      });
    }).as('login');

    // Perform the login
    cy.get('input[formControlName="email"]').type(loginEmail);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for the login request to complete
    cy.wait('@login');

    // Check URL change to ensure navigation to the home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  beforeEach(() => {
    // Set the token in local storage
    cy.window().then((window) => {
      window.localStorage.setItem('accessToken', accessToken);
    });

    // Visit the home page before each test
    cy.visit('/');

    // Intercept the statistics API call and include the token in headers
    cy.intercept('GET', Cypress.env('api_server') + '/dashboard', (req) => {
      req.headers['Authorization'] = `Bearer ${accessToken}`;
      req.continue((res) => {
        res.send();
      });
    }).as('getStatistics');
  });


  // it('should display the statistics components', () => {
  //   // Ensure the statistics components are visible
  //   cy.get('app-post-statistics').should('be.visible');
  //   cy.get('app-user-statistics').should('be.visible');
  // });


  it('TEST POSTS', () => {

    cy.intercept('GET', Cypress.env('api_server') + '/categories', (req) => {
      req.headers['Authorization'] = `Bearer ${accessToken}`;
      req.on('response', (res) => {
        res.setDelay(2000);
        res.send();
      });
    }).as('getCategoriesDelayed');


    // Intercept the statistics API call with a delay
    cy.visit('/posts/3');
    cy.intercept('GET', Cypress.env('api_server') + '/posts/3', (req) => {
      req.headers['Authorization'] = `Bearer ${accessToken}`;
      req.on('response', (res) => {
        res.setDelay(2000);
        res.send();
      });
    }).as('getPostsDelayed');


    // cy.wait('@getPostsDelayed');

    // Ensure the loading spinner is visible
    cy.get('mat-card-header').should('be.visible');

    cy.url().should('eq', Cypress.config().baseUrl + '/posts/3');
    cy.get('[data-test="edit-button"]').click();
    // cy.get('[data-test="cancel-button"]').click();
  });


  // it('TEST USERS', () => {
  //   // Intercept the statistics API call with a delay
  //   cy.visit('/users');
  //   cy.intercept('GET', 'http://localhost:5000/api/users', (req) => {
  //     req.headers['Authorization'] = `Bearer ${accessToken}`;
  //     req.on('response', (res) => {
  //       res.setDelay(2000);
  //       res.send();
  //     });
  //   }).as('getUserDelayed');
  //
  //   // cy.wait('@getUserDelayed');
  //
  //     cy.get('[data-test="addUser-button"]').click()
  //
  //
  //   // Ensure the loading spinner is visible
  //   // cy.get('[data-test="userForm"]').should('be.visible');
  //
  //   cy.url().should('eq', Cypress.config().baseUrl + '/users');
  //   // cy.get('[data-test="cancel-button"]').click();
  // });




  // it('should display a loading spinner while data is loading', () => {
  //   // Intercept the statistics API call with a delay
  //   cy.intercept('GET', 'http://localhost:5000/api/dashboard', (req) => {
  //     req.headers['Authorization'] = `Bearer ${accessToken}`;
  //     req.on('response', (res) => {
  //       res.setDelay(2000);
  //       res.send();
  //     });
  //   }).as('getStatisticsDelayed');
  //
  //   // Ensure the loading spinner is visible
  //   cy.get('mat-progress-spinner.home-spinner').should('be.visible');
  //
  //   // Wait for the delayed API call to complete
  //   cy.wait('@getStatisticsDelayed');
  //
  //   // Ensure the loading spinner is no longer visible
  //   cy.get('mat-progress-spinner.home-spinner').should('not.exist');
  // });

  // it('should load the correct data for the statistics components', () => {
  //   // Intercept the statistics API call with mock data
  //   cy.intercept('GET', 'http://localhost:5000/api/dashboard', {
  //     headers: {
  //       'Authorization': `Bearer ${accessToken}`
  //     },
  //     statusCode: 200,
  //     body: { /* mock statistics data */ },
  //   }).as('getStatisticsMock');
  //
  //   // Wait for the API call to complete
  //   cy.wait('@getStatisticsMock');
  //
  //   // Check that the statistics components are displaying the correct data
  //   cy.get('app-post-statistics').contains('Expected Post Statistics Data');
  //   cy.get('app-user-statistics').contains('Expected User Statistics Data');
  // });

});







// import { CypressEnum } from '../../enums/cypress.enum';
//
// describe('HomeComponent', () => {
//   const loginEmail = CypressEnum.LoginEmail;
//   const password = CypressEnum.Password;
//
//   before(() => {
//     // Perform login and set token in local storage
//     cy.login(loginEmail, password)
//       .then((accessToken) => {
//       cy.setTokenInLocalStorage(accessToken);
//     });
//
//     // Intercept the dashboard API call with the token
//     cy.get('@accessToken').then((accessToken) => {
//       if (typeof accessToken === 'string') {
//         cy.interceptWithToken('getStatistics', 'GET', `${Cypress.env('api_server')}/dashboard`, accessToken, {});
//       }
//     });
//
//     // Visit the home page
//     cy.visit('/');
//   });
//
//   beforeEach(() => {
//     // Intercept the dashboard API call with the token before each test
//     cy.get('@accessToken').then((accessToken) => {
//       if (typeof accessToken === 'string') {
//         cy.interceptWithToken('getStatistics', 'GET', `${Cypress.env('api_server')}/dashboard`, accessToken, {});
//       }
//     });
//
//     // Visit the home page before each test
//     cy.visit('/');
//   });
//
//   it('TEST POSTS', () => {
//     // Visit the posts page
//     cy.visit('/posts/3');
//
//     // Intercept the posts API call with a delay
//     cy.get('@accessToken').then((accessToken) => {
//       if (typeof accessToken === 'string') {
//         cy.interceptWithToken('getPostsDelayed', 'GET', `${Cypress.env('api_server')}/posts/3`, accessToken, (req) => {
//           req.on('response', (res) => {
//             res.setDelay(2000);
//             res.send();
//           });
//         });
//       }
//     });
//
//     // Ensure the loading spinner is visible
//     cy.get('mat-card-header').should('be.visible');
//
//     // Verify URL
//     cy.url().should('eq', Cypress.config().baseUrl + '/posts/3');
//
//     // Interact with elements on the page
//     cy.get('[data-test="edit-button"]').click();
//   });
// });
