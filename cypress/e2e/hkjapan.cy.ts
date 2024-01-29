describe('template spec', () => {

  it('passes', () => {

    cy.task('getHKJapanPages').each((page) => {
      cy.visit(`/2023-hk-japan#/${page}`);
      cy.get('.show').should('exist');
      cy.screenshot();
    });
  })
})