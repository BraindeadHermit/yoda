// Updated CalendarioIncontri.js with Edit and Delete
import React, { useState, useEffect } from 'react';
import Header from "@/components/ui/Header";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { fetchMeetingsForMentor, filterDaysWithMeetings, updateMeeting, deleteMeeting } from "@/dao/meetingsDAO"
import { useAuth } from '@/auth/auth-context';

const CalendarioIncontri = () => {
  const [meetings, setMeetings] = useState([]);
  const [daysWithMeetings, setDaysWithMeetings] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [editingMeeting, setEditingMeeting] = useState(null);
  const {userId,nome,cognome} = useAuth();
  const fetchMeetings = async () => {
    try {
      const fetchedMeetings = await fetchMeetingsForMentor(userId);
      setMeetings(fetchedMeetings);
    } catch (error) {
      alert("Errore durante il recupero degli incontri." + error);
    }
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
  };

  const handleSaveEdit = async (updatedMeeting) => {
    try {
      await updateMeeting(updatedMeeting, updatedMeeting.menteeId,userId,nome,cognome);
      setMeetings((prevMeetings) =>
        prevMeetings.map((m) => (m.id === updatedMeeting.id ? updatedMeeting : m))
      );
      setEditingMeeting(null);
    } catch (error) {
      alert("Errore:" + error);
    }
  };
  const handleDelete = async (meetingId,menteeId) => {
    try {
      await deleteMeeting(meetingId,menteeId,userId,nome,cognome);
      setMeetings((prevMeetings) => prevMeetings.filter((m) => m.id !== meetingId));
    } catch (error) {
      alert("Errore:" + error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    const filteredDays = filterDaysWithMeetings(meetings, currentMonth, currentYear);
    setDaysWithMeetings(filteredDays);
  }, [currentMonth, currentYear, meetings]);

  const changeMonth = (direction) => {
    if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7] text-black">
      <Header />

      <div className="py-10">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Calendario Incontri</h1>

          {/* Calendar Card */}
          <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6">
              <button
                className="text-2xl text-gray-700 hover:text-gray-900"
                onClick={() => changeMonth('prev')}
              >
                ←
              </button>
              <span className="font-medium text-xl text-gray-800">
                {new Date(currentYear, currentMonth).toLocaleString('it-IT', {
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <button
                className="text-2xl text-gray-700 hover:text-gray-900"
                onClick={() => changeMonth('next')}
              >
                →
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-3 text-center">
              {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map((day) => (
                <div key={day} className="text-sm font-semibold text-gray-600 uppercase">
                  {day}
                </div>
              ))}

              {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => {
                const day = i + 1;
                const hasMeeting = daysWithMeetings.includes(day);

                return (
                  <div
                    key={day}
                    className={`py-4 text-sm rounded-lg font-medium ${
                      hasMeeting
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    } hover:shadow-md cursor-pointer transition`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Meetings Section */}
          <h2 className="text-2xl font-semibold text-white mb-6">Prossimi Incontri</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center justify-between p-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-lg">
                    📅
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Incontro con {meeting.menteeName}</div>
                    <div className="text-sm text-gray-500">
                      {meeting.date.toLocaleDateString()}, {meeting.time}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleEdit(meeting)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Modifica
                  </Button>
                  <Button
                    onClick={() => handleDelete(meeting.id, meeting.menteeId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Elimina
                  </Button>
                  <Link to={`/MeetingSummary/${meeting.id}`}>
                    <Button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      Post-Meeting
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Add Meeting Button */}
          <Link to="/MeetingScheduler">
            <Button
              className="w-full mt-8 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition text-lg font-semibold"
            >
              + Aggiungi Incontro
            </Button>
          </Link>
        </div>
      </div>

      {/* Edit Meeting Form */}
      {editingMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Modifica Incontro</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedMeeting = {
                  ...editingMeeting,
                  menteeName: e.target.menteeName.value,
                  date: new Date(e.target.date.value),
                  time: e.target.time.value,
                  description: e.target.description.value,
                  topic: e.target.topic.value,
                };
                handleSaveEdit(updatedMeeting);
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nome Mentee</label>
                <input
                  name="menteeName"
                  defaultValue={editingMeeting.menteeName}
                  disabled
                  className="w-full border rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <input
                  name="date"
                  type="date"
                  defaultValue={editingMeeting.date.toISOString().substr(0, 10)}
                  className="w-full border rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ora</label>
                <input
                  name="time"
                  type="time"
                  defaultValue={editingMeeting.time}
                  className="w-full border rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Descrizione</label>
                <textarea
                  name="description"
                  defaultValue={editingMeeting.description}
                  className="w-full border rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Argomento</label>
                <input
                  name="topic"
                  defaultValue={editingMeeting.topic}
                  className="w-full border rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="flex justify-between">
                <Button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  Salva
                </Button>
                <Button
                  onClick={() => setEditingMeeting(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Annulla
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioIncontri;