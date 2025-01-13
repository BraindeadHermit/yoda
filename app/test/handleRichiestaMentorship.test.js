import { describe, it, vi, expect } from 'vitest';

// Mock delle funzioni utilizzate
const createNotificationMentorship = vi.fn();
const setSuccessMessage = vi.fn();
const alert = vi.fn();

// La funzione da testare
async function handleRichiestaMentorship(user) {
  try {
    // Validazione dei parametri
    if (!user || !user.userId || !user.id || !user.nome || !user.cognome) {
      throw new Error('Parametri utente non validi');
    }

    // Creazione notifica
    await createNotificationMentorship(user.userId, user.id, user.nome, user.cognome);

    // Impostazione messaggio di successo
    setSuccessMessage("Notifica inviata con successo!");

    // Pulizia del messaggio dopo 3 secondi
    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (error) {
    // Gestione errore
    const errorMessage = error.message || 'Errore sconosciuto';
    alert(`notifica mentorship non inviata con successo: ${errorMessage}`);
  }
}

describe('handleRichiestaMentorship', () => {
  it('dovrebbe creare una notifica e impostare un messaggio di successo', async () => {
    const user = { userId: 1, id: 2, nome: 'Mario', cognome: 'Rossi' };

    await handleRichiestaMentorship(user);

    expect(createNotificationMentorship).toHaveBeenCalledWith(
      user.userId,
      user.id,
      user.nome,
      user.cognome
    );
    expect(setSuccessMessage).toHaveBeenCalledWith("Notifica inviata con successo!");
  });

  it('dovrebbe gestire un errore e mostrare un messaggio di errore', async () => {
    const user = { userId: 1, id: 2, nome: 'Mario', cognome: 'Rossi' };

    // Forziamo un errore nella funzione mock
    createNotificationMentorship.mockImplementation(() => {
      throw new Error('Errore di test');
    });

    await handleRichiestaMentorship(user);

    expect(alert).toHaveBeenCalledWith(
      "notifica mentorship non inviata con successo: Errore di test"
    );
  });

  it('dovrebbe gestire un errore se i parametri utente sono invalidi', async () => {
    const invalidUser = null;

    await handleRichiestaMentorship(invalidUser);

    expect(alert).toHaveBeenCalledWith(
      "notifica mentorship non inviata con successo: Parametri utente non validi"
    );
  });
});