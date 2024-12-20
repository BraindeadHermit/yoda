
import app from './firebase/firebase'
//import LoginPage from './components/pages/LoginPage'
import RegistrationPage from './components/pages/RegistrationPage';
import ModifyProfile from './components/pages/modifyProfile';
import Home from './components/pages/Homepage'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';

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
      </Routes>
    </BrowserRouter>


    
  )
}

export default App
