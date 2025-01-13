describe('YO-TC: Download delle statistiche del mentore', () => {
    before(() => {
        // Pre-condizioni: Login come Mentore e Mentee
        cy.visit('http://localhost:5173/login');

        // Login come Mentee
        cy.get('#email').type('d@gmail.com');
        cy.get('#password').type('12345678');
        cy.get('Button').click();

        // Verifica login mentore riuscito
        cy.url().should('include', 'http://localhost:5173/HomePageUtente');
        cy.wait(2000);

        // Verifica messaggio di benvenuto
        cy.get('h2').should('contain', 'Benvenuto Danilo');
        cy.wait(2000);
        // Logout mentore
        cy.get('Button:has(svg.lucide.lucide-menu)') // Seleziona l'icona dell'utente
            .should('be.visible')
            .click(); // Apre il menu utente

        cy.wait(2000);

        cy.contains('Le mie statistiche') // Seleziona il pulsante Le mie statistiche
            .should('be.visible')
            .click(); 

        cy.wait(2000);
    });
    it('Visualizza le statitstiche e stampa il psf riguardante le statistiche', () => {
        cy.wait(2000);

        cy.contains('DOWNLOAD PDF').click();

    });
})