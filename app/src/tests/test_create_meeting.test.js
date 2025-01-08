import { describe, test, expect, vi } from 'vitest';
import { createMeeting } from '@/dao/meetingsDAO'; // Modifica il percorso corretto
import { getDoc, getDocs, addDoc } from 'firebase/firestore';
import { createNotificationMeeting } from '@/dao/notificaDAO';

// Mock Firebase functions
vi.mock('firebase/firestore', async (importOriginal) => {
  // Importa il modulo originale (quello reale)
  const original = await importOriginal();

  return {
    // Copia TUTTE le export del modulo reale
    ...original,

    // Sovrascrivi solo quelle che vuoi mockare
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),  // <--- aggiungi updateDoc se lo usi
    setDoc: vi.fn(),     // <--- o setDoc, se lo usi
    doc: vi.fn(),        // <--- se usi doc(db, 'utenti', '123'), ecc.
  };
});

// Mock della funzione createNotificationMeeting
vi.mock('@/dao/notificaDAO', () => ({
  createNotificationMeeting: vi.fn()
}));

describe('createMeeting', () => {
  test('dovrebbe creare un meeting correttamente', async () => {
    const meetingData = {
      userType: 'mentee',
      menteeId: '123',
      mentorId: '456',
      mentorName: 'John',
      mentorSurname: 'Doe',
      date: '2025-01-10',
      time: '14:00',
      topic: 'JavaScript',
      description: 'Intro a JS',
      menteeName: 'Alice',
      menteeCognome: 'Smith'
    };

    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ meetingsCount: 2 }) });
    getDocs.mockResolvedValueOnce({ docs: [] });
    addDoc.mockResolvedValueOnce({ id: 'meeting-789' });
    
    const meetingId = await createMeeting(meetingData);
    expect(meetingId).toBe('meeting-789');
  });

  test('dovrebbe lanciare un errore se userType non è mentee', async () => {
    const meetingData = { userType: 'mentor' };
    await expect(createMeeting(meetingData)).rejects.toThrow('Il tipo di utente deve essere mentee');
  });

  test('dovrebbe lanciare un errore se il mentee non esiste', async () => {
    const meetingData = { userType: 'mentee', menteeId: '123' };
    getDoc.mockResolvedValueOnce({ exists: () => false });
    await expect(createMeeting(meetingData)).rejects.toThrow('Mentee con ID 123 non trovato');
  });

  test('dovrebbe lanciare un errore se esiste già un meeting nello stesso orario', async () => {
    const meetingData = {
      userType: 'mentee',
      menteeId: '123',
      mentorId: '456',
      date: '2025-01-10',
      time: '14:00'
    };

    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ meetingsCount: 2 }) });
    getDocs.mockResolvedValueOnce({
      docs: [{ data: () => ({ time: '13:55' }) }] // Esiste un meeting a meno di 10 minuti
    });

    await expect(createMeeting(meetingData)).rejects.toThrow('Non è possibile schedulare un meeting a meno di 10 minuti di distanza da un altro.');
  });
});
