import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import LandingPage from './pages/LandingPage';
import DigitalManipulationRiskAnalysis from './pages/DigitalManipulationRiskAnalysis';
import EvidenceLocker from './pages/EvidenceLocker';
import ThreatDashboard from './pages/ThreatDashboard';
import SpreadTracker from './pages/SpreadTracker';
import ResponseToolkit from './pages/ResponseToolkit';
import EmergencySupport from './pages/EmergencySupport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="analyzer" element={<DigitalManipulationRiskAnalysis />} />
          <Route path="evidence" element={<EvidenceLocker />} />
          <Route path="dashboard" element={<ThreatDashboard />} />
          <Route path="spread-tracker" element={<SpreadTracker />} />
          <Route path="response" element={<ResponseToolkit />} />
          <Route path="support" element={<EmergencySupport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
