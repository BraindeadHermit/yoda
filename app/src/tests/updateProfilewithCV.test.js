import { describe, test, expect, vi, beforeEach } from 'vitest';
import { updateUserProfile } from '@/dao/userDAO'; // Sostituisci con il percorso corretto
import { updateCV } from '@/auth/user-registration'; // Percorso per la funzione updateCV
import { updateUserProfileWithCV } from '@/dao/userDAO';
import { updateDoc } from 'firebase/firestore';

// Pulizia dei mock prima di ogni test
beforeEach(() => {
    vi.clearAllMocks();
  });
  
  // Mock delle funzioni Firestore
  vi.mock('firebase/firestore', async (importOriginal) => {
    const actual = await importOriginal();
  
    return {
      ...actual,
      doc: vi.fn(),
      updateDoc: vi.fn(),
      getFirestore: vi.fn().mockReturnValue('mockedFirestoreInstance'), // Mock di getFirestore
    };
  });
  
  // Mock delle funzioni storage
  vi.mock('firebase/storage', async (importOriginal) => {
      const original = await importOriginal();
    
      return {
        ...original,
        ref: vi.fn(), // Mock di ref
        uploadBytes: vi.fn().mockResolvedValue({}), // Mock di uploadBytes (simulazione di successo)
        listAll: vi.fn().mockResolvedValue({ items: [] }), // Mock di listAll (simulazione di lista vuota)
        deleteObject: vi.fn().mockResolvedValue({}), // Mock di deleteObject (simulazione di successo)
        getDownloadURL: vi.fn().mockResolvedValue('mockedDownloadURL'), // Mock di getDownloadURL
      };
    });
  
  // Mock della funzione updateCV
  vi.mock('@/auth/user-registration', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        updateCV: vi.fn(), // Aggiungi il mock per la funzione updateCV
      };
  });
  
  // Mock della funzione updateUserProfile
  vi.mock('@/dao/userDAO', async (importOriginal) => {
      const actual = await importOriginal();
      return {
        ...actual,
        updateUserProfile: vi.fn()//.mockImplementation(async (uid, profileData) => {success: true}), // Mock di updateUserProfile
      };
    });

    //Aggiornamento con profilo e CV
    describe('Aggiornamento del profilo con CV', () => {
        test('Dovrebbe aggiornare correttamente il profilo e il CV', async () => {
            // 1) Prepara i mock
            const userId = 'user123';
            const formData = {
              nome: 'Giorgio',
              cognome: 'Leo',
              genere: 'Uomo',
              titoloDiStudio: 'Laurea',
              competenze: 'Sviluppo siti web',
              occupazione: 'Web Developer',
              field: 'Sviluppo Software',
              cv: new File(['file content'], 'file.pdf', { type: 'application/pdf' }), // Simula un file caricato
              oldCvURL: 'oldCvURL', // URL del vecchio CV
            };
          
            // Mock della funzione updateCV
            updateCV.mockResolvedValueOnce('mockedDownloadURL'); // Restituirà l'URL mockato
          
            // Mock della funzione updateUserProfile
            updateUserProfile.mockResolvedValueOnce({ success: true });

            // Invocazione funzione
            const result = await updateUserProfileWithCV(userId, formData);
  
            expect(result).toEqual({ success: true }); // Verifica che il risultato sia quello di un successo
          });
          
      
          
      test('Dovrebbe gestire un errore durante l\'aggiornamento del profilo con CV', async () => {
      // 1) Prepara i mock
      const userId = 'user123';
      const formData = {
        nome: 'Giorgio',
        cognome: 'Leo',
        genere: 'Uomo',
        titoloDiStudio: 'Laurea',
        competenze: 'Sviluppo siti web',
        occupazione: 'Web Developer',
        field: 'Sviluppo Software',
        cv: new File(['file content'], 'cv.pdf', { type: 'application/pdf' }),
        oldCvURL: 'oldCvURL',
      };
  
      // Mock della funzione updateCV che restituisce un errore
      updateCV.mockRejectedValueOnce(new Error('Errore durante il caricamento del CV'));
      // 2) Invoca la funzione
      const result = await updateUserProfileWithCV(userId, formData);
  
      // 3) Asserzioni
      expect(updateCV).toHaveBeenCalledTimes(1); // Verifica che updateCV sia stato chiamato
      expect(result).toEqual({ success: false, error: 'Errore durante il caricamento del CV' }); // Verifica che l'errore venga restituito
    });
  
    test('Dovrebbe gestire un errore durante l\'aggiornamento del profilo', async () => {
      // 1) Prepara i mock
      const userId = 'user123';
      const formData = {
        nome: 'Giorgio',
        cognome: 'Leo',
        genere: 'Uomo',
        titoloDiStudio: 'Laurea',
        competenze: 'Sviluppo siti web',
        occupazione: 'Web Developer',
        field: 'Sviluppo Software',
        cv: new File(['file content'], 'cv.pdf', { type: 'application/pdf' }),
        oldCvURL: 'oldCvURL',
      };
      
      //Mock della funzione updateDoc
      updateDoc.mockRejectedValueOnce(new Error("Errore Firestore"));

      // Mock della funzione updateCV
      updateCV.mockResolvedValueOnce('mockedDownloadURL'); // Restituirà l'URL mockato
  
      // Mock della funzione updateUserProfile che restituisce un errore
      updateUserProfile.mockResolvedValue({success: false, error: 'Errore Firestore'});
      // 2) Invoca la funzione
      const result = await updateUserProfileWithCV(userId, formData);

      // 3) Asserzioni
      expect(result).toEqual({success: false, error: 'Errore Firestore'}); // Verifica che l'errore venga restituito
    });
  });