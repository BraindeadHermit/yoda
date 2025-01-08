describe('Primo test', () => {
    it('Dovrebbe effettuare il login e salvare la sessione',() => {
        cy.session('sessioneUtente',()=>{
            cy.visit('http://localhost:5176/login');
            cy.get('#email').type('coticella09@gmail.com');
            cy.get('#password').type('123456');
            cy.get('button').click();
            cy.url().should('include','/HomePageUtente');
        });
        cy.visit('http://localhost:5176/MeetingScheduler');
        cy.url().should('include','/MeetingScheduler');
        cy.get('[data-cy="page-title"]').should('contain', 'Programma un nuovo incontro');
        cy.get('[data-cy="date-input"]').should('exist');
        cy.get('[data-cy="time-input"]').should('exist');
        cy.get('[data-cy="topic-input"]').should('exist');
        cy.get('[data-cy="participant-select"]').should('exist');
        cy.get('[data-cy="description-textarea"]').should('exist');
        cy.get('[data-cy="submit-button"]').should('exist').and('contain', 'Programma incontro');
    });
    it('Dovrebbe caricare correttamente il modulo di programmazione dell\'incontro', () => {
        cy.session('sessioneUtente');
        cy.visit('http://localhost:5176/MeetingScheduler');
       /* cy.get('[data-cy="page-title"]').should('contain', 'Programma un nuovo incontro');
        cy.get('[data-cy="date-input"]').should('exist');
        cy.get('[data-cy="time-input"]').should('exist');
        cy.get('[data-cy="topic-input"]').should('exist');
        cy.get('[data-cy="participant-select"]').should('exist');
        cy.get('[data-cy="description-textarea"]').should('exist');
        cy.get('[data-cy="submit-button"]').should('exist').and('contain', 'Programma incontro');*/
      });
    
     /* it('Dovrebbe permettere di compilare il modulo e programmare un incontro', () => {
        cy.get('[data-cy="date-input"]').type('2025-01-10');
        cy.get('[data-cy="time-input"]').type('14:30');
        cy.get('[data-cy="topic-input"]').type('Mentorship Session');
        
        // Assumendo che ci sia almeno un mentee disponibile
        cy.get('[data-cy="participant-select"]').select('1'); // Dove "1" è l'ID di un mentee valido
    
        cy.get('[data-cy="description-textarea"]').type('Discussione sul prossimo progetto');
    
        cy.get('[data-cy="submit-button"]').click();
    
        cy.on('window:alert', (text) => {
          expect(text).to.contain('Incontro programmato con successo');
        });
      });
    
      it('Dovrebbe mostrare un alert se il form non è compilato correttamente', () => {
        cy.get('[data-cy="submit-button"]').click();
        cy.on('window:alert', (text) => {
          expect(text).to.contain('Compila tutti i campi');
        });*/
      //});
    });