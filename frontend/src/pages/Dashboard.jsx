import { useState, useEffect } from 'react';
import { getAllStudents, getAllDepartments, getAllEnrollments } from '../api/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [counts, setCounts] = useState({ students: 0, departments: 0, enrollments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllStudents().catch(() => ({ data: [] })),
      getAllDepartments().catch(() => ({ data: [] })),
      getAllEnrollments().catch(() => ({ data: [] })),
    ]).then(([s, d, e]) => {
      setCounts({
        students: s.data?.length ?? 0,
        departments: d.data?.length ?? 0,
        enrollments: e.data?.length ?? 0,
        active: e.data?.filter(x => x.status === 'ACTIVE').length ?? 0,
      });
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: 'Total Students',    value: counts.students,    icon: '🎓', color: 'purple' },
    { label: 'Departments',       value: counts.departments, icon: '🏛️', color: 'cyan'   },
    { label: 'Total Enrollments', value: counts.enrollments, icon: '📋', color: 'amber'  },
    { label: 'Active Enrollments',value: counts.active ?? 0, icon: '✅', color: 'green'  },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value">
                {loading ? <span className="spinner" style={{width:24,height:24,display:'inline-block'}} /> : s.value}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Quick Access
        </h3>
      </div>
      <div className="quick-actions">
        {[
          { to: '/students',    icon: '🎓', title: 'Students',    desc: 'View & manage students'    },
          { to: '/departments', icon: '🏛️', title: 'Departments', desc: 'View & manage departments' },
          { to: '/enrollments', icon: '📋', title: 'Enrollments', desc: 'View & manage enrollments' },
        ].map(c => (
          <Link key={c.to} to={c.to} className="quick-card">
            <div className="qc-icon">{c.icon}</div>
            <h4>{c.title}</h4>
            <p>{c.desc}</p>
          </Link>
        ))}
      </div>

      {/* API Info */}
      <div className="table-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          🔌 API Endpoints Reference
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem' }}>
          {[
            { label: 'Students Base',    url: 'GET  /students/getAllStudents'        },
            { label: 'Create Student',   url: 'POST /students/createStudent'        },
            { label: 'Departments Base', url: 'GET  /Depatment/getAllDepartment'     },
            { label: 'Create Dept',      url: 'POST /Depatment/createDepartment'    },
            { label: 'Enrollments Base', url: 'GET  /Enrollment/getAllEnrollment'   },
            { label: 'Create Enroll',    url: 'POST /Enrollment/createEnrollment'   },
          ].map(e => (
            <div key={e.url} style={{
              background: 'var(--surface-2)', borderRadius: 8,
              padding: '.75rem 1rem', border: '1px solid var(--border)'
            }}>
              <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginBottom: '.2rem' }}>{e.label}</div>
              <code style={{ fontSize: '.78rem', color: 'var(--primary)', fontFamily: 'monospace' }}>{e.url}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
