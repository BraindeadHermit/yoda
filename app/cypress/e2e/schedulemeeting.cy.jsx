// YO-TC-5 Test Case: Immissione della Minuta

describe('YO-TC-4: Schedulazione dei meeting', () => {
    before(() => {
        // Pre-condizioni: Login come Mentore e Mentee
        cy.visit('http://localhost:5173/login');

        // Login come Mentore
        cy.get('#email').type('f@gmail.com');
        cy.get('#password').type('12345678');
        cy.get('Button').click();

        // Verifica login mentore riuscito
        cy.url().should('include', 'http://localhost:5173/HomePageUtente');
        cy.wait(3000);

        // Verifica messaggio di benvenuto
        cy.get('h2').should('contain', 'Benvenuto Francesco');
        cy.wait(2000);
        // Logout mentore
        cy.get('Button:has(svg.lucide.lucide-user)') // Seleziona l'icona dell'utente
            .should('be.visible')
            .click(); // Apre il menu utente

        cy.wait(2000);

        cy.contains('Logout') // Seleziona il pulsante Logout
            .should('be.visible')
            .click(); // Esegue il logout

        cy.wait(2000);

        // Login come Mentee
        cy.get('#email').type('d@gmail.com');
        cy.get('#password').type('12345678');
        cy.get('Button').click();

        // Verifica login mentee riuscito
        cy.url().should('include', 'http://localhost:5173/HomePageUtente');
        // Verifica messaggio di benvenuto
        cy.get('h2').should('contain', 'Benvenuto Danilo');

        cy.wait(2000);

        // Logout mentee
        cy.get('Button:has(svg.lucide.lucide-user)') // Seleziona l'icona dell'utente
            .should('be.visible')
            .click(); // Apre il menu utente

        cy.wait(2000);
        cy.contains('Logout') // Seleziona il pulsante Logout
            .should('be.visible')
            .click(); // Esegue il logout

        cy.wait(2000);
        // Login finale come Mentore per inserire la minuta
        cy.get('#email').type('f@gmail.com');
        cy.get('#password').type('12345678');
        cy.get('Button').click();
    });

    it('Accediamo al meeting al quale vogliamo aggiungere la minuta', () => {
        cy.wait(2000);

        cy.contains('Le tue Mentorship').click();

        cy.wait(2000);
        cy.get('.flex.flex-col') // Usa la classe associata alla card
            .first() // Seleziona la prima card per il test
            .within(() => {
                // Trova e clicca l'icona della freccia per espandere
                cy.get("svg.lucide-chevron-down")
                    .should("be.visible")
                    .click();


                cy.wait(2000);
                cy.contains('Schedule') // Seleziona il pulsante Schedule
                    .should('be.visible')
                    .click(); // Esegue il logout  
            });

        // Verifica di essere stati ridiretti alla pagina corretta
        cy.url().should("include", "/Calendar");

        cy.wait(2000);

        cy.get('Button').contains('+ Aggiungi Incontro').click();
        cy.get('#date').type('2024-11-05');
        cy.get('#time').type('18:00');
        cy.get("input[placeholder='Argomento']")
            .should("be.visible")
            .type("Non ci sono argomenti", { delay: 50 });
        cy.get('select#participant').select('Danilo Cascone');
        cy.get("textarea[placeholder='Descrizione']")
            .should("be.visible")
            .type("Descrizione dettagliata", { delay: 50 });
        cy.get("button")
            .contains("Programma incontro")
            .should("be.visible")
            .click();
        
    });

});