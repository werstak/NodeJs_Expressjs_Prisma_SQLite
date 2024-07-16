describe('ManagePostCategories', () => {
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

    // Wait for the input field to appear
    cy.get('[data-test="input-category"]', { timeout: 10000 }).should('be.visible');
    // cy.get('input[formControlName="category"]', { timeout: 10000 }).should('be.visible');

    // Enter category name
    cy.get('input[formControlName="category"]').type('New Category');

    // Click create button
    cy.get('button.category__btnSubmit').click();

    // Verify the new category is added
    cy.get('.categories__title').should('contain.text', 'New Category');
  });

  // it('should edit an existing category', () => {
  //   // Open manage categories dialog
  //   cy.get('[data-test="manage-categories-button"]').click();
  //
  //   // Edit the first category
  //   cy.get('.categories__btn button[matTooltip="Edit"]').first().click();
  //
  //   // Update category name
  //   cy.get('input[formControlName="category"]').clear().type('Updated Category');
  //
  //   // Click update button
  //   cy.get('button.category__btnSubmit').click();
  //
  //   // Verify the category name is updated
  //   cy.get('.categories__title').first().should('contain.text', 'Updated Category');
  // });

  // it('should delete a category', () => {
  //   // Open manage categories dialog
  //   cy.get('[data-test="manage-categories-button"]').click();
  //
  //   // Delete the first category
  //   cy.get('.categories__btn button[matTooltip="Delete"]').first().click();
  //
  //   // Confirm deletion in the dialog
  //   cy.get('.mat-dialog-actions button').contains('Delete').click();
  //
  //   // Verify the category is deleted
  //   cy.get('.categories__title').should('not.contain.text', 'Category to be deleted');
  // });
});
