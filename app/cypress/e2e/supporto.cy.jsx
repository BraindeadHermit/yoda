//YO-TC-17: Supporto Problematiche

describe('Supporto Mentore - Caso di Test', () => {
    beforeEach(() => {
  
      // Pre-condizioni: Login come Mentee
      cy.visit('http://localhost:5173/login');
  
      // Login come Mentee
      cy.get('#email').type('mgv@gmail.com');
      cy.get('#password').type('444444');
      cy.get('button').click();
  
      // Verifica login mentee riuscito
      cy.url().should('include', 'http://localhost:5173/HomePageUtente');

      cy.get('h2').should('contain', 'Benvenuto mariagio');

      // Naviga alla pagina di Supporto
      cy.get("svg.lucide-menu").should("be.visible").click();
      cy.contains('span', 'Supporto').click(); // Clicca su "Supporto"
      cy.url().should('include', '/support'); // Verifica di essere sulla pagina di supporto

    });
  
    it('Il Mentee può selezionare una problematica e contattare un Mentore', () => {
      
      cy.get('.text-4xl').should('contain', 'Richiedi Supporto'); // Verifica la presenza del titolo
  
      // Seleziona una problematica
      cy.get('button').contains('Seleziona un tipo di problema').click({ force: true }); 


      cy.contains('span', 'Discrimination').click();

      // Seleziona il primo mentore e clicca su "Contatta Mentore"
      cy.get('.shadow-lg').first().within(() => {
        cy.contains('Contatta Mentore').click();
      });
  
      cy.wait(2000);
      // Verifica la navigazione alla pagina di contatto
      cy.url().should('include', '/chat-support');
  
      // Invio della richiesta di contatto
      cy.get('button').contains('Invia').click();
  
    });
  });
  