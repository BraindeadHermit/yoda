// YO-TC-5 Test Case: Immissione della Minuta

describe('YO-TC-5: Immissione della Minuta in una sessione di mentorship', () => {
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

        cy.get('Button').contains('Post-Meeting').click()
        // Compila il campo "Riepilogo dell'Incontro"
        cy.get("textarea[placeholder='Aggiungi un riepilogo']")
            .should("be.visible")
            .type("Esempio di riepilogo dell'incontro", { delay: 50 });

        // Compila il campo "Informazioni Aggiuntive"
        cy.get("textarea[placeholder='Aggiungi informazioni aggiuntive']")
            .should("be.visible")
            .type("Esempio di informazioni aggiuntive", { delay: 50 });

        // Compila il campo "Note e Feedback"
        cy.get("textarea[placeholder='Aggiungi una nuova nota...']")
            .should("be.visible")
            .type("Esempio di nota e feedback", { delay: 50 });

        // Clicca sul pulsante "Invia Dati"
        cy.get("button")
            .contains("Invia Dati")
            .should("be.visible")
            .click();

        // Verifica che il messaggio di successo sia visibile
        cy.contains("Informazioni salvate con successo!")
            .should("be.visible")
            .and("contain.text", "Informazioni salvate con successo!");
    });



});
