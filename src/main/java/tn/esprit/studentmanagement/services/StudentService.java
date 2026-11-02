package tn.esprit.studentmanagement.services;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.studentmanagement.entities.Student;
import tn.esprit.studentmanagement.repositories.StudentRepository;

import java.util.List;

@Service
public class StudentService implements IStudentService {
    @Autowired
    private StudentRepository studentRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public List<Student> getAllStudents() { return studentRepository.findAll(); }
    public Student getStudentById(Long id) { return studentRepository.findById(id).orElse(null); }
    public Student saveStudent(Student student) { return studentRepository.save(student); }
    public void deleteStudent(Long id) { studentRepository.deleteById(id); }

    // VULNERABLE: SQL Injection - user input concatenated directly into query
    @SuppressWarnings("unchecked")
    public List<Student> searchStudentsByName(String name) {
        String sql = "SELECT * FROM student WHERE first_name = '" + name + "'";
        return entityManager.createNativeQuery(sql, Student.class).getResultList();
    }

}
