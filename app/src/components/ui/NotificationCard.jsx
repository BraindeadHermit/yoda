import { Button } from "@/components/ui/button";

function NotificationCard({ notification, onMarkAsRead, onAccettaMentorship }) {
  // Formatta il timestamp in un formato leggibile
  const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate(); // Converte il Firestore Timestamp in oggetto Date
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="mb-4 bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col space-y-4">
        <div>
          {/* Mostra chi ha inviato la notifica e il ruolo */}
          <h3 className="text-lg font-medium text-[#178563]">
            {notification.oggetto}
          </h3>
          {/* Mostra il messaggio della notifica */}
          <p className="text-sm text-gray-600">{notification.corpo}</p>
          {/* Mostra l'orario della notifica */}
          <p className="text-xs text-gray-400 mt-2">
            Ricevuta: {formatTimestamp(notification.timeStamp)}
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          {/* Bottone per segnare la notifica come letta */}
          <Button
            variant="default"
            onClick={() => onMarkAsRead(notification.id)} // Passa la funzione per segnare come letta
            className="bg-[#178563] text-white hover:bg-[#178563]/80"
          >
            {notification.type === "mentorship-request" ? "Rifiuta" : "Segna come letto"}
          </Button>

          {/* Bottone per accettare la mentorship, visibile solo per "mentorship-request" */}
          {notification.type === "mentorship-request" && (
            <Button
              variant="default"
              onClick={() => onAccettaMentorship(notification)} // Passa la funzione per accettare la mentorship
              className="bg-[#178563] text-white hover:bg-[#178563]/80"
            >
              Accetta
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCard;
