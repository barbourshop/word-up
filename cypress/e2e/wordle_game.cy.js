/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  console.error('Uncaught exception:', err);
  return false;
});

describe('Wordle Game', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('wordleHasVisited', 'true');
      }
    });
  });

  it('renders the game board and keyboard', () => {
    cy.get('[data-testid="main-board"] .game-tile').should('have.length', 30); // 6 rows x 5 cols
    cy.get('[data-testid="game-keyboard"]').within(() => {
      cy.contains('Q').should('exist');
      cy.contains('ENTER').should('exist');
      cy.contains('BACKSPACE').should('exist');
    });
  });

  // it('shows instructions on first visit', () => {
  //   cy.get('[data-testid="instructions-dialog"]').should('be.visible');
  //   cy.contains(/close/i).click();
  //   cy.get('[data-testid="instructions-dialog"]', { timeout: 6000 }).should('not.be.visible');
  // });

  it('allows typing and deleting letters', () => {
    cy.get('[data-testid="main-board"] .game-tile').first().should('be.empty');
    cy.get('[data-testid="game-keyboard"] button').contains(/^A$/).click();
    cy.get('[data-testid="main-board"] .game-tile').first().should('contain', 'A');
    cy.get('[data-testid="game-keyboard"]').contains('BACKSPACE').click();
    cy.get('[data-testid="main-board"] .game-tile').first().should('be.empty');
  });

  it('does not submit incomplete guess', () => {
    cy.get('[data-testid="game-keyboard"] button').contains(/^A$/).click();
    cy.get('[data-testid="game-keyboard"]').contains('ENTER').click();
    cy.get('[data-testid="main-board"] .game-tile').eq(0).should('contain', 'A');
    cy.get('[data-testid="main-board"] .game-tile').eq(1).should('be.empty');
  });

  it('submits a valid guess and advances row', () => {
    cy.wait(500);
    const guess = ['A', 'B', 'C', 'D', 'E'];
    guess.forEach(letter => {
      cy.get('[data-testid="game-keyboard"] button').contains(new RegExp(`^${letter}$`)).click();
      cy.wait(100);
    });
    cy.get('[data-testid="game-keyboard"]').contains('ENTER').click();
    cy.wait(200);
    guess.forEach((letter, idx) => {
      cy.get('[data-testid="main-board"] .game-tile').eq(idx).should('contain.text', letter);
    });
    cy.get('[data-testid="main-board"] .game-tile').eq(6).should('be.empty'); // First tile of second row
  });

  // it('shakes row on invalid guess', () => {
  //   cy.get('[data-testid="game-keyboard"]').contains('A').click();
  //   cy.get('[data-testid="game-keyboard"]').contains('ENTER').click();
  //   cy.get('[data-testid="main-board"] .game-tile').parent().first().should('have.class', 'animate-shake');
  //   cy.wait(600);
  // });

  it('updates keyboard colors after guess', () => {
    cy.wait(500);
    const guess = ['A', 'B', 'C', 'D', 'E'];
    guess.forEach(letter => {
      cy.get('[data-testid="game-keyboard"] button').contains(new RegExp(`^${letter}$`)).click();
      cy.wait(100);
    });
    cy.get('[data-testid="game-keyboard"]').contains('ENTER').click();
    guess.forEach(letter => {
      cy.get('[data-testid="game-keyboard"] button').contains(new RegExp(`^${letter}$`)).should($el => {
        expect(
          $el.hasClass('bg-wordle-correct') ||
          $el.hasClass('bg-wordle-present') ||
          $el.hasClass('bg-wordle-absent')
        ).to.be.true;
      });
    });
  });

  it('ends game after correct guess', () => {
    cy.wait(500);
    // Visit with a known solution
    cy.visit('/?solution=apple', {
      onBeforeLoad(win) {
        win.localStorage.setItem('wordleHasVisited', 'true');
      }
    });
    const guess = ['A', 'P', 'P', 'L', 'E'];
    guess.forEach(letter => {
      cy.get('[data-testid="game-keyboard"] button').contains(new RegExp(`^${letter}$`)).click();
      cy.wait(100);
    });
    cy.get('[data-testid="game-keyboard"]').contains('ENTER').click();
    cy.contains(/congratulations|you win|won|genius|magnificent|impressive|splendid|great|phew/i).should('exist');
  });

  it('ends game after 6 incorrect guesses', () => {
    cy.wait(500);
    // Visit with a known solution
    cy.visit('/?solution=apple', {
      onBeforeLoad(win) {
        win.localStorage.setItem('wordleHasVisited', 'true');
      }
    });
    for (let i = 0; i < 6; i++) {
      ['A', 'B', 'C', 'D', 'E'].forEach(letter => {
        cy.get('[data-testid="game-keyboard"] button').contains(new RegExp(`^${letter}$`)).click();
        cy.wait(100);
      });
      cy.get('[data-testid="game-keyboard"]').contains('ENTER').click();
    }
    cy.contains(/game over|try again|lost|the word was/i).should('exist');
  });

  it('opens and closes stats dialog', () => {
    cy.get('[data-testid="stats-btn"]').click();
    cy.get('[data-testid="stats-dialog"]').should('be.visible');
    cy.contains(/close/i).click();
    cy.get('[data-testid="stats-dialog"]').should('not.exist');
  });

  it('opens and closes instructions dialog', () => {
    cy.get('[data-testid="instructions-btn"]').click();
    cy.get('[data-testid="instructions-dialog"]').should('be.visible');
    cy.get('[data-testid="close-instructions"]').click();
    cy.wait(500); // Wait for animation/state update
    cy.get('[data-testid="instructions-dialog"]', { timeout: 6000 }).should('not.exist');
  });

  it('resets the game with new word', () => {
    cy.get('[data-testid="new-game-btn"]').click();
    cy.get('[data-testid="main-board"] .game-tile').each(tile => {
      cy.wrap(tile).should('be.empty');
    });
  });

  it('does not allow input after game over', () => {
    cy.wait(500);
    // Visit with a known solution
    cy.visit('/?solution=apple', {
      onBeforeLoad(win) {
        win.localStorage.setItem('wordleHasVisited', 'true');
      }
    });
    for (let i = 0; i < 6; i++) {
      ['A', 'B', 'C', 'D', 'E'].forEach(letter => {
        cy.get('[data-testid="game-keyboard"] button').contains(new RegExp(`^${letter}$`)).click();
        cy.wait(100);
      });
      cy.get('[data-testid="game-keyboard"]').contains('ENTER').click();
    }
    // Assert all tiles are filled
    cy.get('[data-testid="main-board"] .game-tile').filter((i, el) => el.textContent === '').should('have.length', 0);
    // Try to enter another letter
    cy.get('[data-testid="game-keyboard"] button').contains(/^A$/).click();
    // Assert the board is still full (no new empty tiles)
    cy.get('[data-testid="main-board"] .game-tile').filter((i, el) => el.textContent === '').should('have.length', 0);
  });
}); 