describe('Test del form di login', () => {
    const baseUrl = 'http://localhost:5173'; // Cambia l'URL base se necessario
  
    beforeEach(() => {
      cy.visit(`${baseUrl}/login`); // Percorso della pagina di login
    });
  
    it('YO-TC-1.1.7 - Credenziali non valide', () => {
      cy.get('input#email').type('email@gmail.com');
      cy.get('input#password').type('Password!45');
      cy.get('button').contains('LOGIN').click();
  
      cy.get('p')
        .should('contain', 'Firebase: Error')// Verifica delle credenziali errate
    });
  
    it('YO-TC-1.1.8 - Login con successo', () => {
      cy.get('input#email').type('ant@gal.com');
      cy.get('input#password').type('123456');
      cy.get('button').contains('LOGIN').click();
  
      cy.url().should('eq', `${baseUrl}/HomePageUtente`); // Verifica della navigazione alla pagina di successo
    });
  });
  