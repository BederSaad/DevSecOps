import { NavLink, useLocation } from 'react-router-dom';

const NAV = [
  { label: 'Overview',    icon: '🏠', to: '/' },
  { section: 'Management' },
  { label: 'Students',    icon: '🎓', to: '/students',    badge: null },
  { label: 'Departments', icon: '🏛️', to: '/departments', badge: null },
  { label: 'Enrollments', icon: '📋', to: '/enrollments', badge: null },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">🎓</div>
        <h1>EduManage</h1>
        <p>Student Management System</p>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item, i) => {
          if (item.section) {
            return (
              <div key={i} className="sidebar-section-title">{item.section}</div>
            );
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.badge != null && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <div className="status-dot" />
          <span>API: localhost:8089</span>
        </div>
      </div>
    </aside>
  );
}
