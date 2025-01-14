import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getAllMentors } from '@/dao/matchingDAO'; // <-- Percorso effettivo del tuo file
import { getDocs, collection, query, where } from 'firebase/firestore';




beforeEach(() => {
    vi.clearAllMocks(); 
    // o vi.resetAllMocks();
  });
  
// Mock completo o parziale di firebase/firestore
vi.mock('firebase/firestore', async (importOriginal) => {
  const original = await importOriginal();

  return {
    // Copia tutto dal modulo reale
    ...original,
    // Mocka le funzioni che usi
    getDocs: vi.fn(),
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
  };
});

describe('getAllMentors', () => {
  test('dovrebbe restituire un array vuoto se non trova alcun mentore', async () => {
    // 1) Prepara i mock per simulare nessun risultato
    collection.mockReturnValueOnce({ /* fake collection ref */ });
    where.mockImplementation((...args) => args); // se serve solo un placeholder
    query.mockReturnValueOnce({ /* fake query ref */ });
    getDocs.mockResolvedValueOnce({
      empty: true,
      docs: [],
    });

    // 2) Invoca la funzione
    const menteeField = 'Informatica';
    const result = await getAllMentors(menteeField);

    // 3) Verifica
    expect(result).toEqual([]);
    expect(getDocs).toHaveBeenCalledTimes(1);
    // Eventuali altre asserzioni
  });

  test('dovrebbe restituire un array di mentori validi', async () => {
    // 1) Prepara i mock per simulare la presenza di documenti
    collection.mockReturnValueOnce({ /* fake collection ref */ });
    where.mockImplementation((...args) => args); // oppure .mockReturnValueOnce(...) più complesso
    query.mockReturnValueOnce({ /* fake query ref */ });
    getDocs.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: 'mentor-1',
          data: () => ({ userType: 'mentor', occupazione: 'Informatica', nome: 'Mario' }),
        },
        {
          id: 'mentor-2',
          data: () => ({ userType: 'mentor', occupazione: 'Informatica', nome: 'Luca' }),
        },
      ],
    });

    // 2) Invoca la funzione
    const menteeField = 'Informatica';
    const result = await getAllMentors(menteeField);

    // 3) Verifica
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result).toEqual([
      { id: 'mentor-1', userType: 'mentor', occupazione: 'Informatica', nome: 'Mario' },
      { id: 'mentor-2', userType: 'mentor', occupazione: 'Informatica', nome: 'Luca' },
    ]);
    expect(collection).toHaveBeenCalledWith(expect.anything(), 'utenti');
    expect(where).toHaveBeenCalledWith('userType', '==', 'mentor');
    expect(where).toHaveBeenCalledWith('occupazione', '==', menteeField);
    expect(getDocs).toHaveBeenCalledTimes(1);
  });

  test('dovrebbe lanciare un errore in caso di eccezione Firestore', async () => {
    // 1) Prepara i mock per simulare un errore
    collection.mockReturnValueOnce({ /* fake collection ref */ });
    query.mockReturnValueOnce({ /* fake query ref */ });
    getDocs.mockRejectedValueOnce(new Error('Errore Firestore'));

    // 2) Invoca la funzione e verifica che lanci un errore
    await expect(getAllMentors('Informatica')).rejects.toThrow('Non è stato possibile recuperare i mentori.');
  });
});
