//notifica
import { useState, useEffect } from 'react';
import NotificationCard from '@/components/ui/NotificationCard';
import Header from '@/components/ui/Header';
import { getByDest, deleteNotifica} from '@/dao/notificaDAO';
import { useAuth } from '@/auth/auth-context';
import { initializeMentorship } from '@/dao/mentorshipSessionDAO';
import {removeExpiredNotifications} from '@/dao/notificaDAO';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const { userId } = useAuth();

  //  Carica notifiche all'avvio
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await removeExpiredNotifications();
        const notificationsList = await getByDest(userId);

        // Ordinare le notifiche per data (dalla più recente alla meno recente)
        const sortedNotifications = notificationsList.sort((a, b) => b.timeStamp.toMillis() - a.timeStamp.toMillis());

        console.log(sortedNotifications);

        setNotifications(sortedNotifications);
      } catch (error) {
        alert('Errore nel recupero delle notifiche:' + error);
      }
    };

    fetchNotifications();
  }, [userId]);

  //  Segna come letto (elimina la notifica)
  const handleMarkAsRead = async (id) => {
    try {
      await deleteNotifica(id);
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    } catch (error) {
      alert('Errore nell\'eliminazione della notifica:' + error);
    }
  };

  //  Visualizza dettaglio della notifica
  /*const handleView = async (notification) => {
    const id = getCurrentNotificaId(notification);
    if (id) {
      await deleteNotifica(id); // Elimina dopo la visualizzazione
      navigate(`/notification-detail/${id}`);
    }
  }; */
  const createMentorship = (notification) => {
    initializeMentorship(notification.destinatario, notification.mittente);
    handleMarkAsRead(notification.id);  
  
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-[#ffffff] text-white">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-[#ffffff]">Notifiche</h2>
        <div className="max-w-3xl">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => handleMarkAsRead(notification.id)} // Passa la funzione per segnare come letta
              onAccettaMentorship={() => createMentorship(notification)} // Passa la funzione per accettare la mentorship
            />
          ))}
        </div>
      </main>
    </div>
  );
}
