import { useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export function useMentorSearch() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const db = getFirestore();

  const searchMentors = async ({ occupation, availability, meetingMode }) => {
    setLoading(true);
    setError("");

    try {
      const mentorsRef = collection(db, "utenti");
      let q = query(mentorsRef); // Inizia con una query vuota

      // Applica filtri dinamici
      if (occupation) q = query(q, where("occupazione", "==", occupation));
      if (availability) q = query(q, where("availability", ">=", availability));
      if (meetingMode) q = query(q, where("meetingMode", "==", meetingMode));

      // Esegui la query
      const querySnapshot = await getDocs(q);
      const mentorList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));


      setMentors(mentorList);
      if (mentorList.length === 0) setError("Nessun mentore trovato.");
    } catch (err) {
      console.error(err);
      setError("Errore durante la ricerca.");
    } finally {
      setLoading(false);
    }
  };

  return { mentors, loading, error, searchMentors };
}
