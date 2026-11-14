import { useState, useEffect } from 'react';
import {
  getAllEnrollments, createEnrollment, updateEnrollment, deleteEnrollment,
  getAllStudents, getAllDepartments,
} from '../api/api';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const STATUSES = ['ACTIVE', 'COMPLETED', 'DROPPED', 'FAILED', 'WITHDRAWN'];

const BADGE_MAP = {
  ACTIVE:    'badge-active',
  COMPLETED: 'badge-completed',
  DROPPED:   'badge-dropped',
  FAILED:    'badge-failed',
  WITHDRAWN: 'badge-withdrawn',
};

const STATUS_ICON = {
  ACTIVE: '🟢', COMPLETED: '🔵', DROPPED: '🟡', FAILED: '🔴', WITHDRAWN: '⚪',
};

const EMPTY = {
  idEnrollment: null,
  enrollmentDate: '',
  grade: '',
  status: 'ACTIVE',
  studentId: '',
  courseId: '',
};

function gradeClass(g) {
  if (g === null || g === undefined || g === '') return '';
  const n = Number(g);
  if (n >= 16) return 'a';
  if (n >= 13) return 'b';
  if (n >= 10) return 'c';
  if (n >= 7)  return 'd';
  return 'f';
}

function gradeLabel(g) {
  if (g === null || g === undefined || g === '') return '—';
  const n = Number(g);
  if (n >= 16) return 'A';
  if (n >= 13) return 'B';
  if (n >= 10) return 'C';
  if (n >= 7)  return 'D';
  return 'F';
}

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal]             = useState(null);
  const [current, setCurrent]         = useState(EMPTY);
  const [saving, setSaving]           = useState(false);
  const { toasts, add, remove }       = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [eRes, sRes] = await Promise.all([getAllEnrollments(), getAllStudents()]);
      setEnrollments(eRes.data ?? []);
      setStudents(sRes.data ?? []);
    } catch {
      add('Failed to load enrollments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const studentName = (e) => {
    const s = e.student;
    if (!s) return '—';
    return `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() || `#${s.idStudent}`;
  };

  const courseName = (e) => {
    const c = e.course;
    if (!c) return '—';
    return c.name ?? `Course #${c.idCourse}`;
  };

  const filtered = enrollments.filter(e => {
    const matchSearch = `${studentName(e)} ${courseName(e)}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreate = () => { setCurrent(EMPTY); setModal('create'); };
  const openEdit   = (e)  => {
    setCurrent({
      idEnrollment:  e.idEnrollment,
      enrollmentDate: e.enrollmentDate ?? '',
      grade:         e.grade ?? '',
      status:        e.status ?? 'ACTIVE',
      studentId:     e.student?.idStudent ?? '',
      courseId:      e.course?.idCourse   ?? '',
    });
    setModal('edit');
  };
  const openDelete = (e)  => { setCurrent(e); setModal('delete'); };
  const closeModal = ()   => { setModal(null); setCurrent(EMPTY); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...current,
        grade:     current.grade !== '' ? Number(current.grade) : null,
        studentId: current.studentId ? Number(current.studentId) : null,
        courseId:  current.courseId  ? Number(current.courseId)  : null,
      };
      if (modal === 'create') {
        await createEnrollment(payload);
        add('Enrollment created successfully', 'success');
      } else {
        await updateEnrollment(payload);
        add('Enrollment updated successfully', 'success');
      }
      await load();
      closeModal();
    } catch {
      add('Operation failed. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteEnrollment(current.idEnrollment);
      add('Enrollment deleted', 'success');
      await load();
      closeModal();
    } catch {
      add('Failed to delete enrollment', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>📋 Enrollments</h1>
          <p>{enrollments.length} enrollments total</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>＋ Add Enrollment</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search by student or course…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            padding: '.55rem .9rem', border: '1px solid var(--border)',
            borderRadius: 8, fontSize: '.85rem', background: '#fff',
            color: 'var(--text-primary)', cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn btn-secondary" onClick={load}>↻ Refresh</button>
      </div>

      {/* Status summary chips */}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {STATUSES.map(s => {
          const count = enrollments.filter(e => e.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.3rem',
                padding: '.3rem .8rem', borderRadius: 20, border: 'none',
                cursor: 'pointer', fontSize: '.75rem', fontWeight: 600,
                background: statusFilter === s ? 'var(--primary)' : 'var(--surface)',
                color: statusFilter === s ? '#fff' : 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'var(--transition)',
              }}
            >
              {STATUS_ICON[s]} {s} <span style={{ opacity: .7 }}>({count})</span>
            </button>
          );
        })}
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading enrollments…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No enrollments found</h3>
            <p>{search || statusFilter ? 'Try different filters' : 'Click "Add Enrollment" to get started'}</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Enrollment Date</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.idEnrollment}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '.8rem', color: 'var(--text-muted)' }}>
                        #{e.idEnrollment}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        <span>🧑‍🎓</span>
                        <span style={{ fontWeight: 600 }}>{studentName(e)}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                        <span>📚</span>
                        {courseName(e)}
                      </div>
                    </td>
                    <td>
                      {e.enrollmentDate
                        ? new Date(e.enrollmentDate).toLocaleDateString('en-GB')
                        : '—'}
                    </td>
                    <td>
                      {e.grade !== null && e.grade !== undefined ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                          <div className={`grade-pill ${gradeClass(e.grade)}`}>
                            {gradeLabel(e.grade)}
                          </div>
                          <span style={{ fontSize: '.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            {e.grade}/20
                          </span>
                        </div>
                      ) : '—'}
                    </td>
                    <td>
                      <span className={`badge ${BADGE_MAP[e.status] ?? ''}`}>
                        {STATUS_ICON[e.status]} {e.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(e)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => openDelete(e)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title-row">
                <div className="modal-icon" style={{ background: '#fef3c7' }}>📋</div>
                <h2>{modal === 'create' ? 'Add New Enrollment' : 'Edit Enrollment'}</h2>
              </div>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>🧑‍🎓 Student ID</label>
                  <select value={current.studentId} onChange={e => setCurrent(p => ({ ...p, studentId: e.target.value }))}>
                    <option value="">— Select Student —</option>
                    {students.map(s => (
                      <option key={s.idStudent} value={s.idStudent}>
                        {s.firstName} {s.lastName} (#{s.idStudent})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>📚 Course ID</label>
                  <input
                    type="number"
                    min="1"
                    value={current.courseId}
                    onChange={e => setCurrent(p => ({ ...p, courseId: e.target.value }))}
                    placeholder="Enter course ID"
                  />
                </div>
                <div className="form-group">
                  <label>📅 Enrollment Date</label>
                  <input type="date" value={current.enrollmentDate} onChange={e => setCurrent(p => ({ ...p, enrollmentDate: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>⭐ Grade (0–20)</label>
                  <input
                    type="number" min="0" max="20" step="0.5"
                    value={current.grade}
                    onChange={e => setCurrent(p => ({ ...p, grade: e.target.value }))}
                    placeholder="e.g. 14.5"
                  />
                </div>
                <div className="form-group full">
                  <label>🏷️ Status</label>
                  <select value={current.status} onChange={e => setCurrent(p => ({ ...p, status: e.target.value }))}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_ICON[s]} {s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? '…' : modal === 'create' ? '＋ Create Enrollment' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {modal === 'delete' && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <div className="modal-title-row">
                <div className="modal-icon" style={{ background: '#fee2e2' }}>⚠️</div>
                <h2>Delete Enrollment</h2>
              </div>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)' }}>
                Are you sure you want to delete enrollment <strong>#{current.idEnrollment}</strong>?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? '…' : '🗑️ Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} remove={remove} />
    </>
  );
}
