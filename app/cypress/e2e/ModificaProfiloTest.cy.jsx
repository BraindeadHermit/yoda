
    describe('YO-TC-1.1.12 - Modifica del profilo', () => {
        const baseUrl = 'http://localhost:5173';
    
        it('TC-1.3-3 - Modifica informazioni personali e lavorative', () => {
            // Visita la pagina di modifica profilo
            cy.visit(`${baseUrl}/edit-profile`);
    
            
            // Modifica informazioni personali
            cy.get('input[name="nome"]').should('be.visible').clear().type('Giorgio', { force: true });
            cy.get('input[name="cognome"]').should('be.visible').clear().type('Leo', { force: true });
            cy.get('#altro').should('be.visible').click({ force: true });
            cy.get('button').contains('Avanti').should('be.visible').click({ force: true });
    
            // Modifica informazioni lavorative
        cy.get('#titoloDiStudio').click({ force: true }); // Forza apertura dropdown
        cy.get('div[role="option"]').contains('Diploma').click({ force: true }); // Seleziona l'opzione Laurea
    
        cy.get('#competenze').should('be.visible').clear().type('Sviluppo siti web', { force: true });
            
        cy.get('#occupazione').click();
        cy.get('div[role="option"]').contains('DevOps').click({force: true})
    
            cy.get('button').contains('Modifica').should('be.visible').click({ force: true });
    
            // Verifica il successo
            cy.contains('Modifica completata con successo.')
                .should('be.visible');
        });


        it('Aggiunta di un progetto al portfolio', () => {
            cy.visit(`${baseUrl}/edit-profile`);
        
            cy.wait(3000);  // Attendi che la pagina si carichi completamente
        
            // Vai alla pagina di modifica del profilo e clicca sul pulsante 'Avanti'
            cy.get('button').contains('Avanti').should('be.visible').click({ force: true });
        
            // Clicca sul pulsante '+ Aggiungi al Portfolio'
            cy.contains('+ Aggiungi al Portfolio').click({ force: true });
        
            // Compila i dettagli del progetto
            cy.get('input[placeholder="Nome del progetto"]').type('Progetto Uno');
            cy.get('input[placeholder="Descrizione del progetto"]').type('Descrizione del primo progetto');
            cy.get('input[placeholder="URL del progetto (opzionale)"]').type('https://progetto-uno.com');
            
            // Clicca sul pulsante 'Plus' per aggiungere il progetto
            cy.get('#plus').click({ force: true });

            // Verifica che il progetto sia stato aggiunto correttamente
            cy.contains('Progetto Uno').should('be.visible');
            cy.contains('Descrizione del primo progetto').should('be.visible');
            cy.contains('https://progetto-uno.com').should('have.attr', 'href', 'https://progetto-uno.com');
        
            // Completa il processo di modifica del profilo
            cy.get('button').contains('Modifica').should('be.visible').click({ force: true });
        
            // Verifica il messaggio di conferma del successo
            cy.contains('Modifica completata con successo.').should('be.visible');
        });
        
    });
 
 
  