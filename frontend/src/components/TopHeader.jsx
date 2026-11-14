import { useLocation } from 'react-router-dom';

const TITLES = {
  '/':            { title: 'Dashboard',        sub: 'Welcome back — here\'s an overview' },
  '/students':    { title: 'Students',          sub: 'Manage student records'              },
  '/departments': { title: 'Departments',       sub: 'Manage department information'       },
  '/enrollments': { title: 'Enrollments',       sub: 'Manage course enrollments'           },
};

export default function TopHeader() {
  const { pathname } = useLocation();
  const info = TITLES[pathname] ?? { title: 'EduManage', sub: '' };

  return (
    <header className="top-header">
      <div className="header-left">
        <h2>{info.title}</h2>
        <p>{info.sub}</p>
      </div>
      <div className="header-right">
        <div className="header-pill">
          <span>🟢</span> Spring Boot 4 · Port 8089
        </div>
      </div>
    </header>
  );
}
