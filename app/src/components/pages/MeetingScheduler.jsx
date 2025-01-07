import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { createMeeting } from "@/dao/meetingsDAO";
import Header from "@/components/ui/Header";
import { useAuth } from '@/auth/auth-context';
import { fetchMentorship } from '@/dao/mentorshipSessionDAO';

const MeetingScheduler = () => {
  const { userId, nome, cognome } = useAuth();
  const [mentees, setMentees] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    topic: '',
    participant: '',
    description: '',
  });

  useEffect(() => {
    const fetchMenteesData = async () => {
      try {
        const result = await fetchMentorship(userId);
        if (Array.isArray(result)) {
          setMentees(
            result.map(element => ({
              menteeId: element.menteeId,
              menteeNome: element.menteeNome,
              menteeCognome: element.menteeCognome,
            }))
          );
        } else {
          alert("Dati non validi ricevuti dalla query");
        }
      } catch (error) {
        alert("Errore durante il recupero dei dati:" + error);
      }
    };

    fetchMenteesData();
  }, [userId]);

  const validateForm = () => {
    return (
      formData.date &&
      formData.time &&
      formData.topic &&
      formData.participant &&
      formData.description
    );
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Compila tutti i campi');
      return;
    }

    try {
      const selectedParticipant = mentees.find(mentee => mentee.menteeId === formData.participant);
      if (!selectedParticipant) {
        alert('Partecipante non trovato');
        return;
      }

      if (!selectedParticipant.menteeNome || !selectedParticipant.menteeCognome) {
        alert('I dati del partecipante sono incompleti');
        return;
      }

      const meetingDate = new Date(`${formData.date}T${formData.time}:00`);
      if (isNaN(meetingDate.getTime())) {
        alert("Data non valida!");
        return;
      }

      const timestamp = Timestamp.fromDate(meetingDate);

      const newMeeting = {
        date: timestamp,
        time: formData.time,
        topic: formData.topic,
        description: formData.description,
        mentorId: userId,
        mentorName: nome,
        mentorSurname: cognome,
        menteeId: selectedParticipant.menteeId,
        menteeName: selectedParticipant.menteeNome,
        menteeCognome: selectedParticipant.menteeCognome,
        userType: "mentee",
      };

      await createMeeting(newMeeting);
      alert('Incontro programmato con successo');
    } catch (error) {
      console.error('Errore nella programmazione dell\'incontro:', error);
      alert('Impossibile programmare l\'incontro');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header />
      <div className="mt-8"></div>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          backgroundColor: '#10B981',
          padding: '16px',
          color: '#ffffff'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Programma un nuovo incontro</h1>
        </div>
        <form style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleSubmit}>
          <input type="date" id="date" value={formData.date} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="time" id="time" value={formData.time} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" id="topic" value={formData.topic} onChange={handleInputChange} className="p-2 border rounded" placeholder="Argomento" />
          <select id="participant" value={formData.participant} onChange={handleInputChange} className="p-2 border rounded">
            <option value="">Seleziona un partecipante</option>
            {mentees.map((mentee) => (
              <option key={mentee.menteeId} value={mentee.menteeId}>
                {mentee.menteeNome} {mentee.menteeCognome}
              </option>
            ))}
          </select>
          <textarea id="description" rows="6" value={formData.description} onChange={handleInputChange} className="p-2 border rounded" placeholder="Descrizione"></textarea>
          <button type="submit" style={{ backgroundColor: '#10B981', color: '#ffffff', padding: '12px', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>Programma incontro</button>
        </form>
      </div>
    </div>
  );
};

export default MeetingScheduler;
