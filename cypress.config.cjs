const { defineConfig } = require('cypress');
const { addMatchImageSnapshotPlugin } = require('@simonsmith/cypress-image-snapshot');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      return config;
    }
  }
}); 