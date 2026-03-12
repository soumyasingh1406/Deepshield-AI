import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import LandingPage from './pages/LandingPage';
import DigitalManipulationRiskAnalysis from './pages/DigitalManipulationRiskAnalysis';
import EvidenceLocker from './pages/EvidenceLocker';
import ThreatDashboard from './pages/ThreatDashboard';
import ResponseToolkit from './pages/ResponseToolkit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="analyzer" element={<DigitalManipulationRiskAnalysis />} />
          <Route path="locker" element={<EvidenceLocker />} />
          <Route path="dashboard" element={<ThreatDashboard />} />
          <Route path="response" element={<ResponseToolkit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
