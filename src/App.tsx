import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Scan from "./pages/Scan";
import Threats from "./pages/Threats";
import History from "./pages/History";
import Settings from "./pages/Settings";
import ScanDetail from "./pages/ScanDetail";
import ThreatDetail from "./pages/ThreatDetail";
import DashboardLayout from "./layout/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Index />} /> */}

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/threats" element={<Threats />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/scan/:id" element={<ScanDetail />} />
          <Route path="/threat/:id" element={<ThreatDetail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
