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
    <div className="min-h-screen bg-gradient-to-br from-[#178563] to-[#edf2f7] text-black">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">Notifiche</h2>
        <div className="max-w-4xl bg-white rounded-lg shadow-lg p-6 space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => handleMarkAsRead(notification.id)}
                onAccettaMentorship={() => createMentorship(notification)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-lg">Nessuna notifica disponibile.</p>
          )}
        </div>
      </main>
    </div>
  );
};

