import { useState, useEffect } from 'react';
import {
  getAllStudents, createStudent, updateStudent, deleteStudent,
  getAllDepartments,
} from '../api/api';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const EMPTY = {
  idStudent: null, firstName: '', lastName: '', email: '',
  phone: '', dateOfBirth: '', address: '', departmentId: '',
};

const AVATAR_COLORS = [
  '#6366f1','#06b6d4','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#f97316',
];

function initials(f, l) {
  return `${f?.[0] ?? ''}${l?.[0] ?? ''}`.toUpperCase();
}

function avatarColor(id) {
  return AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length];
}

export default function Students() {
  const [students, setStudents]       = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [modal, setModal]             = useState(null); // null | 'create' | 'edit' | 'delete'
  const [current, setCurrent]         = useState(EMPTY);
  const [saving, setSaving]           = useState(false);
  const { toasts, add, remove }       = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [sRes, dRes] = await Promise.all([getAllStudents(), getAllDepartments()]);
      setStudents(sRes.data ?? []);
      setDepartments(dRes.data ?? []);
    } catch {
      add('Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setCurrent(EMPTY); setModal('create'); };
  const openEdit   = (s)  => {
    setCurrent({
      idStudent: s.idStudent,
      firstName: s.firstName ?? '',
      lastName:  s.lastName  ?? '',
      email:     s.email     ?? '',
      phone:     s.phone     ?? '',
      dateOfBirth: s.dateOfBirth ?? '',
      address:   s.address   ?? '',
      departmentId: s.department?.idDepartment ?? '',
    });
    setModal('edit');
  };
  const openDelete = (s) => { setCurrent(s); setModal('delete'); };
  const closeModal = ()  => { setModal(null); setCurrent(EMPTY); };

  const handleSave = async () => {
    if (!current.firstName || !current.lastName) {
      add('First name and last name are required', 'error'); return;
    }
    setSaving(true);
    try {
      const payload = {
        ...current,
        departmentId: current.departmentId ? Number(current.departmentId) : null,
      };
      if (modal === 'create') {
        await createStudent(payload);
        add('Student created successfully', 'success');
      } else {
        await updateStudent(payload);
        add('Student updated successfully', 'success');
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
      await deleteStudent(current.idStudent);
      add('Student deleted', 'success');
      await load();
      closeModal();
    } catch {
      add('Failed to delete student', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deptName = (s) =>
    s.department?.name ?? departments.find(d => d.idDepartment === s.department?.idDepartment)?.name ?? '—';

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>🎓 Students</h1>
          <p>{students.length} students registered</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          ＋ Add Student
        </button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" onClick={load}>↻ Refresh</button>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <span>Loading students…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>No students found</h3>
            <p>{search ? 'Try a different search term' : 'Click "Add Student" to get started'}</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date of Birth</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.idStudent}>
                    <td>
                      <div className="avatar-cell">
                        <div
                          className="avatar"
                          style={{ background: avatarColor(s.idStudent) }}
                        >
                          {initials(s.firstName, s.lastName)}
                        </div>
                        <div className="avatar-info">
                          <div className="name">{s.firstName} {s.lastName}</div>
                          <div className="sub">ID #{s.idStudent}</div>
                        </div>
                      </div>
                    </td>
                    <td>{s.email || '—'}</td>
                    <td>{s.phone || '—'}</td>
                    <td>{s.dateOfBirth || '—'}</td>
                    <td>
                      {s.department ? (
                        <span className="badge badge-active">{s.department.name}</span>
                      ) : '—'}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => openDelete(s)}>🗑️ Delete</button>
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
                <div className="modal-icon" style={{ background: '#e0e7ff' }}>🎓</div>
                <h2>{modal === 'create' ? 'Add New Student' : 'Edit Student'}</h2>
              </div>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>👤 First Name *</label>
                  <input value={current.firstName} onChange={e => setCurrent(p => ({ ...p, firstName: e.target.value }))} placeholder="John" />
                </div>
                <div className="form-group">
                  <label>👤 Last Name *</label>
                  <input value={current.lastName} onChange={e => setCurrent(p => ({ ...p, lastName: e.target.value }))} placeholder="Doe" />
                </div>
                <div className="form-group">
                  <label>📧 Email</label>
                  <input type="email" value={current.email} onChange={e => setCurrent(p => ({ ...p, email: e.target.value }))} placeholder="john.doe@esprit.tn" />
                </div>
                <div className="form-group">
                  <label>📞 Phone</label>
                  <input value={current.phone} onChange={e => setCurrent(p => ({ ...p, phone: e.target.value }))} placeholder="+216 XX XXX XXX" />
                </div>
                <div className="form-group">
                  <label>🎂 Date of Birth</label>
                  <input type="date" value={current.dateOfBirth} onChange={e => setCurrent(p => ({ ...p, dateOfBirth: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>🏛️ Department</label>
                  <select value={current.departmentId} onChange={e => setCurrent(p => ({ ...p, departmentId: e.target.value }))}>
                    <option value="">— None —</option>
                    {departments.map(d => (
                      <option key={d.idDepartment} value={d.idDepartment}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full">
                  <label>📍 Address</label>
                  <textarea value={current.address} onChange={e => setCurrent(p => ({ ...p, address: e.target.value }))} placeholder="Enter address…" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? '…' : modal === 'create' ? '＋ Create Student' : '💾 Save Changes'}
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
                <h2>Delete Student</h2>
              </div>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)' }}>
                Are you sure you want to delete <strong>{current.firstName} {current.lastName}</strong>?
                This action cannot be undone.
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
