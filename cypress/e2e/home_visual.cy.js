describe('Home Page Visual Regression', () => {
  beforeEach(() => {
    // Prevent the instructions overlay from appearing
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('wordleHasVisited', 'true');
      },
    });
  });

  it('should look correct', () => {
    // Wait for the main game board to be visible
    cy.get('[class*=GameBoard]').should('be.visible');
    // Take a visual snapshot with a looser threshold
    cy.matchImageSnapshot('home-page', { failureThreshold: 0.05, failureThresholdType: 'percent' });
  });
}); 