import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { loadPersistedState } from "./store/scanSlice";
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

// Initialize desktop storage
store.dispatch(loadPersistedState());

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/landing" element={<Index />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="scan" element={<Scan />} />
            <Route path="threats" element={<Threats />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="scan/:id" element={<ScanDetail />} />
            <Route path="threat/:id" element={<ThreatDetail />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
