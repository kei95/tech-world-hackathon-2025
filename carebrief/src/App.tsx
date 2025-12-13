import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PatientDetail from './pages/PatientDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/:userId" element={<PatientDetail />} />
        {/* Future routes */}
        {/* <Route path="/admin/patients" element={<Patients />} /> */}
        {/* <Route path="/admin/patients/:id" element={<PatientDetail />} /> */}
        {/* <Route path="/admin/settings" element={<Settings />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
