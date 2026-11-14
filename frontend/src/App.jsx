import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar    from './components/Sidebar';
import TopHeader  from './components/TopHeader';
import Dashboard  from './pages/Dashboard';
import Students   from './pages/Students';
import Departments from './pages/Departments';
import Enrollments from './pages/Enrollments';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <TopHeader />
          <main className="page-body">
            <Routes>
              <Route path="/"            element={<Dashboard />}  />
              <Route path="/students"    element={<Students />}   />
              <Route path="/departments" element={<Departments />} />
              <Route path="/enrollments" element={<Enrollments />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
