describe('YO-TC-17.1: Inclusione Femminile', () => {
    before(() => {
        // Pre-condizioni: Login come Mentee
        cy.visit('http://localhost:5173/login');
        
        // Login come Mentee
        cy.get('#email').type('mgv@gmail.com');
        cy.get('#password').type('444444');
        cy.get('Button').click();

        // Verifica login mentee riuscito
        cy.url().should('include', 'http://localhost:5173/HomePageUtente');
        
        // Verifica messaggio di benvenuto
        cy.get('h2').should('contain', 'Benvenuto mariagio');

        cy.wait(2000);
    });

    it('Dovrebbe visualizzare la lista dei mentori donna dopo aver cliccato sul pulsante di supporto femminile', () => {
        cy.contains('button', 'Ricerca il mentore manualmente')
            .should('be.visible') 
            .click(); 

        // Verifica che l'utente venga reindirizzato alla pagina /mentorsearch
        cy.url().should('include', '/mentorsearch');

         // Verifica la presenza del pulsante per accedere alla sezione di supporto femminile
         cy.contains('button', 'Area Inclusione Femminile')
            .should('be.visible') 
            .click(); 

        cy.url().should('include', '/supfem');
        cy.get('p').contains('Caricamento in corso...').should('be.visible');

        cy.wait(2000);

    });

});