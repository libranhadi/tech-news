import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// import Login from './pages/Login';
import './index.css';
import InfoPage from './pages/InfoPages';
import ItemDetail from './pages/ItemDetail';

function AppContent() {
  const location = useLocation();
  const hideNavbarOnRoutes = ['/welcome']; 
  const showNavbar = !hideNavbarOnRoutes.includes(location.pathname);

  return (
    <div className="m-10 bg-gray-50">
      {showNavbar && <Navbar />}
      <main className="container py-4 px-4 sm:px-6 lg:px-8 bg-[#f6f6ef]">
        <Routes>
          <Route path="/" element={<Home key="top" type="topstories" />} />
          <Route path="/newest" element={<Home key="new" type="newstories" />} />
          <Route path="/best" element={<Home key="best" type="beststories" />} />
          <Route path="/ask" element={<Home key="ask" type="askstories" />} />
          <Route path="/show" element={<Home key="show" type="showstories" />} />
          <Route path="/jobs" element={<Home key="jobs" type="jobstories" />} />
          <Route path="/:infoType" element={<InfoPage />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          {/* <Route path="/login" element={<Login />} /> */}
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
  );
}

export default App;
