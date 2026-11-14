import { useState, useEffect } from 'react';
import {
  getAllDepartments, createDepartment, updateDepartment, deleteDepartment,
} from '../api/api';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const EMPTY = { idDepartment: null, name: '', location: '', phone: '', head: '' };

const DEPT_COLORS = ['#6366f1','#06b6d4','#f59e0b','#10b981','#ef4444','#8b5cf6'];
const DEPT_ICONS  = ['🏛️','🔬','💻','📐','📚','🎨','⚗️','🌍'];

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [modal, setModal]             = useState(null);
  const [current, setCurrent]         = useState(EMPTY);
  const [saving, setSaving]           = useState(false);
  const { toasts, add, remove }       = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllDepartments();
      setDepartments(res.data ?? []);
    } catch {
      add('Failed to load departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = departments.filter(d =>
    `${d.name} ${d.location} ${d.head}`.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setCurrent(EMPTY); setModal('create'); };
  const openEdit   = (d)  => { setCurrent({ ...d }); setModal('edit'); };
  const openDelete = (d)  => { setCurrent(d); setModal('delete'); };
  const closeModal = ()   => { setModal(null); setCurrent(EMPTY); };

  const handleSave = async () => {
    if (!current.name) { add('Department name is required', 'error'); return; }
    setSaving(true);
    try {
      if (modal === 'create') {
        await createDepartment(current);
        add('Department created successfully', 'success');
      } else {
        await updateDepartment(current);
        add('Department updated successfully', 'success');
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
      await deleteDepartment(current.idDepartment);
      add('Department deleted', 'success');
      await load();
      closeModal();
    } catch {
      add('Failed to delete department', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1>🏛️ Departments</h1>
          <p>{departments.length} departments registered</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>＋ Add Department</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            placeholder="Search by name, location or head…"
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
            <span>Loading departments…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏛️</div>
            <h3>No departments found</h3>
            <p>{search ? 'Try a different search term' : 'Click "Add Department" to get started'}</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Head</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={d.idDepartment}>
                    <td>
                      <div className="avatar-cell">
                        <div
                          className="avatar"
                          style={{ background: DEPT_COLORS[i % DEPT_COLORS.length], borderRadius: 10, fontSize: '1rem' }}
                        >
                          {DEPT_ICONS[i % DEPT_ICONS.length]}
                        </div>
                        <div className="avatar-info">
                          <div className="name">{d.name}</div>
                          <div className="sub">ID #{d.idDepartment}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {d.head ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                          <span style={{ color: 'var(--accent)' }}>👨‍💼</span>
                          {d.head}
                        </div>
                      ) : '—'}
                    </td>
                    <td>
                      {d.location ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                          <span>📍</span> {d.location}
                        </div>
                      ) : '—'}
                    </td>
                    <td>{d.phone || '—'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => openDelete(d)}>🗑️ Delete</button>
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
                <div className="modal-icon" style={{ background: '#cffafe' }}>🏛️</div>
                <h2>{modal === 'create' ? 'Add New Department' : 'Edit Department'}</h2>
              </div>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full">
                  <label>🏛️ Department Name *</label>
                  <input value={current.name} onChange={e => setCurrent(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Computer Science" />
                </div>
                <div className="form-group">
                  <label>👨‍💼 Head / Director</label>
                  <input value={current.head} onChange={e => setCurrent(p => ({ ...p, head: e.target.value }))} placeholder="Dr. John Smith" />
                </div>
                <div className="form-group">
                  <label>📞 Phone</label>
                  <input value={current.phone} onChange={e => setCurrent(p => ({ ...p, phone: e.target.value }))} placeholder="+216 XX XXX XXX" />
                </div>
                <div className="form-group full">
                  <label>📍 Location</label>
                  <input value={current.location} onChange={e => setCurrent(p => ({ ...p, location: e.target.value }))} placeholder="Building A, Floor 2" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? '…' : modal === 'create' ? '＋ Create Department' : '💾 Save Changes'}
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
                <h2>Delete Department</h2>
              </div>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)' }}>
                Are you sure you want to delete <strong>{current.name}</strong>?
                This may affect students assigned to this department.
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
