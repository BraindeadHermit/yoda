import { db } from "@/firebase/firebase";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

/**
 * Recupera gli incontri di un mentor dal database.
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
   * Delete a meeting by its ID.
   * @param {string} meetingId - The ID of the meeting to delete.
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
   * Filter days with meetings in a specific month and year.
   * @param {Array} meetings - List of meetings.
   * @param {number} month - Month (0-based).
   * @param {number} year - Year.
   * @returns {Array} - List of days with meetings.
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
  
  // Crea un nuovo incontro
  export const createMeeting = async (meetingData) => {
    try {
      const docRef = await addDoc(collection(db, 'meetings'), meetingData);
      return docRef.id; // Restituisce l'ID del documento appena creato
    } catch (error) {
      console.error('Errore durante la creazione dell\'incontro:', error);
      throw error;
    }
  };