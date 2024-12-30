import app from './firebase/firebase';
import RegistrationPage from './components/pages/RegistrationPage';
import Home from './components/pages/Homepage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import { MentorSearchForm } from './components/pages/mentor-search-form';
import FileHomePage from './components/pages/FileHomePage';
import FileAddDocument from './components/pages/fileAddDocument';
import HomePageMentee from './components/pages/HomePageMentee'
import HomePageMentore from './components/pages/HomePageMentore'
import MentorProfileForm from './components/pages/ModifyProfile';
import DettagliUtenteWrapper from './components/pages/DettaglioUtente';
import MeetingScheduler from './components/pages/MeetingScheduler';
import CalendarioIncontri from './components/pages/CalendarioIncontri';
import MeetingSummary from './components/pages/meeting-summary';
import Menteestatistics from './components/pages/mentee-statistics';
import CalendarioIncontriMentee from './components/pages/CalendarioIncontriMentee';
function App() {
  const db = app;
  console.log(db);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegistrationPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/profile" element={<MentorProfileForm/>}/>
        <Route path="/mentorsearch" element={<MentorSearchForm />} />
        <Route path="/contents" element={<FileHomePage />} />
        <Route path="/addfile" element={<FileAddDocument />} />
        <Route path="/HomePageMentee" element={<HomePageMentee />} />
        <Route path="/HomePageMentore" element={<HomePageMentore />} />
        <Route path="/dettagli/:userId" element={<DettagliUtenteWrapper/>} />
        <Route path = "/MeetingScheduler" element={<MeetingScheduler/>}/>
        <Route path = "/Calendar" element={<CalendarioIncontri/>}/>
        <Route path = "/MeetingSummary/:meetingid" element={<MeetingSummary/>}/>
        <Route path = "/Menteestatistics" element={<Menteestatistics/>}/>
        <Route path = "/CalendarMentee" element={<CalendarioIncontriMentee/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
