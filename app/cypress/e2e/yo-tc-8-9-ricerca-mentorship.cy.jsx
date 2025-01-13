// YO-TC-8 e YO-TC-9 Test Case: Ricerca Manuale e Richiesta Mentorship

describe('YO-TC-8 e YO-TC-9: Ricerca manuale del mentore', () => {
    before(() => {
        cy.visit('http://localhost:5173/login');
        // Login come Mentee
        cy.get('#email').type('d@gmail.com');
        cy.get('#password').type('12345678');
        cy.get('Button').click();

        // Verifica login mentee riuscito
        cy.url().should('include', 'http://localhost:5173/HomePageUtente');
        // Verifica messaggio di benvenuto
        cy.get('h2').should('contain', 'Benvenuto Danilo');



    });

    it('Selezioniamo il mentore che vogliamo scegliere', () => {
        cy.wait(2000);

        cy.contains('Ricerca il mentore manualmente').click();

        cy.wait(2000);
        // Passo 1: Seleziona il campo di interesse
        cy.get('[role="combobox"]') // Seleziona il dropdown (SelectTrigger)
            .click();

        cy.contains('Sviluppo Web') // Seleziona l'opzione "Sviluppo Web"
            .click();

        // Verifica che il valore selezionato sia corretto
        cy.get('[role="combobox"]')
            .contains('Sviluppo Web')
            .should('exist');

        cy.wait(2000);

        // Passo 2: Seleziona la disponibilitÃ  di 5 ore settimanali
        cy.get('button') // Cerca tutti i bottoni
            .contains('5') // Seleziona il bottone con il valore 5
            .click();

        // Verifica che il bottone 5 sia selezionato
        cy.get('button')
            .contains('5')
            .should('have.class', 'bg-emerald-600'); // Verifica lo stato selezionato

        cy.wait(2000);

        // Passo 3: Clicca sul bottone "Trova Mentore"
        cy.contains('button', 'Trova Mentore')
            .click();

        // Verifica i risultati della ricerca
        cy.contains('Mentori Disponibili')
            .should('exist'); // Controlla che il titolo dei mentori sia visibile

        cy.wait(2000);

        // Passo 4: Clicca sul bottone "Profilo Pietro"
        cy.contains('button', 'Profilo Pietro')
            .should('be.visible')
            .click();

        cy.wait(2000);

        // Passo 5: Clicca sul bottone "Richiedi Mentorship"
        cy.contains('button', 'Richiedi Mentorship')
            .should('be.visible')
            .click();

    });



});