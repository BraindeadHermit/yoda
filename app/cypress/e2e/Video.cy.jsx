describe('Visualizzazione Video', () => {
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
    
    });

    it('Visualizzazione video ', () => {
        // Aspetta che i video siano caricati
        cy.contains('Contenuti Video').should('be.visible'); // Controlla il titolo della pagina
    
        // Aspetta che i VideoCard siano caricati
        cy.get('main .grid a .group') // Cambia il selettore se necessario
      .contains('prova Cypress da youtube') // Cerca il testo del nome del video
      .should('be.visible') // Assicurati che sia visibile
      .click();
    
        // Verifica che la URL contenga "/video/"
        cy.url().should('include', '/video/');
        
        
        cy.wait(5000);

  cy.get('Button:has(svg.lucide.lucide-user)') // Seleziona l'icona dell'utente
            .should('be.visible')
            .click(); // Apre il menu utente

        cy.wait(2000);

        cy.contains('Logout') // Seleziona il pulsante Logout
            .should('be.visible')
            .click(); // Esegue il logout
    });
});