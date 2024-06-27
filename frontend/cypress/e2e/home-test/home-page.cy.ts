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
//         onResponse: (res: any) => {  // Adjust to the expected type of `res`
//           res.setDelay(2000); // Simulate a delay in response
//         }
//       }).as('getStatistics');
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
//       }).as('getStatisticsMock');
//     });
//
//     // Wait for the API call to complete
//     cy.wait('@getStatisticsMock');
//
//     // Check that the statistics components are displaying the correct data
//     cy.get('app-post-statistics').contains('Expected Post Statistics Data');
//     cy.get('app-user-statistics').contains('Expected User Statistics Data');
//   });
//
//
// });
//







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
    cy.intercept('POST', 'http://localhost:5000/auth/login', (req) => {
      req.reply((res) => {
        accessToken = res.body.accessToken;
        res.send({
          statusCode: 200,
          body: {
            userInfo: {
              id: 1,
              firstName: 'Mila',
              lastName: 'Kunis',
              avatar: 'http://localhost:5000/src/uploads/07052024-101040-mila-kunis-high.jpg',
              email: 'andypetrov114@gmail.com',
              role: 1,
            },
            accessToken,
            refreshToken: res.body.refreshToken,
          },
        });
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

    // Intercept the statistics API call and include the token in headers
    cy.intercept('GET', 'http://localhost:5000/api/dashboard', (req) => {
      req.headers['Authorization'] = `Bearer ${accessToken}`;
      req.continue((res) => {
        res.send();
      });
    }).as('getStatistics');

    // Visit the home page before each test
    cy.visit('/users');
  });

  it('should display the statistics components', () => {
    // Ensure the statistics components are visible
    cy.get('app-post-statistics').should('be.visible');
    cy.get('app-user-statistics').should('be.visible');
  });

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
