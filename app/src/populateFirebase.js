import { getFirestore, setDoc, doc, getDoc, connectFirestoreEmulator } from "firebase/firestore";
import { app } from "@/Firebase/firebase"; // Importa la configurazione Firebase
import { getStorage, ref, uploadBytes, getDownloadURL,  connectStorageEmulator} from "firebase/storage";

// Ottieni Firestore
const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);


// Funzione per caricare un file locale su Firebase Storage Emulator e ottenere l'URL
async function uploadLocalFileToEmulator(storagePath, localFilePath) {
    try {
        // Ottieni il riferimento al servizio di storage
        const storage = getStorage(app);
        connectStorageEmulator(storage, "localhost", 9199);
        // Configura il collegamento agli emulatori (deve essere fatto prima di utilizzare lo storage)
        
        const storageRef = ref(storage, storagePath); // Crea un riferimento nel storage
        const snapshot = await uploadBytes(storageRef, localFilePath); // Carica il file
        const downloadURL = await getDownloadURL(snapshot.ref); // Ottieni l'URL del file
        return downloadURL;
    } catch (error) {
        console.error("Errore durante il caricamento del file sull'emulatore:", error);
        return null;
    }
}

// Funzione per popolare il database
async function populateDatabase() {
    try {
        // Controllo se il database è già popolato
        const checkDoc = doc(db, "meta", "populated");
        const checkSnapshot = await getDoc(checkDoc);

        if (checkSnapshot.exists()) {
            console.log("Il database è già popolato. Salto il popolamento.");
            return;
        }

        console.log("Popolamento del database in corso...");

        // Mentori
        const mentors = [
            {
                id: "mentor1",
                data: {
                    availability: 10,
                    cognome: "Rossi",
                    competenze: "Machine Learning",
                    createdAt: "2024-12-23T22:07:19.275Z",
                    cv: null,
                    dataNascita: "1985-07-10",
                    email: "rossi.ml@gmail.com",
                    password: "000000", // Cripta la password con crypto
                    field: null,
                    meetingMode: "online",
                    nome: "Mario",
                    occupazione: "Machine Learning Engineer",
                    portfolioProjects: [],
                    sesso: "maschio",
                    titoloDiStudio: "laurea",
                    userType: "mentor",
                },
            },            
            {
                id: "mentor2",
                data: {
                    availability: 8,
                    cognome: "Bianchi",
                    competenze: "Data Science",
                    createdAt: "2024-12-22T11:45:10.000Z",
                    cv: "cv_bianchi.pdf",
                    dataNascita: "1990-03-12",
                    email: "bianchi.ds@gmail.com",
                    password: "000000", 
                    field: null,
                    meetingMode: "in-person",
                    nome: "Luigi",
                    occupazione: "Data Scientist",
                    portfolioProjects: ["project1", "project2"],
                    sesso: "maschio",
                    titoloDiStudio: "dottorato",
                    userType: "mentor",
                },
            },
            {
                id: "mentor3",
                data: {
                    availability: 15,
                    cognome: "Verdi",
                    competenze: "Artificial Intelligence",
                    createdAt: "2024-12-10T09:30:20.000Z",
                    cv: "cv_verdi.pdf",
                    dataNascita: "1980-01-25",
                    email: "verdi.ai@gmail.com",
                    password: "000000", 
                    field: null,
                    meetingMode: "hybrid",
                    nome: "Giovanni",
                    occupazione: "AI Engineer",
                    portfolioProjects: ["ai_project1"],
                    sesso: "maschio",
                    titoloDiStudio: "laurea magistrale",
                    userType: "mentor",
                },
            },
            {
                id: "mentor4",
                data: {
                    availability: 12,
                    cognome: "Gialli",
                    competenze: "Cloud Computing",
                    createdAt: "2024-11-05T14:22:55.000Z",
                    cv: "cv_gialli.pdf",
                    dataNascita: "1982-08-19",
                    email: "gialli.cc@gmail.com",
                    password: "000000", 
                    field: null,
                    meetingMode: "online",
                    nome: "Alessandro",
                    occupazione: "Cloud Architect",
                    portfolioProjects: [],
                    sesso: "maschio",
                    titoloDiStudio: "laurea",
                    userType: "mentor",
                },
            },
            {
                id: "mentor5",
                data: {
                    availability: 7,
                    cognome: "Neri",
                    competenze: "Blockchain",
                    createdAt: "2024-12-01T10:15:30.000Z",
                    cv: "cv_neri.pdf",
                    dataNascita: "1995-06-05",
                    email: "neri.bc@gmail.com",
                    password: "000000", 
                    field: null,
                    meetingMode: "online",
                    nome: "Francesco",
                    occupazione: "Blockchain Developer",
                    portfolioProjects: ["blockchain_project1", "blockchain_project2"],
                    sesso: "maschio",
                    titoloDiStudio: "laurea",
                    userType: "mentor",
                },
            }
        ];

        // Mentee
        const mentees = [
            {
                id: "mentee1",
                data: {
                    cognome: "Bruni",
                    competenze: "JavaScript",
                    createdAt: "2024-12-23T19:15:04.053Z",
                    cv: "cv_bruni.pdf",
                    dataNascita: "1998-08-14",
                    email: "bruni.js@gmail.com",
                    password: "000000", 
                    field: "web-development",
                    nome: "Giorgio",
                    occupazione: null,
                    portfolioProjects: [],
                    sesso: "maschio",
                    titoloDiStudio: "laurea triennale",
                    updatedAt: "2024-12-30T11:29:40.433Z",
                    userType: "mentee",
                },
            },
            {
                id: "mentee2",
                data: {
                    cognome: "Luca",
                    competenze: "Python",
                    createdAt: "2024-11-18T14:45:20.000Z",
                    cv: "cv_luca.pdf",
                    dataNascita: "2000-05-20",
                    email: "luca.py@gmail.com",
                    password: "000000", 
                    field: "data-science",
                    nome: "Matteo",
                    occupazione: "Junior Data Analyst",
                    portfolioProjects: ["data_analysis_project1"],
                    sesso: "maschio",
                    titoloDiStudio: "laurea triennale",
                    updatedAt: "2024-12-25T09:20:35.000Z",
                    userType: "mentee",
                },
            },
            {
                id: "mentee3",
                data: {
                    cognome: "Verdi",
                    competenze: "Web Development",
                    createdAt: "2024-10-05T16:00:00.000Z",
                    cv: "cv_verdi.pdf",
                    dataNascita: "1999-03-30",
                    email: "verdi.web@gmail.com",
                    password: "000000", 
                    field: "front-end",
                    nome: "Luca",
                    occupazione: null,
                    portfolioProjects: ["website_project1"],
                    sesso: "maschio",
                    titoloDiStudio: "diploma",
                    updatedAt: "2024-12-15T17:45:20.000Z",
                    userType: "mentee",
                },
            },
            {
                id: "mentee4",
                data: {
                    cognome: "Alti",
                    competenze: "Java",
                    createdAt: "2024-09-22T11:30:15.000Z",
                    cv: "cv_alti.pdf",
                    dataNascita: "1997-11-12",
                    email: "alti.java@gmail.com",
                    password: "000000", 
                    field: "software-engineering",
                    nome: "Marco",
                    occupazione: null,
                    portfolioProjects: [],
                    sesso: "maschio",
                    titoloDiStudio: "laurea magistrale",
                    updatedAt: "2024-12-05T12:40:10.000Z",
                    userType: "mentee",
                },
            },
            {
                id: "mentee5",
                data: {
                    cognome: "Rossi",
                    competenze: "C#",
                    createdAt: "2024-08-18T14:50:35.000Z",
                    cv: "cv_rossi.pdf",
                    dataNascita: "2001-07-09",
                    email: "rossi.cs@gmail.com",
                    password: "000000", 
                    field: "backend-development",
                    nome: "Giovanni",
                    occupazione: "Junior Developer",
                    portfolioProjects: ["backend_project1"],
                    sesso: "maschio",
                    titoloDiStudio: "diploma",
                    updatedAt: "2024-12-10T15:30:45.000Z",
                    userType: "mentee",
                },
            }
        ];

        // Video
        const videos = [
            {
                id: "video1",
                data: {
                    description: "Introduzione al Machine Learning",
                    thumbnail: "https://img.youtube.com/vi/WTt51-5K3L8/0.jpg", // Miniatura del video
                    title: "Machine Learning Basics",
                    videoUrl: "https://www.youtube.com/embed/WTt51-5K3L8?si=VNejAyWw1XD4Jh29",
                },
            },
            {
                id: "video2",
                data: {
                    description: "Introduzione alla Data Science",
                    thumbnail: "https://img.youtube.com/vi/aeXnS26fy7E/0.jpg",
                    title: "Data Science Fundamentals",
                    videoUrl: "https://www.youtube.com/embed/aeXnS26fy7E?si=gSessn85myHNyGAl",
                },
            },
            {
                id: "video3",
                data: {
                    description: "Guida al Cloud Computing",
                    thumbnail: "https://img.youtube.com/vi/da3NOtH3PXM/0.jpg",
                    title: "Cloud Computing Essentials",
                    videoUrl: "https://www.youtube.com/embed/da3NOtH3PXM?si=HvV7sB2Ysc6j5tpq", 
                },
            },
            {
                id: "video4",
                data: {
                    description: "Blockchain e il Futuro della Tecnologia",
                    thumbnail: "https://img.youtube.com/vi/cywucO-jxNw/0.jpg", 
                    title: "Blockchain Overview",
                    videoUrl: "https://www.youtube.com/embed/cywucO-jxNw?si=KhCp7x3waMo5_80K", 
                },
            },
            {
                id: "video5",
                data: {
                    description: "Introduzione allo sviluppo Applicazioni Web Moderne",
                    thumbnail: "https://img.youtube.com/vi/aVnKGkaoOQ8/0.jpg",
                    title: "Web Development Trends",
                    videoUrl: "https://www.youtube.com/embed/aVnKGkaoOQ8?si=urRqltS14KApJaZK",
                },
            },
            {
            id: "video6",
            data: {
                description: "Guida all'intelligenza artificiale per principianti",
                thumbnail: "default-thumbnail-url",
                title: "AI for Beginners",
                videoUrl: "Video6- Intelligenza Artificiale.mp4",
            },
        },
        {
            id: "video7",
            data: {
                description: "Introduzione alla programmazione in Python",
                thumbnail: "default-thumbnail-url",
                title: "Python Programming Basics",
                videoUrl: "Video7- Phyton.mp4",
            },
        },
        {
            id: "video8",
            data: {
                description: "Corso completo su Data Science con Python",
                thumbnail: "default-thumbnail-url",
                title: "Data Science with Python",
                videoUrl: "Video8- DataScience.mp4",
            },
        },
        {
            id: "video9",
            data: {
                description: "Come sviluppare applicazioni con React",
                thumbnail: "default-thumbnail-url",
                title: "React for Developers",
                videoUrl: "Video9- React.mp4",
            },
        },
        {
            id: "video10",
            data: {
                description: "Fondamenti di Cloud Computing con AWS",
                thumbnail: "default-thumbnail-url",
                title: "Cloud Computing Essentials with AWS",
                videoUrl: "Video10- Cloud Computing.mp4",
            },
        }
        ];

        
    
        // Autori
        const authors = [
            {
                id: "author1",
                data: {
                    email: "author1@gmail.com",
                    createdAt: new Date(),
                    filePath: "../Documents/Documents1.pdf",
                    icon: "📄",
                    role: "Researcher",
                    title: "AI and Ethics",
                    type: "PDF",
                },
            },
            {
                id: "author2",
                data: {
                    email: "author2@gmail.com",
                    createdAt: new Date(),
                    filePath: "../Documents/Documents2.pdf",
                    icon: "📄",
                    role: "Engineer",
                    title: "Cloud Architecture",
                    type: "PDF",
                },
            },
            {
                id: "author3",
                data: {
                    email: "author3@gmail.com",
                    createdAt: new Date(),
                    filePath: "../Documents/Documents3.pdf",
                    icon: "📄",
                    role: "Scientist",
                    title: "Blockchain for Future",
                    type: "PDF",
                },
            },
            {
                id: "author4",
                data: {
                    email: "author4@gmail.com",
                    createdAt: new Date(),
                    filePath: "../Documents/Documents4.pdf",
                    icon: "📄",
                    role: "Developer",
                    title: "Web Development Practices",
                    type: "PDF",
                },
            },
            {
                id: "author5",
                data: {
                    email: "author5@gmail.com",
                    createdAt: new Date(),
                    filePath: "../Documents/Documents5.pdf",
                    icon: "📄",
                    role: "Technologist",
                    title: "Understanding AI",
                    type: "PDF",
                },
            },
            {
                id: "author6",
                data: {
                    email: "author6@gmail.com",
                    createdAt: new Date(),
                    filePath: "../Documents/Documents6.pdf",
                    icon: "📄",
                    role: "Software Engineer",
                    title: "Building Scalable Web Apps",
                    type: "PDF",
                },
            },
            {
                id: "author7",
                data: {
                    email: "author7@gmail.com",
                    createdAt: new Date(),
                    filePath: "../Documents/Documents7.pdf",
                    icon: "📄",
                    role: "Data Scientist",
                    title: "Predictive Modeling with Python",
                    type: "PDF",
                },
            },
            {
                id: "author8",
                data: {
                    email: "author8@gmail.com",
                    createdAt: new Date(),
                    filePath: "../Documents/Documents8.pdf",
                    icon: "📄",
                    role: "Cloud Architect",
                    title: "Designing Cloud Systems",
                    type: "PDF",
                },
            },
            {
                id: "author9",
                data: {
                    email: "author9@gmail.com",
                    createdAt: new Date(),
                    filePath: "../Documents/Documents9.pdf",
                    icon: "📄",
                    role: "Blockchain Developer",
                    title: "Blockchain Development",
                    type: "PDF",
                },
            },
            {
                id: "author10",
                data: {
                    email: "author10@gmail.com",
                    createdAt: new Date(),
                    filePath: "../Documents/Documents10.pdf",
                    icon: "📄",
                    role: "AI Specialist",
                    title: "Ethics in Artificial Intelligence",
                    type: "PDF",
                },
            }
        ];

        // Meetings
        const meetings = [
            {
                id: "meeting1",
                data: {
                    date: new Date(),
                    description: "Sessione introduttiva",
                    menteeEmail: "mentee1@gmail.com",
                    menteeId: "mentee1",
                    menteeName: "Giorgio",
                    mentorId: "mentor1",
                    time: "14:00",
                    topic: "Introduzione al Machine Learning",
                },
            },
            {
                id: "meeting2",
                data: {
                    date: new Date(),
                    description: "Analisi dei dati",
                    menteeEmail: "mentee2@gmail.com",
                    menteeId: "mentee2",
                    menteeName: "Matteo",
                    mentorId: "mentor2",
                    time: "10:00",
                    topic: "Data Science Overview",
                },
            },
            {
                id: "meeting3",
                data: {
                    date: new Date(),
                    description: "Progetto Web",
                    menteeEmail: "mentee3@gmail.com",
                    menteeId: "mentee3",
                    menteeName: "Luca",
                    mentorId: "mentor3",
                    time: "16:00",
                    topic: "Web Development Trends",
                },
            },
            {
                id: "meeting4",
                data: {
                    date: new Date(),
                    description: "Discussione Blockchain",
                    menteeEmail: "mentee4@gmail.com",
                    menteeId: "mentee4",
                    menteeName: "Marco",
                    mentorId: "mentor4",
                    time: "09:00",
                    topic: "Blockchain Basics",
                },
            },
            {
                id: "meeting5",
                data: {
                    date: new Date(),
                    description: "Sessione Cloud",
                    menteeEmail: "mentee5@gmail.com",
                    menteeId: "mentee5",
                    menteeName: "Giovanni",
                    mentorId: "mentor5",
                    time: "11:00",
                    topic: "Cloud Computing Fundamentals",
                },
            }
        ];

        // Notifiche
        const notifiche = [
            {
                id: "notifica1",
                data: {
                    corpo: "Hai ricevuto una nuova mentorship!",
                    destinatario: "mentor1",
                    mittente: "mentee1",
                    oggetto: "Nuova Mentorship",
                    timeStamp: new Date(),
                },
            },
            {
                id: "notifica2",
                data: {
                    corpo: "Nuovo messaggio da un mentee!",
                    destinatario: "mentor2",
                    mittente: "mentee2",
                    oggetto: "Nuovo messaggio",
                    timeStamp: new Date(),
                },
            },
            {
                id: "notifica3",
                data: {
                    corpo: "Hai una nuova sessione di mentoring in programma!",
                    destinatario: "mentee3",
                    mittente: "mentor3",
                    oggetto: "Nuovo incontro programmato",
                    timeStamp: new Date(),
                },
            },
            {
                id: "notifica4",
                data: {
                    corpo: "Una sessione di mentoring è stata completata!",
                    destinatario: "mentee4",
                    mittente: "mentor4",
                    oggetto: "Sessione completata",
                    timeStamp: new Date(),
                },
            },
            {
                id: "notifica5",
                data: {
                    corpo: "Nuovo progetto disponibile!",
                    destinatario: "mentee5",
                    mittente: "mentor5",
                    oggetto: "Nuovo progetto",
                    timeStamp: new Date(),
                },
            }
        ];

        // Inserimento dati
        const collections = [
            { name: "utenti", items: [...mentors, ...mentees] },
            { name: "videos", items: videos },
            { name: "documents", items: authors },
            { name: "meetings", items: meetings },
            { name: "notifiche", items: notifiche },
        ];

        for (const collection of collections) {
            for (const item of collection.items) {
                await setDoc(doc(db, collection.name, item.id), item.data);
            }
        }
        uploadVideosToEmulators(videos, "./videos/")
        uploadDocumentsToEmulators(authors, "./Documents/")
        // Segna il database come popolato
        await setDoc(checkDoc, { populated: true, date: new Date() });

        console.log("Database popolato con successo!");
    } catch (error) {
        console.error("Errore durante il popolamento del database:", error);
    }
}

  // Funzione per caricare i video su Firebase Storage Emulator e aggiornare Firestore Emulator
  async function uploadVideosToEmulators(videos, videosBasePath) {
    try {

        for (const video of videos) {
            if (!video.data.videoUrl.includes('https')){
            const localVideoPath = videosBasePath + video.data.videoUrl;
            const storagePath = `videos/${video.data.videoUrl}`;
            const videoUrl = await uploadLocalFileToEmulator(storagePath, localVideoPath);

            if (videoUrl) {
                video.data.videoUrl = videoUrl; // Aggiorna l'URL con quello su Firebase Storage Emulator
                
                // Salva l'aggiornamento su Firestore Emulator
                const videoDocRef = doc(db, "videos", video.id); // Crea un riferimento al documento
                await setDoc(videoDocRef, video.data); // Aggiorna i dati su Firestore Emulator
            }
        }
        }
    } catch (error) {
        console.error("Errore durante il caricamento dei video sugli emulatori:", error);
    }
}

// Funzione per caricare i documenti su Firebase Storage Emulator e aggiornare Firestore Emulator
async function uploadDocumentsToEmulators(authors, documentsBasePath) {
    try {

        for (const author of authors) {
            const localDocPath = documentsBasePath + author.data.filePath;
            const storagePath = `documents/${author.data.filePath}`;
            const fileUrl = await uploadLocalFileToEmulator(storagePath, localDocPath);

            if (fileUrl) {
                author.data.filePath = fileUrl; // Aggiorna l'URL con quello su Firebase Storage Emulator
                
                // Salva l'aggiornamento su Firestore Emulator
                const authorDocRef = doc(db, "authors", author.id); // Crea un riferimento al documento
                await setDoc(authorDocRef, author.data); // Aggiorna i dati su Firestore Emulator
            }
        }
    } catch (error) {
        console.error("Errore durante il caricamento dei documenti sugli emulatori:", error);
    }
}

export default populateDatabase;
