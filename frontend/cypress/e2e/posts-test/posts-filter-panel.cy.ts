describe('PostsFilterPanel', () => {
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


  it('should allow selecting and deselecting all authors', () => {
    let selectedAuthor: string = '';

    // Open the authors dropdown
    cy.get('mat-select[formControlName="authors"]').click();

    // Select the first author and save its name
    cy.get('mat-option').first().click().then(option => {
      selectedAuthor = option.text();
      console.log(111, selectedAuthor)
    });

    // Ensure mat-option is collapsing
    cy.get('body').click(0, 0);

    // Verify the author was selected
    cy.get('mat-select[formControlName="authors"]').should('contain.text', selectedAuthor);

    // Wait for the posts to be filtered and loaded
    cy.wait(300);

    // Search for the presence of the selected author's posts on the page in <app-preview-post>
    // cy.get('[data-test="posts-grid"]').each(post => {
    //   console.log(222, post)
    //   cy.wrap(post).should('contain.text', selectedAuthor);
    // });

      // cy.get('[data-test="posts-grid"] app-preview-post').each(post => {
      //   console.log(222, post)
      //   cy.wrap(post).should('contain', selectedAuthor);
      // });

    cy.get('[data-test="posts-grid"]').should('contain', selectedAuthor);

    // Deselect all authors
    cy.get('mat-select[formControlName="authors"]').click();
    cy.get('mat-option').contains('Clear All').click();

    // Verify no authors are selected
    // cy.get('mat-select[formControlName="authors"]').should('not.contain', selectedAuthor);

    cy.wait(300);
    cy.get('mat-select[formControlName="authors"]')
      .each(author => {
        cy.wrap(author).should('not.contain', selectedAuthor);
      });
  });






  it('should update the filter when an author is selected', () => {
    // Open the authors dropdown
    cy.get('mat-select[formControlName="authors"]').click();

    // Select an author
    cy.get('mat-option').contains('John Doe').click();
    // Verify the table value is updated
    cy.get('mat-select[formControlName="authors"]').should('contain.text', 'John Doe');
    cy.wait(300);
    cy.get('[data-test="author-name"]')
      .each(author => {
        cy.wrap(author).should('contain.text', 'John Doe');
      });
    // Deselect all authors
    cy.get('mat-option').contains('Select All').click();
    cy.get('mat-option').contains('Deselect All').click();
  });

  it('should clear individual filters when the clear button is clicked', () => {
    // Fill out the form
    cy.get('input[formControlName="title"]').type('Sample Post');
    cy.get('mat-select[formControlName="categories"]').click();
    cy.get('mat-option').contains('Tech').click();
    cy.get('mat-select[formControlName="published"]').click();
    cy.get('mat-option').contains('Published').click();

    // Clear the title filter
    cy.get('[data-test="title-clear-button"]').click();
    cy.get('input[formControlName="title"]').should('have.value', '');

    // Clear the categories filter
    cy.get('[data-test="categories-clear-button"]').click();
    cy.get('mat-select[formControlName="categories"]').should('not.contain.text', 'Tech');

    // Clear the published filter
    cy.get('[data-test="published-clear-button"]').click();
    cy.get('mat-select[formControlName="published"]').should('not.contain.text', 'Published');
  });

  it('should clear all filters when the clear all button is clicked', () => {
    // Select an author
    cy.get('mat-select[formControlName="authors"]').click();
    cy.get('mat-option').contains('John Doe').click();

    // Ensure mat-option is collapsing
    cy.get('body').click(0, 0);

    // Verify the authors dropdown collapses and the selected author is shown
    cy.get('mat-select[formControlName="authors"]').should('contain.text', 'John Doe');

    // Fill out the form
    cy.get('input[formControlName="title"]').type('Sample Post');
    cy.get('mat-select[formControlName="categories"]').click();
    cy.get('mat-option').contains('Tech').click();
    cy.get('mat-select[formControlName="published"]').click();
    cy.get('mat-option').contains('Published').click();

    // Clear all fields
    cy.get('[data-test="clearAllFields-button"]').click();

    // Verify all fields are cleared
    cy.get('input[formControlName="title"]').should('have.value', '');
    cy.get('mat-select[formControlName="categories"]').should('not.contain.text', 'Tech');
    cy.get('mat-select[formControlName="published"]').should('not.contain.text', 'Published');
    cy.get('mat-select[formControlName="authors"]').should('not.contain.text', 'John Doe');
  });

  it('should update the postsService filters when the form is changed', () => {
    // Fill out the form
    cy.get('input[formControlName="title"]').type('Sample Post');
    cy.get('mat-select[formControlName="categories"]').click();
    cy.get('mat-option').contains('Tech').click();
    cy.get('mat-select[formControlName="published"]').click();
    cy.get('mat-option').contains('Published').click();

    cy.wait(300);
    cy.get('[data-test="td-post-title"]')
      .each(postTitle => {
        cy.wrap(postTitle).should('contain.text', 'Sample Post');
      });
  });



  // it('should filter posts by author', () => {
  //   cy.get('app-posts-filter-panel').within(() => {
  //     cy.get('[formControlName="authors"]').click();
  //     cy.get('.mat-option').contains('Author Name').click(); // replace 'Author Name' with an actual author
  //   });
  //   cy.get('[data-test="posts-grid"] app-preview-post').each(post => {
  //     cy.wrap(post).should('contain.text', 'Author Name'); // replace 'Author Name' with the actual author
  //   });
  // });

  // it('should filter posts by category', () => {
  //   cy.get('app-posts-filter-panel').within(() => {
  //     cy.get('[formControlName="categories"]').click();
  //     cy.get('.mat-option').contains('Category Name').click(); // replace 'Category Name' with an actual category
  //   });
  //   cy.get('[data-test="posts-grid"] app-preview-post').each(post => {
  //     cy.wrap(post).should('contain.text', 'Category Name'); // replace 'Category Name' with the actual category
  //   });
  // });

  // it('should display a loading spinner while data is being fetched', () => {
  //   cy.intercept('GET', '/api/posts', req => {
  //     req.continue(res => {
  //       res.setDelay(1000);
  //     });
  //   }).as('getPosts');
  //   cy.visit('/posts');
  //   cy.get('mat-progress-spinner').should('be.visible');
  //   cy.wait('@getPosts');
  //   cy.get('mat-progress-spinner').should('not.exist');
  // });
});
