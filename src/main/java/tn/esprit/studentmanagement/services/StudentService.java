package tn.esprit.studentmanagement.services;

import org.springframework.stereotype.Service;
import tn.esprit.studentmanagement.entities.Student;
import tn.esprit.studentmanagement.repositories.StudentRepository;

import java.util.List;
import java.util.Optional;

/**
 * Service implementation for Student operations.
 *
 * <p>Uses Spring Data repository methods exclusively – no native SQL –
 * eliminating SonarCloud rule S2077 (dynamic SQL formatting).</p>
 */
@Service
public class StudentService implements IStudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Returns the student with the given id, or {@code null} if not found.
     * Uses {@link Optional#orElse} rather than {@link Optional#get} to avoid
     * a potential {@link java.util.NoSuchElementException} (SonarCloud S3655).
     */
    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    @Override
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    /**
     * Searches students by first name using a Spring Data derived query.
     * This replaces the former native-SQL implementation that triggered
     * SonarCloud rule S2077 (SQL queries should not be vulnerable to
     * injection attacks).
     */
    public List<Student> searchStudentsByName(String name) {
        return studentRepository.findByFirstName(name);
    }
}
