describe('PostsFilterPanel', () => {
  let selectedAuthor: string = '';
  let selectedCategories: string = '';

  beforeEach(() => {
    cy.login();

    // Verify successful login by checking the URL or a specific element
    cy.visit('/posts');
    cy.url().should('eq', Cypress.config().baseUrl + '/posts');
    cy.get('app-posts-filter-panel').should('be.visible');
  });

  it('should detect posts of the selected author on the page', () => {
    cy.get('app-posts-filter-panel form').should('be.visible');
  });


  it('should update the filter when an author is selected', () => {
    // Open the authors dropdown
    cy.get('mat-select[formControlName="authors"]').click();

    // Select the first author and save its name
    cy.get('mat-option[data-test="author-name-option"]').first().click().then(option => {
      selectedAuthor = option.text().trim();
      // Verify the selected author's option is checked
      cy.get('mat-option[data-test="author-name-option"]').first().should('have.attr', 'aria-selected', 'true');
    });

    // Ensure the author is selected in the dropdown
    cy.get('mat-select[formControlName="authors"]').should('contain.text', selectedAuthor);

    cy.wait(300);

    // Verify the selected author's name in posts
    cy.get('[data-test="posts-grid"] app-preview-post').each(post => {
      cy.wrap(post).should('contain.text', selectedAuthor);
    });

    // Ensure mat-option is collapsing
    cy.get('body').click(0, 0);

    // Deselect all authors
    cy.get('mat-select[formControlName="authors"]').click();
    cy.get('mat-option').contains('Clear All').click();

    // Verify no authors are selected
    cy.wait(300);
    cy.get('mat-select[formControlName="authors"]')
      .each(author => {
        cy.wrap(author).should('not.contain', selectedAuthor);
      });
  });


  it('should update the filter when an categories is selected', () => {
    // Open the authors dropdown
    cy.get('mat-select[formControlName="categories"]').click();

    // Select the first categories and save its name
    cy.get('mat-option[data-test="categories-name-option"]').first().click().then(option => {
      selectedCategories = option.text().trim();
      // Verify the selected author's option is checked
      cy.get('mat-option[data-test="categories-name-option"]').first().should('have.attr', 'aria-selected', 'true');
    });

    // Ensure the categories is selected in the dropdown
    cy.get('mat-select[formControlName="categories"]').should('contain.text', selectedCategories);

    cy.wait(300);

    // Verify the selected categories name in posts
    cy.get('[data-test="posts-grid"] app-preview-post').each(post => {
      cy.wrap(post).should('contain.text', selectedCategories);
    });

    // Ensure mat-option is collapsing
    cy.get('body').click(0, 0);

    // Deselect all categories
    cy.get('mat-select[formControlName="categories"]').click();
    cy.get('mat-option').contains('Clear All').click();

    // Verify no categories are selected
    cy.wait(300);
    cy.get('mat-select[formControlName="categories"]')
      .each(category => {
        cy.wrap(category).should('not.contain', selectedCategories);
      });
  });


  it('should update the filter when a published status is selected', () => {
    let selectedPublished: string = '';

    // Open the published dropdown
    cy.get('mat-select[formControlName="published"]').click();

    // Select the first published status and save its name
    cy.get('mat-option[data-test="published-name-option"]').last().click().then(option => {
      selectedPublished = option.text().trim();
      // Verify the selected published status option is checked
      cy.get('mat-option[data-test="published-name-option"]').last().should('have.attr', 'aria-selected', 'true');
    });

    // Ensure the published status is selected in the dropdown
    cy.get('mat-select[formControlName="published"]').should('contain.text', selectedPublished);

    cy.wait(300);

    // Ensure mat-option is collapsing
    cy.get('body').click(0, 0);

    // Deselect all published statuses
    cy.get('mat-select[formControlName="published"]').click();
    cy.get('mat-option').contains('Clear All').click();

    // Verify no published statuses are selected
    cy.wait(300);
    cy.get('mat-select[formControlName="published"]').should('contain.text', 'Select status');
  });


  it('should fill in all filter fields and clear when you click the “Clear All” button', () => {
    let selectedAuthor: string = '';
    let selectedCategory: string = '';
    let selectedPublished: string = '';

    // Select an author
    cy.get('mat-select[formControlName="authors"]').click();
    cy.get('mat-option[data-test="author-name-option"]').first().click().then(option => {
      selectedAuthor = option.text().trim();
      // Verify the selected author's option is checked
      cy.get('mat-option[data-test="author-name-option"]').first().should('have.attr', 'aria-selected', 'true');
    });
    // Ensure the author is selected in the dropdown
    cy.get('mat-select[formControlName="authors"]').should('contain.text', selectedAuthor);
    cy.wait(300);
    cy.get('body').click(0, 0);

    // Select a category
    cy.get('mat-select[formControlName="categories"]').click();
    cy.get('mat-option[data-test="categories-name-option"]').first().click().then(option => {
      selectedCategory = option.text().trim();
      // Verify the selected category option is checked
      cy.get('mat-option[data-test="categories-name-option"]').first().should('have.attr', 'aria-selected', 'true');
    });
    // Ensure the category is selected in the dropdown
    cy.get('mat-select[formControlName="categories"]').should('contain.text', selectedCategory);
    cy.wait(300);
    cy.get('body').click(0, 0);

    // Select a published status
    cy.get('mat-select[formControlName="published"]').click();
    cy.get('mat-option[data-test="published-name-option"]').first().click().then(option => {
      selectedPublished = option.text().trim();
      // Verify the selected published status option is checked
      cy.get('mat-option[data-test="published-name-option"]').first().should('have.attr', 'aria-selected', 'true');
    });
    // Ensure the published status is selected in the dropdown
    cy.get('mat-select[formControlName="published"]').should('contain.text', selectedPublished);
    cy.wait(300);
    cy.get('body').click(0, 0);

    // Clear all fields
    cy.get('[data-test="clearAllFields-button"]').click();

    // Verify all fields are cleared
    cy.get('mat-select[formControlName="authors"]').should('contain.text', 'Select authors');
    cy.get('mat-select[formControlName="categories"]').should('contain.text', 'Select categories');
    cy.get('mat-select[formControlName="published"]').should('contain.text', 'Select status');
  });
});
