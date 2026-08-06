import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import MakeQuiz from './pages/MakeQuiz';
import TakeQuiz from './pages/TakeQuiz';

function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <div className="page-transition" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/makequiz" element={<MakeQuiz />} />
          <Route path="/takequiz" element={<TakeQuiz />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
