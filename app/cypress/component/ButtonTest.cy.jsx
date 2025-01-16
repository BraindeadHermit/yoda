import { Button } from "@/components/ui/button";

describe ('Testing component bottone', () => {
    it ('Testa la scritta del bottone', () => {
        cy.mount(<Button>Click me!</Button>);
        cy.get('Button').should('contain.text', 'Click me!')
    })
});