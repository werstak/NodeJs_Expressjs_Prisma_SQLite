import { DataPost } from '../../constants/data-post';

describe('EditPostDialog', () => {
  const { title, description, content } = DataPost;
  const postUrl = `${Cypress.config().baseUrl}/posts/1`;
  let selectedCategories = '';

  beforeEach(() => {
    cy.login();
    cy.visit('/posts');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts');
  });

  it('should display the page of one post', () => {
    cy.visit(postUrl);
    cy.url().should('eq', postUrl);
    cy.get('mat-card-header').should('be.visible');
    cy.get('[data-test="edit-button"]').should('be.visible');
  });

  it('should edit the post', () => {
    openEditDialog();
    fillPostDetails(title, description, content);
    toggleCategoryOption();
    togglePublishedCheckbox();
    savePost();
    verifySuccessMessage();
    verifyPostDetails(title, description, content);
  });

  // Open the Edit Post dialog
  const openEditDialog = () => {
    cy.visit(postUrl);
    cy.url().should('eq', postUrl);
    cy.get('[data-test="edit-button"]').should('be.visible').click();
    cy.get('mat-dialog-container').should('be.visible');
  };

  // Fill in the post details
  const fillPostDetails = (title, description, content) => {
    cy.get('[data-test="post-title-input"]').clear().type(`${title} Updated`);
    cy.get('[data-test="post-description-input"]').clear().type(`${description} Updated`);
    cy.get('[data-test="post-content-input"]').clear().type(`${content} Updated`);
  };

  // Toggle the first category option
  const toggleCategoryOption = () => {
    cy.get('[data-test="categories-field"]').click();
    cy.get('mat-option[data-test="categories-title-option"]').first().then(option => {
      const isSelected = option.attr('aria-selected') === 'true';
      cy.wrap(option).click().should('have.attr', 'aria-selected', isSelected ? 'false' : 'true');
      selectedCategories = option.text().trim();
      cy.get('mat-option[data-test="categories-title-option"]').should('contain.text', selectedCategories);
    });
    cy.get('body').type('{esc}');
    cy.wait(100);
  };

  // Toggle the published checkbox
  const togglePublishedCheckbox = () => {
    cy.get('[data-test="postForm"] mat-checkbox[formControlName="published"]').scrollIntoView().should('be.visible')
      .find('input')
      .then($checkbox => {
        if ($checkbox.is(':checked')) {
          cy.get('[data-test="postForm"] mat-checkbox[formControlName="published"]').click();
        } else {
          cy.get('[data-test="postForm"] mat-checkbox[formControlName="published"]').click();
        }
      });
  };

  // Save the post
  const savePost = () => {
    cy.get('[data-test="save-post-button"]').click();
  };

  // Verify the success message
  const verifySuccessMessage = () => {
    cy.get('mat-snack-bar-container').should('be.visible');
  };

  // Verify the post details
  const verifyPostDetails = (title, description, content) => {
    cy.get('[data-test="post-title"]').should('contain.text', `${title} Updated`);
    cy.get('[data-test="post-description"]').should('contain.text', `${description} Updated`);
    cy.get('[data-test="post-text"]').should('contain.text', `${content} Updated`);
  };
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
