import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import DashboardPage from './pages/DashboardPage';
import PodcastDetailsPage from './pages/PodcastDetailsPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/processing" element={<ProcessingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/podcast/:id" element={<PodcastDetailsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
