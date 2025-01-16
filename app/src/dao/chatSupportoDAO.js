import { getFirestore, collection, where, query, getDocs, addDoc, orderBy, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import app from "@/firebase/firebase";

const db = getFirestore(app);
const supportCollection = collection(db, "supportChat");
const supportMessagesCollection = collection(db, "supportChatMessages");

// Recupera le chat di un utente
export async function getChatsByUserId(userId, userType) {
  try {
    

    const chatsQuery = query(
      supportCollection,
      where("participants", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );

    const chatsSnapshot = await getDocs(chatsQuery);

    if (chatsSnapshot.empty) {
      return { success: true, data: [] };
    }

    const chats = [];
    for (const chatDoc of chatsSnapshot.docs) {
      const chatData = chatDoc.data();
     


      // Recupera i dettagli del mentee
      if (chatData.menteeId) {
        const menteeDocRef = doc(db, "utenti", chatData.menteeId);
        const menteeDoc = await getDoc(menteeDocRef);
        if (menteeDoc.exists()) {
          const menteeData = menteeDoc.data();
          chatData.menteeName = `${menteeData.nome || "Mentee"} ${menteeData.cognome || "Sconosciuto"}`;
        }
      }

      // Recupera i dettagli del mentore
      if (chatData.mentorId) {
        const mentorDocRef = doc(db, "utenti", chatData.mentorId);
        const mentorDoc = await getDoc(mentorDocRef);
        if (mentorDoc.exists()) {
          const mentorData = mentorDoc.data();
          chatData.mentorName = `${mentorData.nome || "Mentore"} ${mentorData.cognome || "Sconosciuto"}`;
        }
      }

      // Calcola isNewMessage direttamente qui
      const isNewMessage = chatData.lastMessageSenderId && chatData.lastMessageSenderId !== userId;
      chatData.isNewMessage = isNewMessage;

      console.log(`Chat ${chatDoc.id} - Is New Message: ${isNewMessage}`);

      chats.push({ id: chatDoc.id, ...chatData });
    }

    
    return { success: true, data: chats };
  } catch (err) {
  
    return { success: false, error: "Errore durante il recupero delle chat." };
  }
}


// Recupera i messaggi di una chat
export async function getSupportMessages(chatId) {
  try {
    const messagesQuery = query(
      supportMessagesCollection,
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );

    const messagesSnapshot = await getDocs(messagesQuery);
    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return messages;
  } catch (err) {
    console.error("Errore durante il recupero dei messaggi:", err);
    throw new Error("Impossibile recuperare i messaggi.");
  }
}

// Invia un messaggio alla chat
export async function sendSupportMessage(message) {
  try {
    // Aggiungi il messaggio alla raccolta dei messaggi
    await addDoc(supportMessagesCollection, message);
   

    // Recupera il riferimento alla chat
    const chatDocRef = doc(db, "supportChat", message.chatId);
    const chatDoc = await getDoc(chatDocRef);

    // Verifica che la chat esista
    if (!chatDoc.exists()) {
      console.error("La chat non esiste. Creazione non riuscita.");
      return;
    }

    // Aggiorna la chat con le informazioni dell'ultimo messaggio
    await updateDoc(chatDocRef, {
      lastMessage: message.text,
      updatedAt: message.timestamp,
      lastMessageSenderId: message.senderId, // Aggiunge l'ID del mittente
    });

    
  } catch (err) {
    console.error("Errore durante l'invio del messaggio di supporto:", err);
    throw new Error("Impossibile inviare il messaggio.");
  }
}


// Crea una nuova chat
function generateChatId(menteeId, mentorId) {
  return `${menteeId}_${mentorId}`; // Genera ID univoco per la chat
}

export async function createChat(menteeId, mentorId, menteeName, mentorName) {
  try {
    if (!menteeId || !mentorId) {
      throw new Error("Mentee ID o Mentor ID mancante.");
    }

    // Recupera il nome e cognome del mentee
    const menteeDocRef = doc(db, "utenti", menteeId);
    const menteeDoc = await getDoc(menteeDocRef);
    if (menteeDoc.exists()) {
      const menteeData = menteeDoc.data();
      menteeName = `${menteeData.nome || "Mentee"} ${menteeData.cognome || "Sconosciuto"}`;
    }

    // Recupera il nome e cognome del mentore
    const mentorDocRef = doc(db, "utenti", mentorId);
    const mentorDoc = await getDoc(mentorDocRef);
    if (mentorDoc.exists()) {
      const mentorData = mentorDoc.data();
      mentorName = `${mentorData.nome || "Mentore"} ${mentorData.cognome || "Sconosciuto"}`;
    }

    // Verifica se una chat esiste già tra i partecipanti
    const chatsQuery = query(
      supportCollection,
      where("participants", "array-contains", menteeId)
    );

    const chatsSnapshot = await getDocs(chatsQuery);

    let existingChat = null;

    chatsSnapshot.forEach((doc) => {
      const chatData = doc.data();
      if (chatData.participants.includes(mentorId)) {
        existingChat = { id: doc.id, ...chatData };
      }
    });

    if (existingChat) {
      console.log("Chat già esistente:", existingChat);
      return { success: true, id: existingChat.chatId };
    }

    // Se la chat non esiste, creane una nuova
    const chatId = generateChatId(menteeId, mentorId);
    

    const newChat = {
      chatId,
      menteeId,
      menteeName,
      mentorId,
      mentorName,
      participants: [menteeId, mentorId],
      lastMessage: "",
      updatedAt: Date.now(),
    };

    const chatDocRef = doc(db, "supportChat", chatId);
    await setDoc(chatDocRef, newChat);

    return { success: true, id: chatId };
  } catch (err) {
    console.error("Errore durante la creazione della chat:", err);
    return { success: false, error: "Impossibile creare la chat." };
  }
}

