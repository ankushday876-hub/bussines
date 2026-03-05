import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { BottomNav } from './components/BottomNav';
import CalculatorPage from './pages/Calculator';
import HistoryPage from './pages/History';
import AdminPage from './pages/Admin';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 max-w-md mx-auto shadow-2xl relative overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-hide">
            <Routes>
              <Route path="/" element={<CalculatorPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </Router>
    </AppProvider>
  );
}
