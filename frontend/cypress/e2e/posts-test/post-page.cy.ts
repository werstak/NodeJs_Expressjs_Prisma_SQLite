import { DataPost } from '../../constants/data-post';

describe('PostComponent', () => {
  const title = DataPost.title;
  const description = DataPost.description;
  const content = DataPost.content;

  let selectedCategories: string = '';

  beforeEach(() => {
    cy.login();
    cy.visit('/posts');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts');
  });

  // it('should display the page of one post', () => {
  //   cy.visit('/posts/1');
  //   cy.url().should('eq', Cypress.config().baseUrl + '/posts/1');
  //   cy.get('mat-card-header').should('be.visible');
  //   cy.get('[data-test="edit-button"]').should('be.visible');
  // });

  it('should edit the post', () => {
    cy.visit('/posts/1');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts/1');

    // Ensure the edit button is visible and click it
    cy.get('[data-test="edit-button"]').should('be.visible').click();

    // // Open the dialog and ensure it is visible
    // cy.get('mat-dialog-container').should('be.visible');
    //
    // // Edit the post details
    // cy.get('[data-test="post-title-input"]').clear().type(`${title} Updated`);
    // cy.get('[data-test="post-description-input"]').clear().type(`${description} Updated`);
    // cy.get('[data-test="post-content-input"]').clear().type(`${content} Updated`);

    // Open the authors dropdown
    cy.get('mat-select[formControlName="categories"]').click();

    // IMPORTANT! Before this test, in the drop-down list of categories, the first category should not be checked.
    // Select the first categories
    cy.get('mat-option[data-test="categories-title-option"]').first().click().then(option => {
      selectedCategories = option.text().trim();
      // Verify the selected author's option is checked
      cy.get('mat-option[data-test="categories-title-option"]').first().should('have.attr', 'aria-selected', 'true');
      // Ensure the categories is selected in the dropdown
      cy.get('mat-option[data-test="categories-title-option"]').should('contain.text', selectedCategories);
    });


    // Deselect the first category
    cy.get('mat-option[data-test="categories-title-option"]').first().click().then(option => {
      selectedCategories = option.text().trim();
      // Verify the selected author's option is not be checked
      cy.get('mat-option[data-test="categories-title-option"]').first().should('have.attr', 'aria-selected', 'false');
    });

    cy.get('body').click(0, 0);

    cy.wait(300);
    // // Update status checkbox
    cy.get('[data-test="postForm"] mat-checkbox[formControlName="published"]').scrollIntoView().should('be.visible').click();
    // cy.get('[data-test="postForm"] mat-checkbox[formControlName="published"]').scrollIntoView().click({ force: true });


    //
    // // Save the changes
    // cy.get('[data-test="save-post-button"]').click();
    //
    // // Verify the success message
    // cy.get('mat-snack-bar-container').should('be.visible');
    //
    // // Verify the post details have been updated
    // cy.get('[data-test="post-title"]').should('contain.text', `${title} Updated`);
    // cy.get('[data-test="post-description"]').should('contain.text', `${description} Updated`);
    // cy.get('[data-test="post-text"]').should('contain.text', `${content} Updated`);
  });




  // it('should delete the post', () => {
  //   cy.visit('/posts/1');
  //   cy.url().should('eq', Cypress.config().baseUrl + '/posts/1');
  //
  //   // Ensure the delete button is visible and click it
  //   cy.get('[data-test="delete-button"]').should('be.visible').click();
  //
  //   // Confirm deletion
  //   cy.get('[data-test="confirm-delete-button"]').click();
  //
  //   // Verify the success message
  //   cy.get('mat-snack-bar-container').should('be.visible');
  //
  //   // Verify the post is deleted and redirects to the posts page
  //   cy.url().should('eq', Cypress.config().baseUrl + '/posts');
  // });
});







// import { CypressEnum } from '../../enums/cypress.enum';
//
// describe('PostComponent', () => {
//   const loginEmail = CypressEnum.LoginEmail;
//   const password = CypressEnum.Password;
//   let accessToken: string;
//
//   before(() => {
//     // Visit the login page
//     cy.visit('/auth/login');
//
//     // Intercept the login API call
//     cy.intercept('POST', Cypress.env('api_server') + '/auth/login', (req) => {
//       req.reply((res) => {
//         accessToken = res.body.accessToken;
//         res.send();
//       });
//     }).as('login');
//
//     // Perform the login
//     cy.get('input[formControlName="email"]').type(loginEmail);
//     cy.get('input[formControlName="password"]').type(password);
//     cy.get('button[type="submit"]').click();
//
//     // Wait for the login request to complete
//     cy.wait('@login');
//
//     // Check URL change to ensure navigation to the home page
//     cy.url().should('eq', Cypress.config().baseUrl + '/');
//   });
//
//   beforeEach(() => {
//     // Set the token in local storage
//     cy.window().then((window) => {
//       window.localStorage.setItem('accessToken', accessToken);
//     });
//
//     // Visit the home page before each test
//     cy.visit('/');
//
//     // Intercept the statistics API call and include the token in headers
//     cy.intercept('GET', Cypress.env('api_server') + '/dashboard', (req) => {
//       req.headers['Authorization'] = `Bearer ${accessToken}`;
//       req.continue((res) => {
//         res.send();
//       });
//     }).as('getStatistics');
//   });
//
//
//   it('should display the page of one post', () => {
//     cy.visit('/posts/1');
//     cy.intercept('GET', Cypress.env('api_server') + '/posts/1', (req) => {
//       req.headers['Authorization'] = `Bearer ${accessToken}`;
//       req.on('response', (res) => {
//         res.setDelay(2000);
//         res.send();
//       });
//     }).as('getPostsDelayed');
//
//
//     // cy.wait('@getPostsDelayed');
//     cy.get('mat-card-header').should('be.visible');
//
//     cy.url().should('eq', Cypress.config().baseUrl + '/posts/1');
//     cy.get('[data-test="edit-button"]').click();
//   });
//
// });
