import { db } from "@/firebase/firebase";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc , getDoc , increment} from 'firebase/firestore';

/**
 * Recupera tutti gli incontri di un mentor dal database.
 * @param {string} mentorId - ID del mentor autenticato.
 * @returns {Promise<Array>} - Array di incontri con i dettagli richiesti.
 */
export const fetchMeetingsForMentor = async (mentorId) => {
  const db = getFirestore();

  try {
    const meetingsQuery = query(
      collection(db, 'meetings'),
      where('mentorId', '==', mentorId)
    );

    const querySnapshot = await getDocs(meetingsQuery);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        menteeName: data.menteeName,
        date: data.date.toDate(),
        time: data.time,
        description: data.description,
        topic: data.topic,
      };
    });
  } catch (error) {
    console.error("Errore durante il recupero degli incontri:", error);
    throw new Error("Impossibile recuperare gli incontri.");
  }
};

export const fetchMeetingsForMentee = async (menteeId) => {
  const db = getFirestore();

  try {
    const meetingsQuery = query(
      collection(db, 'meetings'),
      where('menteeId', '==', menteeId)
    );

    const querySnapshot = await getDocs(meetingsQuery);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        menteeName: data.menteeName,
        mentorName: data.mentorName,
        date: data.date.toDate(),
        time: data.time,
        description: data.description,
        topic: data.topic,
      };
    });
  } catch (error) {
    console.error("Errore durante il recupero degli incontri:", error);
    throw new Error("Impossibile recuperare gli incontri.");
  }
};

/**
 * Recupera i dettagli di un singolo incontro.
 * @param {string} meetingId - ID dell'incontro.
 * @returns {Promise<Object>} - Dettagli dell'incontro.
 */
export const fetchMeetingDetails = async (meetingId) => {
  const db = getFirestore();

  try {
    // Riferimento al documento specifico usando l'ID del documento
    const meetingRef = doc(db, 'meetings', meetingId);
    const meetingSnapshot = await getDoc(meetingRef);

    if (!meetingSnapshot.exists()) {
      throw new Error("Incontro non trovato.");
    }

    // Ottieni i dati del documento
    const meetingData = meetingSnapshot.data();

    // Costruisci l'oggetto risultato
    return {
      id: meetingSnapshot.id, // ID del documento
      mentorId: meetingData.mentorId,
      menteeId: meetingData.menteeId,
      date: meetingData.date, // Conversione della data
      time: meetingData.time,
      topic: meetingData.topic,
      description: meetingData.description,
      menteeName: meetingData.menteeName,
      menteeEmail: meetingData.menteeEmail,
      minuta: meetingData.minuta || null, // Valore predefinito se mancante
    };
  } catch (error) {
    console.error("Errore durante il recupero dei dettagli dell'incontro:", error);
    throw new Error("Impossibile recuperare i dettagli dell'incontro.");
  }
};


/**
 * Aggiorna l'incontro con una nuova minuta.
 * @param {string} meetingId - ID dell'incontro da aggiornare.
 * @param {string} minuta - La minuta da aggiornare.
 * @returns {Promise<void>}
 */
export const updateMeetingMinutes = async (meetingId, minuta) => {
  try {
    const meetingRef = doc(db, 'meetings', meetingId);
    await updateDoc(meetingRef, { minuta: minuta });  // Aggiorna solo il campo MINUTA
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della minuta:', error);
    throw error;
  }
};

/**
 * Crea un nuovo incontro.
 * @param {Object} meetingData - Dati dell'incontro.
 * @returns {Promise<string>} - ID del nuovo incontro creato.
 */

export const createMeeting = async (meetingData) => {
  try {
    // Verifica che userType sia mentee
    if (meetingData.userType !== 'mentee') {
      throw new Error('Il tipo di utente deve essere mentee');
    }

    // Recupera il riferimento al documento del mentee nella collezione utenti
    const menteeRef = doc(db, 'utenti', meetingData.menteeId);
    const menteeSnap = await getDoc(menteeRef);

    if (!menteeSnap.exists()) {
      throw new Error(`Mentee con ID ${meetingData.menteeId} non trovato`);
    }

    const menteeData = menteeSnap.data();

    // Se il campo meetingsCount esiste, incrementalo, altrimenti crealo e impostalo a 1
    if (typeof menteeData.meetingsCount === 'number') {
      // Incrementa meetingsCount
      await updateDoc(menteeRef, { meetingsCount: increment(1) });
    } else {
      // Crea meetingsCount e imposta a 1
      await updateDoc(menteeRef, { meetingsCount: 1 });
    }

    // Crea il nuovo meeting
    const newMeeting = {
      mentorId: meetingData.mentorId,
      menteeId: meetingData.menteeId,
      date: meetingData.date,
      time: meetingData.time,
      topic: meetingData.topic,
      description: meetingData.description,
      menteeName: meetingData.menteeName,
      menteeEmail: meetingData.menteeEmail,
      minuta: null,  // Il campo MINUTA inizialmente è null
    };

    // Aggiungi il nuovo incontro al database
    const docRef = await addDoc(collection(db, 'meetings'), newMeeting);
    return docRef.id; // Restituisce l'ID del documento appena creato
  } catch (error) {
    console.error('Errore durante la creazione dell\'incontro:', error);
    throw error;
  }
};

/**
 * Modifica i dettagli di un incontro.
 * @param {string} meetingId - ID dell'incontro da modificare.
 * @param {Object} updatedData - I dati da aggiornare.
 * @returns {Promise<void>}
 */
export const updateMeeting = async (meetingId, updatedData) => {
  try {
    const meetingRef = doc(db, 'meetings', meetingId);
    await updateDoc(meetingRef, updatedData);
  } catch (error) {
    console.error('Errore durante la modifica dell\'incontro:', error);
    throw error;
  }
};

/**
 * Elimina un incontro dal database.
 * @param {string} meetingId - ID dell'incontro da eliminare.
 * @returns {Promise<void>}
 */
export const deleteMeeting = async (meetingId) => {
  try {
    const meetingRef = doc(db, 'meetings', meetingId);
    await deleteDoc(meetingRef);
  } catch (error) {
    console.error('Errore durante l\'eliminazione dell\'incontro:', error);
    throw error;
  }
};

/**
 * Filtra i giorni con incontri in un mese e anno specifici.
 * @param {Array} meetings - Lista di incontri.
 * @param {number} month - Mese (0-based).
 * @param {number} year - Anno.
 * @returns {Array} - Lista dei giorni con incontri.
 */
export const filterDaysWithMeetings = (meetings, month, year) => {
  const daysWithMeetings = meetings
    .filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      return (
        meetingDate.getMonth() === month &&
        meetingDate.getFullYear() === year
      );
    })
    .map((meeting) => new Date(meeting.date).getDate());

  return Array.from(new Set(daysWithMeetings));
};

/**
 * Recupera tutti i mentee.
 * @returns {Promise<Array>} - Lista dei mentee.
 */
export const getMentees = async () => {
  try {
    const menteeQuery = query(collection(db, 'utenti'), where('userType', '==', 'mentee'));
    const querySnapshot = await getDocs(menteeQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Errore durante il recupero dei mentee:', error);
    throw error;
  }
};
