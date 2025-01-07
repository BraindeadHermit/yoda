import app from './firebase/firebase';
import RegistrationPage from './components/pages/RegistrationPage';
import Home from './components/pages/Homepage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import { MentorSearchForm } from './components/pages/mentor-search-form';
import FileHomePage from './components/pages/FileHomePage';
import FileAddDocument from './components/pages/fileAddDocument';
import InserireVideo from './components/pages/InserireVideo';
import Video from './components/pages/Video';  // Componente per la lista dei video
import DettaglioVideo from './components/pages/DettaglioVideo';
import HomePageUtente from './components/pages/HomePageUtente'
import ModificaProfilo from './components/pages/ModificaProfilo';
import { DettagliUtenteWrapper } from './components/pages/DettaglioUtente';
import { AuthProvider } from './auth/auth-context';
import PrivateRoutes from './PrivateRoutes';
import DettaglioProfilo from './components/pages/DettaglioProfilo';
import MatchingResultPage from './components/pages/MatchingResultPage';
import MeetingScheduler from './components/pages/MeetingScheduler';
import CalendarioIncontri from './components/pages/CalendarioIncontri';
import MeetingSummary from './components/pages/meeting-summary';
import MeetingSummaryMentee from './components/pages/meeting-summaryformentee';
import Menteestatistics from './components/pages/mentee-statistics';
import CalendarioIncontriMentee from './components/pages/CalendarioIncontriMentee';
import NotificationsPage from "@/components/pages/Notifica";
import MentorshipPage from './components/pages/MentorshipPage';

function App() {
  const db = app;
  console.log(db);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes roles={[]} />}>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<PrivateRoutes roles={["mentor", "mentee"]} />}>
            <Route path="/personal-area" element={<MentorshipPage />} />
            <Route path="/dettagli/:userId" element={<DettagliUtenteWrapper />} />
            <Route path="/HomePageUtente" element={<HomePageUtente />} />
            <Route path="/profile" element={<DettaglioProfilo />} />
            <Route path="/edit-profile" element={<ModificaProfilo />} />
            <Route path="/mentorsearch" element={<MentorSearchForm />} />
            <Route path="/contents" element={<FileHomePage />} />
            <Route path="/videos" element={<Video />} />
            <Route path="/video/:id" element={<DettaglioVideo />} />
            <Route path="/matchingpage" element={<MatchingResultPage />} />
            <Route path="/CalendarMentee" element={<CalendarioIncontriMentee />} />
            <Route path="/Menteestatistics" element={<Menteestatistics />} />
            <Route path="/MeetingSummaryMentee/:meetingid" element={<MeetingSummaryMentee />} />
            <Route path="/notifiche" element={<NotificationsPage />} />
          </Route>
          <Route element={<PrivateRoutes roles={["mentor"]} />}>
            <Route path="/addfile" element={<FileAddDocument />} />
            <Route path="/InserireVideo" element={<InserireVideo />} />
            <Route path="/MeetingScheduler" element={<MeetingScheduler />} />
            <Route path="/Calendar" element={<CalendarioIncontri />} />
            <Route path="/MeetingSummary/:meetingid" element={<MeetingSummary />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
