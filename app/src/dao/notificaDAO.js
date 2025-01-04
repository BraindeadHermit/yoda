import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

// Riferimento alla collection notifiche
const notificationsCollectionRef = collection(db, 'notifiche');

/**
 * Crea una notifica per l'assegnazione di una mentorship.
 * @param {string} mittenteId - ID dell'utente mittente.
 * @param {string} destinatarioId - ID dell'utente destinatario.
 * @param {string} nomeMittente - Nome del mittente.
 * @param {string} cognomeMittente - Cognome del mittente.
 */
export async function createNotificationMentorship(mittenteId, destinatarioId, nomeMittente, cognomeMittente) {
  await createNotification(
    mittenteId,
    destinatarioId,
    'Mentorship',
    `Hai ricevuto richiesta di Mentorship da ${nomeMittente} ${cognomeMittente}`,
    'mentorship-request'
  );
}
export async function acceptNotificationMentorship(mittenteId, destinatarioId, nomeMittente, cognomeMittente) {
  await createNotification(
    mittenteId,
    destinatarioId,
    'Mentorship',
    `Il mentore: ${nomeMittente} ${cognomeMittente} ha accettato la tua richiesta di mentorship`,
    'mentorship-session'
  );
}
export async function removeNotificationMentorship(mittenteId, destinatarioId, nomeMittente, cognomeMittente) {
  await createNotification(
    mittenteId,
    destinatarioId,
    'Mentorship',
    `Il mentore: ${nomeMittente} ${cognomeMittente} ha terminato la tua sessione di mentorship`,
    'mentorship-session'
  );
}

/**
 * Crea una notifica per un nuovo meeting schedulato.
 * @param {string} mittenteId - ID dell'utente mittente.
 * @param {string} destinatarioId - ID dell'utente destinatario.
 * @param {string} nomeMittente - Nome del mittente.
 * @param {string} cognomeMittente - Cognome del mittente.
 */
export async function createNotificationMeeting(mittenteId, destinatarioId, nomeMittente, cognomeMittente) {
  await createNotification(
    mittenteId,
    destinatarioId,
    'Nuovo meeting schedulato',
    `E' stato schedulato un nuovo meeting da ${nomeMittente} ${cognomeMittente}`,
    'meeting'
  );
}

/**
 * Crea una notifica per l'aggiornamento della data di un meeting.
 * @param {string} mittenteId - ID dell'utente mittente.
 * @param {string} destinatarioId - ID dell'utente destinatario.
 * @param {string} nomeMittente - Nome del mittente.
 * @param {string} cognomeMittente - Cognome del mittente.
 */
export async function updateNotificationMeeting(mittenteId, destinatarioId, nomeMittente, cognomeMittente) {
  await createNotification(
    mittenteId,
    destinatarioId,
    'Data del meeting modificata',
    `E' stata modificata la data del meeting da ${nomeMittente} ${cognomeMittente}`,
    'meeting_update'
  );
}

/**
 * Crea una notifica per l'eliminazione di un meeting.
 * @param {string} mittenteId - ID dell'utente mittente.
 * @param {string} destinatarioId - ID dell'utente destinatario.
 * @param {string} nomeMittente - Nome del mittente.
 * @param {string} cognomeMittente - Cognome del mittente.
 */
export async function removeNotificationMeeting(mittenteId, destinatarioId, nomeMittente, cognomeMittente) {
  await createNotification(
    mittenteId,
    destinatarioId,
    'Meeting eliminato',
    `E' stato eliminato un meeting da ${nomeMittente} ${cognomeMittente}`,
    'meeting_removal'
  );
}

/**
 * Funzione generica per creare una notifica.
 * @param {string} mittenteId - ID dell'utente mittente.
 * @param {string} destinatarioId - ID dell'utente destinatario.
 * @param {string} oggetto - Oggetto della notifica.
 * @param {string} corpo - Corpo della notifica.
 * @param {string} type - Tipo della notifica.
 */
async function createNotification(mittenteId, destinatarioId, oggetto, corpo, type) {
  try {
    /**
     * Oggetto che rappresenta una notifica da creare.
     * @property {string} mittente - ID dell'utente mittente.
     * @property {string} destinatario - ID dell'utente destinatario.
     * @property {string} oggetto - Oggetto della notifica.
     * @property {string} corpo - Testo del messaggio della notifica.
     * @property {string} type - Tipo della notifica.
     * @property {Date} timeStamp - Timestamp corrente della creazione.
     */
    const newNotification = {
      mittente: mittenteId,
      destinatario: destinatarioId,
      oggetto: oggetto,
      corpo: corpo,
      type: type,
      timeStamp: new Date(),
    };

    await addDoc(notificationsCollectionRef, newNotification);
    console.log(`Notifica "${oggetto}" creata con successo!`);
  } catch (error) {
    console.error('Errore nella creazione della notifica:', error);
    throw error;
  }
}

/**
 * Recupera tutte le notifiche di un utente.
 * @param {string} userId - ID dell'utente loggato.
 * @returns {Promise<Array<Object>>} Un array di notifiche.
 */
export const getByDest = async (userId) => {
  if (!userId) throw new Error('Utente non autenticato');

  try {
    const q = query(notificationsCollectionRef, where('destinatario', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Errore durante il recupero delle notifiche:', error);
    throw error;
  }
};

/**
 * Recupera una notifica specifica tramite ID.
 * @param {string} id - ID della notifica.
 * @returns {Promise<Object>} La notifica corrispondente.
 */
export const getById = async (id) => {
  try {
    const docRef = doc(db, 'notifiche', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Nessuna notifica trovata con questo ID');
    }
  } catch (error) {
    console.error('Errore durante il recupero della notifica:', error);
    throw error;
  }
};

/**
 * Elimina una notifica tramite ID.
 * @param {string} id - ID della notifica da eliminare.
 */
export const deleteNotifica = async (id) => {
  try {
    const docRef = doc(db, 'notifiche', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Errore durante l\'eliminazione della notifica:', error);
    throw error;
  }
};

/**
 * Estrae l'ID di una notifica.
 * @param {Object} notification - Oggetto della notifica.
 * @returns {string|null} L'ID della notifica o null se non esiste.
 */
export const getCurrentNotificaId = (notification) => notification?.id || null;