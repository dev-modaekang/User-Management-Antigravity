import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UserFormPage from './pages/UserFormPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/add" element={<UserFormPage />} />
        <Route path="/modify/:id" element={<UserFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
