
import { db } from "@/firebase/firebase";
import { getDocs, getDoc, collection, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {acceptNotificationMentorship, removeNotificationMentorship} from "@/dao/notificaDAO";


const mentorshipSessionCollectionRef = collection(db, 'mentorship_session');
const usersCollectionRef = collection(db, 'utenti');
/**
 * Recupera una sessione di mentorship per ID.
 *
 * @param {string} mentorshipId - L'ID della sessione di mentorship da recuperare.
 * @returns {Promise<object>} I dati della sessione di mentorship.
 * @throws {Error} Se la sessione di mentorship non esiste.
 */



export async function fetchMentorship(userId) {
    try {
        const mentorshipSnapshot = await getDocs(mentorshipSessionCollectionRef);
        const sessions = mentorshipSnapshot.docs
            .map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    mentoreId: data.mentoreId,
                    mentoreNome: data.mentoreNome,
                    mentoreCognome: data.mentoreCognome,
                    menteeId: data.menteeId,
                    menteeNome: data.menteeNome,
                    menteeCognome: data.menteeCognome,
                    stato: data.stato,
                    createdAt: data.createdAt
                };
            })
            .filter(session => session.mentoreId === userId || session.menteeId === userId); // Filtra per ID utente
        return sessions;
    } catch (error) {
        throw error;
    }
}

export async function closeMentorshipSession(sessionId) {
    try {
        const sessionRef = doc(mentorshipSessionCollectionRef, sessionId);
        const meeting = await getById(sessionId);
        await updateDoc(sessionRef, { stato: "Inattivo" });
        await removeNotificationMentorship (meeting.mentoreId,meeting.menteeId,meeting.mentoreNome,meeting.mentoreCognome);
        await deleteDoc(sessionRef);
    } catch (error) {
        throw error;
    }
}


export async function getById(mentorshipId) {
    try {
        const docRef = doc(mentorshipSessionCollectionRef, mentorshipId);
        const sessionData = await getDoc(docRef);
        
        if (sessionData.exists()) {
            return {
                id: mentorshipId,
                ...sessionData.data() // Restituisce i dati del documento
            };
        } else {
            throw new Error("Mentorship non trovata!");
        }
    } catch (error) {
        throw error; // Propaga l'errore al chiamante
    }
}

/**
 * Inizializza una nuova sessione di mentorship.
 *
 * @param {string} mentorId - L'ID del mentore.
 * @param {string} menteeId - L'ID del mentee.
 * @returns {Promise<string>} L'ID della nuova sessione mentorship.
 * @throws {Error} Se la creazione della sessione fallisce.
 */
export async function initializeMentorship(mentorId, menteeId) {
    try {
        // Recupera i dati del mentore
        const mentorDoc = await getDoc(doc(usersCollectionRef, mentorId));
        const mentorData = mentorDoc.exists() ? mentorDoc.data() : null;

        // Recupera i dati del mentee
        const menteeDoc = await getDoc(doc(usersCollectionRef, menteeId));
        const menteeData = menteeDoc.exists() ? menteeDoc.data() : null;

        if (!mentorData || !menteeData) {
            throw new Error("Mentore o Mentee non trovati nel database.");
        }

        // Creazione dell'oggetto mentorship con nome e cognome
        const mentorship = {
            mentoreId: mentorId,
            mentoreNome: mentorData.nome,
            mentoreCognome: mentorData.cognome,
            menteeId: menteeId,
            menteeNome: menteeData.nome,
            menteeCognome: menteeData.cognome,
            stato: "Attiva",
            createdAt: new Date(),
        };

        const docRef = await addDoc(mentorshipSessionCollectionRef, mentorship);
        await acceptNotificationMentorship(mentorship.mentoreId, mentorship.menteeId, mentorship.mentoreNome, mentorship.mentoreCognome);
        return docRef.id;
    } catch (error) {
        throw error;
    }
}
/**
 * Recupera il mentore da una sessione di mentorship.
 *
 * @param {string} mentorshipId - L'ID della sessione di mentorship.
 * @returns {Promise<string>} L'ID del mentore.
 * @throws {Error} Se non è possibile recuperare il mentore.
 */
export async function getMentorById(mentorshipId) {
    try {
        const mentorshipData = await getById(mentorshipId);
        return mentorshipData.mentore;
    } catch (error) {
        throw error; // Propaga l'errore al chiamante
    }
}

/**
 * Recupera il mentee da una sessione di mentorship.
 *
 * @param {string} mentorshipId - L'ID della sessione di mentorship.
 * @returns {Promise<string>} L'ID del mentee.
 * @throws {Error} Se non è possibile recuperare il mentee.
 */
export async function getMenteeById(mentorshipId) {
    try {
        const mentorshipData = await getById(mentorshipId);
        return mentorshipData.mentee;
    } catch (error) {
        throw error; // Propaga l'errore al chiamante
    }
}

/**
 * Recupera tutte le sessioni di mentorship in cui un determinato utente è coinvolto come mentore o mentee.
 *
 * @param {string} userId - L'ID dell'utente da cercare.
 * @returns {Promise<object[]>} Una lista di sessioni di mentorship in cui l'utente è coinvolto.
 * @throws {Error} Se non è possibile recuperare le sessioni.
 */
export async function getByUser(userId) {
    try {
        const allSessions = await getAllMentorshipSessions(); // Recupera tutte le sessioni
        const userSessions = allSessions.filter(session =>
            session.mentore === userId || session.mentee === userId // Filtra per utente coinvolto
        );
        return userSessions;
    } catch (error) {
        throw error; // Propaga l'errore al chiamante
    }
}

/**
 * Recupera tutte le sessioni di mentorship dalla collezione.
 *
 * @returns {Promise<object[]>} Una lista di tutte le sessioni di mentorship.
 * @throws {Error} Se non è possibile recuperare tutte le sessioni.
 */
async function getAllMentorshipSessions() {
    try {
        const mentorshipSnapshot = await getDocs(mentorshipSessionCollectionRef);
        const sessions = mentorshipSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() // Restituisce i dati di ciascun documento
        }));
        return sessions;
    } catch (error) {
        throw error; // Propaga l'errore al chiamante
    }
}
