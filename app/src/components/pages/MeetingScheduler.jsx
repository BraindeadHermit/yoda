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
    <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7] text-black">
      <Header />

      <div className="py-10">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-green-500 p-6 text-white">
            <h1 className="text-2xl font-bold">Programma un nuovo incontro</h1>
          </div>
          <form
            className="p-6 space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Data</label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-green-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ora</label>
              <input
                type="time"
                id="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-green-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Argomento</label>
              <input
                type="text"
                id="topic"
                value={formData.topic}
                onChange={handleInputChange}
                placeholder="Argomento"
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-green-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Partecipante</label>
              <select
                id="participant"
                value={formData.participant}
                onChange={handleInputChange}
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-green-200"
                required
              >
                <option value="">Seleziona un partecipante</option>
                {mentees.map((mentee) => (
                  <option key={mentee.menteeId} value={mentee.menteeId}>
                    {mentee.menteeNome} {mentee.menteeCognome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrizione</label>
              <textarea
                id="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descrizione"
                className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-green-200"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Programma incontro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeetingScheduler;
