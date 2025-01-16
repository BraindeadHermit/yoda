describe('Pubblicazione Video', () => {
  before(() => {
    cy.visit('http://localhost:5173/login');


      // Login come Mentore
      cy.get('#email').type('aleb@gmail.om');
      cy.get('#password').type('000000');
      cy.get('Button').click();

      // Verifica login mentore riuscito
      cy.url().should('include', 'http://localhost:5173/HomePageUtente');
      cy.wait(3000);

      cy.get('h2').should('contain', 'Benvenuto ale');
      cy.wait(2000);

      cy.get('Button:has(svg.lucide.lucide-menu)') // Seleziona l'icona del menu a tendina
          .should('be.visible')
          .click(); // Apre il menu a tendina

      cy.wait(2000);

      cy.contains('Video') // Seleziona la voce del menu Video
          .should('be.visible')
          .click(); // Va alla pagina dei video

      cy.wait(2000);

      cy.url().should('include', 'http://localhost:5173/videos');
      cy.contains('Aggiungi video').click();
  });

  it('Caricamento video', () => {
    
    cy.url().should('include', '/InserireVideo');

    cy.get('#title').type('prova Cypress da youtube');
    cy.get('#description').type('prova Cypress da youtube');
    cy.get('#videoUrl').type('https://www.youtube.com/embed/dQw4w9WgXcQ');
    cy.contains('Carica video').click();

    cy.url().should('include', '/videos');

    cy.wait(6000);

    cy.get('Button:has(svg.lucide.lucide-user)') // Seleziona l'icona dell'utente
            .should('be.visible')
            .click(); // Apre il menu utente

        cy.wait(2000);

        cy.contains('Logout') // Seleziona il pulsante Logout
            .should('be.visible')
            .click(); // Esegue il logout  
  });
});
