describe ('Primo test', () => {
    it ('la homepage mostra il titolo e il bottone Registrati Ora', () => {
        cy.visit('http://localhost:5173/');
        cy.get('h2').should('contain.text','Benvenuto su Yoda');
        cy.get('Button').should('contain.text', 'Registrati Ora');
    });

});