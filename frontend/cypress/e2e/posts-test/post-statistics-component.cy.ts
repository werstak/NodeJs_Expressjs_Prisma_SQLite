import { CypressEnum } from '../../enums/cypress.enum';

describe('PostStatisticsComponent', () => {
  const loginEmail = CypressEnum.LoginEmail;
  const password = CypressEnum.Password;

  before(() => {
    // Visit the login page
    cy.visit('/auth/login');

    // Intercept the login API call and mock the response
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
    }).as('login');

    // Perform the login
    cy.get('input[formControlName="email"]').type(loginEmail);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for the login request to complete
    cy.wait('@login', { timeout: 10000 });

    // Ensure the URL changes to the home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should display the statistics components', () => {
    // Ensure the statistics components are visible
    cy.get('app-post-statistics').should('be.visible');
    cy.get('app-user-statistics').should('be.visible');
  });

  it('should display a loading spinner while data is loading', () => {
    // Intercept the statistics API call and simulate a delay in response
    cy.intercept('GET', '/api/dashboard', (req) => {
      req.on('response', (res) => {
        res.setDelay(2000);
      });
    }).as('getStatistics');

    // Ensure the loading spinner is visible
    cy.get('mat-progress-spinner.posts-spinner').should('be.visible');

    // Wait for the API call to complete
    cy.wait('@getStatistics', { timeout: 10000 });

    // Ensure the loading spinner is no longer visible
    cy.get('mat-progress-spinner.posts-spinner').should('not.exist');
  });

  it('should load the correct data for the statistics components', () => {
    // Intercept the statistics API call with mock data
    cy.intercept('GET', '/api/dashboard', {
      statusCode: 200,
      body: {
        totalPosts: 100,
        postsByRole: [
          { role: 'Admin', count: 50 },
          { role: 'User', count: 50 },
        ],
        postsByUser: [
          { firstName: 'John', lastName: 'Doe', _count: { posts: 30 } },
          { firstName: 'Jane', lastName: 'Smith', _count: { posts: 70 } },
        ],
        postsByCategory: [
          { name: 'Technology', _count: { posts: 40 } },
          { name: 'Health', _count: { posts: 60 } },
        ],
        postsByStatus: [
          { published: true, count: 80 },
          { published: false, count: 20 },
        ],
      },
    }).as('getStatistics');

    // Wait for the API call to complete
    cy.wait('@getStatistics', { timeout: 10000 });

    // Check that the statistics components are displaying the correct data
    cy.get('app-post-statistics').within(() => {
      cy.contains('Total Posts: 100');
      cy.contains('Published Posts: 80');
      cy.get('canvas').should('have.length', 3);
    });
  });
});
