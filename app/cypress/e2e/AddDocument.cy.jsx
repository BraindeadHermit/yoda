describe('YO-TC Creazione contenuti formativi', () => {
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
        cy.get('Button:has(svg.lucide.lucide-menu)') // Seleziona l'icona dell'utente
            .should('be.visible')
            .click(); // Apre il menu utente

        cy.wait(2000);

        cy.contains('Contenuti') // Seleziona il pulsante Logout
            .should('be.visible')
            .click(); // Esegue il logout

        cy.wait(2000);
    });
    it('Inseriamo il documento nei contenuti formativi', () => {
        cy.wait(2000);

        cy.contains('Aggiungi Documento').click();

        // Compila il campo "Inserisci il nome del contenuto"
        cy.get("input[placeholder='Inserisci il nome del contenuto']")
            .should("be.visible")
            .type("Guida React", { delay: 50 });

        // Passo 1: Seleziona il tipo di file
        cy.get('[role="combobox"]') // Seleziona il dropdown (SelectTrigger)
            .click();

        cy.contains('[role="option"]', 'PDF').click();
        // Verifica che il valore selezionato sia corretto
        cy.get('[role="combobox"]')
            .contains('PDF')
            .should('exist');

        // Simula il clic su "Sfoglia" e carica il file
        cy.get('input[type="file"]') // Seleziona l'input file
            .selectFile('../cypress/fixtures/Guida React.pdf', { force: true });

        // Verifica che il nome del file sia visualizzato
        cy.get('.truncate').should('contain', 'Guida React.pdf');

        // Clicca sul pulsante "Carica Contenuto"
        cy.contains('Carica Contenuto') // Seleziona il pulsante Carica Contenuto
            .should('be.visible')
            .click(); // Carica il contenuto

        // Aggiungi verifiche post-submit
        cy.on('window:alert', (text) => {
            // Verifica il messaggio di completamento
            expect(text).to.contains('Caricamento completato!');
        });


        cy.wait(2000);


    });
})