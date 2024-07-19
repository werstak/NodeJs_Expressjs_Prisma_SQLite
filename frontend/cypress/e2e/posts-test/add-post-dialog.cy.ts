import { DataPost } from '../../constants/data-post';

describe('AddPostDialog', () => {
  const { title, description, content } = DataPost;
  let selectedCategories = '';

  beforeEach(() => {
    cy.login();
    cy.visit('/posts');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts');
  });

  it('should display the page of one post', () => {
    cy.get('app-posts-filter-panel').should('be.visible');
    cy.get('[data-test="add-post-button"]').should('be.visible');
  });

  it('should add a new post', () => {
    openAddPostDialog();
    fillPostDetails(title, description, content);
    selectFirstCategory();
    closeDropdown();
    savePost();
    verifySuccessMessage();
  });

  it('should navigate to the last page when paginator is used', () => {
    cy.get('.mat-mdc-paginator-navigation-last').click();
  });

  // Open the Add Post dialog
  const openAddPostDialog = () => {
    cy.get('[data-test="add-post-button"]').should('be.visible').click();
    cy.get('mat-dialog-container').should('be.visible');
  };

  // Fill in the post details
  const fillPostDetails = (title, description, content) => {
    cy.get('[data-test="post-title-input"]').type(`${title} Updated`);
    cy.get('[data-test="post-description-input"]').type(`${description} Updated`);
    cy.get('[data-test="post-content-input"]').type(`${content} Updated`);
  };

  // Select the first category in the dropdown
  const selectFirstCategory = () => {
    cy.get('[data-test="categories-field"]').click();
    cy.get('mat-option[data-test="categories-title-option"]').first().click().then(option => {
      selectedCategories = option.text().trim();
      cy.wrap(option).should('have.attr', 'aria-selected', 'true');
      cy.get('mat-option[data-test="categories-title-option"]').should('contain.text', selectedCategories);
    });
  };

  // Close the dropdown
  const closeDropdown = () => {
    cy.get('body').type('{esc}');
    cy.wait(100);
  };

  // Save the post
  const savePost = () => {
    cy.get('[data-test="save-post-button"]').click();
  };

  // Verify the success message
  const verifySuccessMessage = () => {
    cy.get('mat-snack-bar-container').should('be.visible');
  };
});





// import { DataPost } from '../../constants/data-post';
//
// describe('AddPostDialog', () => {
//   const title = DataPost.title;
//   const description = DataPost.description;
//   const content = DataPost.content;
//
//   let selectedCategories: string = '';
//
//   beforeEach(() => {
//     cy.login();
//     cy.visit('/posts');
//     cy.url().should('eq', Cypress.config().baseUrl + '/posts');
//   });
//
//   it('should display the page of one post', () => {
//     cy.get('app-posts-filter-panel').should('be.visible');
//     cy.get('[data-test="add-post-button"]').should('be.visible');
//   });
//
//   it('should add the new post', () => {
//     // Ensure the add button is visible and click it
//     cy.get('[data-test="add-post-button"]').should('be.visible').click();
//
//     // Open the dialog and ensure it is visible
//     cy.get('mat-dialog-container').should('be.visible');
//
//     // Add the post details
//     cy.get('[data-test="post-title-input"]').type(`${title} Updated`);
//     cy.get('[data-test="post-description-input"]').type(`${description} Updated`);
//     cy.get('[data-test="post-content-input"]').type(`${content} Updated`);
//
//     // Open the categories dropdown
//     cy.get('[data-test="categories-field"]').click();
//
//     // Select the first categories
//     cy.get('mat-option[data-test="categories-title-option"]').first().click().then(option => {
//       selectedCategories = option.text().trim();
//       // Verify the selected author's option is checked
//       cy.get('mat-option[data-test="categories-title-option"]').first().should('have.attr', 'aria-selected', 'true');
//       // Ensure the categories is selected in the dropdown
//       cy.get('mat-option[data-test="categories-title-option"]').should('contain.text', selectedCategories);
//     });
//
//     // Close the dropdown by pressing the Esc key
//     cy.get('body').type('{esc}');
//     cy.wait(100);
//
//     // Save the changes
//     cy.get('[data-test="save-post-button"]').click();
//
//     // Verify the success message
//     cy.get('mat-snack-bar-container').should('be.visible');
//   });
//
//
//   it('should navigate to the last page when paginator is used', () => {
//     cy.get('.mat-mdc-paginator-navigation-last').click();
//   });
// });
