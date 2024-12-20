import app from './firebase/firebase';
import RegistrationPage from './components/pages/RegistrationPage';
import Home from './components/pages/Homepage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import { MentorSearchForm } from './components/pages/mentor-search-form';
import FileHomePage from './components/pages/FileHomePage';
import FileAddDocument from './components/pages/fileAddDocument';
import ModifyProfile from './components/pages/ModifyProfile';


function App() {
  const db = app;
  console.log(db);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegistrationPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/profile" element={<ModifyProfile/>}/>
        <Route path="/mentorsearch" element={<MentorSearchForm />} />
        <Route path="/filepage" element={<FileHomePage />} />
        <Route path="/addfile" element={<FileAddDocument />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
