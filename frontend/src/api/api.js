import axios from 'axios';

// In production, when served behind the same reverse proxy / Cloudflare Tunnel,
// we use relative path '/student' so it automatically routes through the same domain and HTTPS!
const BASE_URL = import.meta.env.VITE_API_URL || '/student';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Students ───────────────────────────────────────────────────────────────
export const getAllStudents    = ()        => api.get('/students/getAllStudents');
export const getStudentById   = (id)      => api.get(`/students/getStudent/${id}`);
export const createStudent    = (data)    => api.post('/students/createStudent', data);
export const updateStudent    = (data)    => api.put('/students/updateStudent', data);
export const deleteStudent    = (id)      => api.delete(`/students/deleteStudent/${id}`);

// ─── Departments ─────────────────────────────────────────────────────────────
export const getAllDepartments  = ()       => api.get('/Depatment/getAllDepartment');
export const getDepartmentById = (id)     => api.get(`/Depatment/getDepartment/${id}`);
export const createDepartment  = (data)   => api.post('/Depatment/createDepartment', data);
export const updateDepartment  = (data)   => api.put('/Depatment/updateDepartment', data);
export const deleteDepartment  = (id)     => api.delete(`/Depatment/deleteDepartment/${id}`);

// ─── Enrollments ─────────────────────────────────────────────────────────────
export const getAllEnrollments  = ()       => api.get('/Enrollment/getAllEnrollment');
export const getEnrollmentById = (id)     => api.get(`/Enrollment/getEnrollment/${id}`);
export const createEnrollment  = (data)   => api.post('/Enrollment/createEnrollment', data);
export const updateEnrollment  = (data)   => api.put('/Enrollment/updateEnrollment', data);
export const deleteEnrollment  = (id)     => api.delete(`/Enrollment/deleteEnrollment/${id}`);
