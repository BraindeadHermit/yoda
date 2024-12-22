import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import Header from "@/components/ui/header";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CalendarioIncontri = () => {
  const [user, setUser] = useState(null); 
  const [meetings, setMeetings] = useState([]);
  const [daysWithMeetings, setDaysWithMeetings] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const auth = getAuth();
  const db = getFirestore();

  const fetchMeetings = async () => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const mentorId = currentUser.uid;

        const meetingsQuery = query(
          collection(db, 'meetings'),
          where('mentorId', '==', mentorId)
        );
        
        const querySnapshot = await getDocs(meetingsQuery);
        const fetchedMeetings = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const date = data.date.toDate();
          return {
            id: doc.id,
            menteeName: data.menteeName,
            date: date,
            time: data.time,
            description: data.description,
            topic: data.topic,
          };
        });
        
        setMeetings(fetchedMeetings);
      } else {
        alert('Accesso negato. Solo i mentor possono accedere a questa pagina.');
      }
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchMeetings();
  }, [auth]);

  useEffect(() => {
    const filteredDays = meetings
      .filter(meeting => {
        const meetingDate = meeting.date;
        return meetingDate.getMonth() === currentMonth && meetingDate.getFullYear() === currentYear;
      })
      .map(meeting => meeting.date.getDate());

    setDaysWithMeetings([...new Set(filteredDays)]);
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

  if (!meetings.length) {
    return <div>Non hai incontri programmati.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header />
      
      <div style={{
        background: 'linear-gradient(180deg, #10B981 0%, #ffffff 100%)', // Gradiente verde a bianco
        padding: '20px 0',  // Elimina spazio tra l'header e il contenuto
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
        }}>
          <h1 style={{
            fontSize: '24px',
            color: 'black',
            marginBottom: '20px'
          }}>
            Calendario Incontri
          </h1>

          {/* Calendar Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            {/* Calendar Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <button
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                onClick={() => changeMonth('prev')}
              >
                ←
              </button>
              <span>{new Date(currentYear, currentMonth).toLocaleString('it-IT', { month: 'long', year: 'numeric' })}</span>
              <button
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                onClick={() => changeMonth('next')}
              >
                →
              </button>
            </div>

            {/* Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '8px'
            }}>
              {/* Days of week */}
              {['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'].map(day => (
                <div key={day} style={{
                  textAlign: 'center',
                  padding: '8px',
                  fontSize: '14px'
                }}>
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => {
                const day = i + 1;
                const hasMeeting = daysWithMeetings.includes(day);
                
                return (
                  <div
                    key={day}
                    style={{
                      padding: '8px',
                      textAlign: 'center',
                      backgroundColor: hasMeeting ? '#10B981' : 'transparent',
                      color: hasMeeting ? 'white' : 'black',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    {day}
                    {hasMeeting && (
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '4px',
                        backgroundColor: '#10B981',
                        borderRadius: '50%'
                      }}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
                  {/* Upcoming Meetings Section */}
                  <h2 style={{
            fontSize: '20px',
            color: 'black',
            marginBottom: '16px'
          }}>
            Prossimi Incontri
          </h2>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px'
          }}>
            {meetings.map(meeting => (
              <div
                key={meeting.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderBottom: '1px solid #eee'
                }}
              >
                {/* Calendar Icon */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#E6F7F2',
                  borderRadius: '4px',
                  marginRight: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  📅
                </div>

                {/* Meeting Details */}
                <div>
                  <div style={{ fontWeight: '500' }}>
                    Incontro con {meeting.menteeName}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    {meeting.date.toLocaleDateString()}, {meeting.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Meeting Button */}
          <Link to="/MeetingScheduler">
            <Button 
              variant="solid" 
              color="green" 
              className="flex items-center gap-2 w-full justify-center p-4 mt-6"
              style={{
                backgroundColor: '#10B981', // Bottone verde
                color: 'white', // Parole bianche
              }}
            >
              <span className="text-white text-lg font-medium">+</span>
              <span className="text-white text-lg font-medium">Aggiungi incontro</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CalendarioIncontri;
