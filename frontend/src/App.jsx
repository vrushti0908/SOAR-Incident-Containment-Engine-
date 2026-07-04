import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import ThreatIntelPage from "./pages/ThreatIntelPage";
import AlertsPage from "./pages/AlertsPage";
import CasesPage from "./pages/CasesPage";
import TimelinePage from "./pages/TimelinePage";
import PlaybooksPage from "./pages/PlaybooksPage";
import FirewallRulesPage from "./pages/FirewallRulesPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage from "./pages/UsersPage";
import RolesPage from "./pages/RolesPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import ActionsPage from "./pages/ActionsPage";
import SchedulesPage from "./pages/SchedulesPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/playbooks" element={<PlaybooksPage />} />
          <Route path="/threat-intel" element={<ThreatIntelPage />} />
          <Route path="/firewall-rules" element={<FirewallRulesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/actions" element={<ActionsPage />} />
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;