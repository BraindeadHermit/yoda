describe('Registrazione utente', () => {
  
  beforeEach(() => {
    // Naviga sulla pagina di registrazione prima di ogni test
    cy.visit('http://localhost:5173/register');
  });

  it('TC-1.1-6 - Registrazione riuscita con dati validi', () => {
      // Step 1 - Inserimento dati utente base
      cy.get('#nome').type('Mario');
      cy.get('#cognome').type('Rossi');
      cy.get('#email').type('marioiii.rossi@test.com');
      cy.get('#password').type('Password123!');
      cy.get('#dataDiNascita').type('1990-01-01');
      cy.get('#maschio').click();
      cy.get('button').contains('Avanti').click();
  
      // **Titolo di Studio**
      cy.get('#titoloDiStudio').click({ force: true }); // Forza apertura dropdown
      cy.get('div[role="option"]').contains('Laurea').click({ force: true }); // Seleziona l'opzione Laurea
  
      // **Competenze**
      cy.get('#competenze')
          .should('be.visible')
          .clear()
          .type('JavaScript, React, Node.js', { force: true });
  
      // **Seleziona tipo utente mentee**
      cy.get('#mentee').click({ force: true });
  
      // **Campo di Interesse (Field)**
      cy.get('#field').click({ force: true }); // Apre il dropdown
      cy.get('div[role="option"]').contains('DevOps').click({ force: true }); // Seleziona DevOps
  
      // **Registrazione**
      cy.get('button').contains('Registrati').click();
  
  
      cy.url({ timeout: 10000 }).should('eq', 'http://localhost:5173/HomePageUtente'); // Verifica reindirizzamento
  });
  

  it('TC-1.1-1 - Errore con email già registrata', () => {
      cy.visit('http://localhost:5173/register');
      
      // **Step 1 - Inserimento dati utente base**
      cy.get('#nome').type('Mario');
      cy.get('#cognome').type('Rossi');
      cy.get('#email').type('marios.rossiss@test.com');
      cy.get('#password').type('Password123!');
      cy.get('#dataDiNascita').type('1990-01-01');
      cy.get('#maschio').click();
      cy.get('button').contains('Avanti').click();
  
      // **Titolo di Studio**
      cy.get('#titoloDiStudio').click({ force: true });
      cy.get('div[role="option"]').contains('Laurea').click({ force: true });
  
      // **Competenze**
      cy.get('#competenze')
          .should('be.visible')
          .clear()
          .type('JavaScript, React, Node.js', { force: true });
  
      // **Seleziona tipo utente mentee**
      cy.get('#mentee').click({ force: true });
  
      // **Campo di Interesse (Field)**
      cy.get('#field').click({ force: true });
      cy.get('div[role="option"]').contains('DevOps').click({ force: true });
  
      // **Registrazione**
      cy.get('button').contains('Registrati').click();
      
      // **Verifica l'errore di email già registrata**
      cy.contains(/L'email è già registrata/i).should('be.visible');
  });

  it('Errore - Campo Nome non valido', () => {
    cy.visit('http://localhost:5173/register');
    cy.get('#nome').clear();
    cy.get('#cognome').type('Rossi');
    cy.get('#email').type('mario.rossi@test.com');
    cy.get('#password').type('Password123!');
    cy.get('#dataDiNascita').type('1990-01-01');
    cy.get('#maschio').click();  
    cy.get('button').contains('Avanti').click();

    cy.contains('Nome è obbligatorio').should('be.visible');
  });

  it('Errore - Campo Cognome non valido', () => {
    cy.visit('http://localhost:5173/register');
    cy.wait(1000); // Aspetta 1 secondo per garantire il caricamento
    cy.get('#nome').should('be.visible').type('Mario');
    cy.get('#cognome').clear();
    cy.get('#email').type('mario.rossi@test.com');
    cy.get('#password').type('Password123!');
    cy.get('#dataDiNascita').type('1990-01-01');
    cy.get('#maschio').click();  
    cy.get('button').contains('Avanti').click();

    cy.contains('Cognome è obbligatorio').should('be.visible');
  });

  it('Errore - Email non valida', () => {
    cy.visit('http://localhost:5173/register');
    cy.get('#nome').type('Mario');
    cy.get('#cognome').type('Rossi');
    cy.get('#email').type('email-non-valida');
    cy.get('#password').type('Password123!');
    cy.get('#dataDiNascita').type('1990-01-01');
    cy.get('#maschio').click();  
    cy.get('button').contains('Avanti').click();

    cy.contains('Email non valido').should('be.visible');
  });

  it('Errore - Password non valida', () => {
    cy.visit('http://localhost:5173/register');
    cy.get('#nome').type('Mario');
    cy.get('#cognome').type('Rossi');
    cy.get('#email').type('mario.rossi@test.com');
    cy.get('#password').clear();
    cy.get('#dataDiNascita').type('1990-01-01');
    cy.get('#maschio').click();  
    cy.get('button').contains('Avanti').click();

    cy.contains('Password è obbligatorio').should('be.visible');
  });
});
