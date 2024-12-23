import app from './firebase/firebase';
import RegistrationPage from './components/pages/RegistrationPage';
import Home from './components/pages/Homepage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import { MentorSearchForm } from './components/pages/mentor-search-form';
import FileHomePage from './components/pages/FileHomePage';
import FileAddDocument from './components/pages/fileAddDocument';
import ModifyProfile from './components/pages/ModifyProfile';
import HomePageMentee from './components/pages/HomePageMentee'
import HomePageMentore from './components/pages/HomePageMentore'
import InserireVideo from './components/pages/InserireVideo';
import Video from './components/pages/Video';  // Componente per la lista dei video
import DettaglioVideo from './components/pages/DettaglioVideo';

import MentorProfileForm from './components/pages/ModifyProfile';
import DettagliUtenteWrapper from './components/pages/DettaglioUtente';
import MatchingResultPage from './components/pages/MatchingResultPage';


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
        <Route path="/InserireVideo" element={<InserireVideo />} />
        <Route path="/videos" element={<Video />} />
        <Route path="/video/:id" element={<DettaglioVideo />} />
        <Route path="/matchingpage" element={<MatchingResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
