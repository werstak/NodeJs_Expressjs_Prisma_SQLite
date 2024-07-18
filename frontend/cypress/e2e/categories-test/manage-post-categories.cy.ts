import { CypressEnum } from '../../enums/cypress.enum';

describe('ManagePostCategories', () => {
  const newCategory = CypressEnum.NewCategory;
  const updatedCategory = CypressEnum.UpdatedCategory;

  beforeEach(() => {
    cy.login();
    cy.visit('/posts');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts');
    cy.get('[data-test="manage-categories-button"]').should('be.visible');

    // Open manage categories dialog
    cy.get('[data-test="manage-categories-button"]').click();
    cy.get('mat-dialog-container').should('be.visible');
  });

  it('should add a new category', () => {
    // Click on the add new category button
    cy.get('[data-test="add-category-button"]').click();

    // Enter category name using force: true to bypass visibility check
    cy.get('[data-test="input-category"]').type(newCategory, { force: true });
    cy.wait(300);

    // Click create button
    cy.get('[data-test="submit-category-button"]').should('not.be.disabled');
    cy.get('[data-test="submit-category-button"]').click();
    cy.get('mat-snack-bar-container').should('be.visible');

    // Verify the new category is added
    cy.get('[data-test="category-title"]').should('contain.text', newCategory);
  });


  it('should edit an existing category', () => {
    // Ensure the category is present
    cy.get('[data-test="category-title"]').contains(newCategory).should('be.visible');

    // Edit the category
    cy.get('[data-test="category-title"]').contains(newCategory)
      .parents('.categories')
      .find('[data-test="edit-category-button"]')
      .click();

    // Update category name
    cy.get('[data-test="input-category"]').clear().type(updatedCategory, { force: true });
    cy.wait(300);

    // Click update button
    cy.get('[data-test="submit-category-button"]').should('not.be.disabled');
    cy.get('[data-test="submit-category-button"]').click();
    cy.get('mat-snack-bar-container').should('be.visible');

    // Verify the category name is updated
    cy.get('[data-test="category-title"]').should('contain.text', updatedCategory);
  });


  it('should delete a category', () => {
    // Ensure the category is present
    cy.get('[data-test="category-title"]').contains(updatedCategory).should('be.visible');

    // Delete the category
    cy.get('[data-test="category-title"]').contains(updatedCategory)
      .parents('.categories')
      .find('[data-test="delete-category-button"]')
      .click();

    // Confirm deletion in the dialog
    cy.get('[data-test="confirm-ok-button"]').click();
    cy.get('mat-snack-bar-container').should('be.visible');

    // Verify the category is deleted
    cy.get('[data-test="category-title"]').should('not.contain.text', updatedCategory);
  });
});
